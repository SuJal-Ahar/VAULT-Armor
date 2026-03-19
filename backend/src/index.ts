import express from "express";
import { encryptData, decryptData, hashPasskey, verifyPasskey } from "./utils/cryptoUtils.js";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import crypto from "node:crypto";
import { UserValidSchema } from "./schemas/userValidationSchema.js";
import bcrypt from "bcrypt";
import User from "./models/UserModel.js";
import jwt from "jsonwebtoken";
import { LoginSchema } from "./schemas/loginValidation.js";
import mongoose from "mongoose";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import { Vault } from "./models/Vault.js";

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
const JWT_SECRET = process.env.JWT_SECRET;

const rawTemplate = process.env.MONGODB_URI_TEMPLATE;
const dbPassword = process.env.DB_PASSWORD;

if (!rawTemplate || !dbPassword) {
  throw new Error('MONGODB_URI_TEMPLATE and DB_PASSWORD are required');
}

const encodedPassword = encodeURIComponent(dbPassword);
const MONGODB_URI = rawTemplate.replace("<db_password>", encodedPassword);

const app = express();
app.use(express.json());
app.use(cors());

await mongoose.connect(MONGODB_URI);

app.get("/", (req, res) => {
    res.send("Backend running");
});

app.post("/api/v1/signup", async (req, res) => { 
    const result = UserValidSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json(result.error);
    
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
        username: req.body.username,
        email: req.body.email,
        password: hashPassword,
    });
    return res.json({ message: "Signup Complete" });
}); 

app.post("/api/v1/signin", async (req, res) => {
    const result = LoginSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json(result.error);

    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.json({ message: "no Username" });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid username or password" });

    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ message: "Login successful", token });
}); 
app.post("/api/v1/vault", authMiddleware, async (req, res) => {
  try {
    const { vaultName, passkey } = req.body;

    if (!vaultName || !passkey) {
      return res.status(400).json({ message: "Missing vault details" });
    }
    //@ts-ignore
    const keySalt = crypto.randomBytes(16).toString("hex");
    const vHash = await hashPasskey(passkey);

    const created = await Vault.create({
      //@ts-ignore
      user: req.userId,
      vaultName,
      keySalt,
      saltRounds: 10,
      verificationHash: vHash,
      items: []
    });

    res.status(201).json({
      message: "Vault created successfully",
      vault: {
        _id: created._id,
        vaultName: created.vaultName,
        keySalt: created.keySalt,
        saltRounds: created.saltRounds,
      },
    });

  } catch (error: any) {
    res.status(500).json({ message: "Error creating vault", error: error?.message || String(error) });
  }
});
app.get("/api/v1/vaults", authMiddleware, async (req, res) => {
  try {
    //@ts-ignore
    const vaults = await Vault.find({ user: req.userId })
      .select("_id vaultName keySalt saltRounds")
      .sort({ vaultName: 1 });
    res.json({ vaults });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching vaults", error: error.message });
  }
});

app.post("/api/v1/vault/open", authMiddleware, async (req, res) => {
    try {
        const { vaultId, passkey } = req.body;

        //@ts-ignore
        const vault = await Vault.findOne({ _id: vaultId, user: req.userId });

        if (!vault) {
            return res.status(404).json({ message: "Vault not found" });
        }

        //@ts-ignore
        const isMatch = await verifyPasskey(passkey, vault.verificationHash);

        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect passkey" });
        }

        const items: any[] = [];

        for (let i = 0; i < vault.items.length; i++) {
            const item = vault.items[i];
            if (!item) continue;

            if (
              //@ts-ignore
              (!item.encryptedBlob || !item.encryptedBlob.ciphertext || !item.encryptedBlob.iv || !item.encryptedBlob.tag)
            ) {
                throw new Error("Corrupted encrypted data");
            }

            const decrypted = await decryptData(//@ts-ignore
                item.encryptedBlob,
                passkey,
                vault.keySalt
            );

            items.push({
                //@ts-ignore
                id: item._id,
                //@ts-ignore
                title: item.title,
                //@ts-ignore
                link: item.link || "",
                //@ts-ignore
                description: item.description || "",
                password: decrypted
            });
        }

        res.json({ success: true, items });

    } catch (err: any) {
        res.status(500).json({ message: "Decryption error" });
    }
});

app.delete("/api/v1/vault/:vaultId", authMiddleware, async (req, res) => {
  try {
    const { vaultId } = req.params;
    //@ts-ignore
    const deleted = await Vault.findOneAndDelete({ _id: vaultId, user: req.userId });
    if (!deleted) return res.status(404).json({ message: "Vault not found" });
    res.json({ message: "Vault deleted" });
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting vault", error: error.message });
  }
});

app.delete("/api/v1/vault/:vaultId/item/:itemId", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { vaultId, itemId } = req.params;
    const { passkey } = req.body;
    if (!passkey) return res.status(400).json({ message: "Passkey is required" });

    //@ts-ignore
    const vault = await Vault.findOne({ _id: vaultId, user: req.userId });
    if (!vault) return res.status(404).json({ message: "Vault not found" });

    //@ts-ignore
    const isMatch = await verifyPasskey(passkey, vault.verificationHash);
    if (!isMatch) return res.status(401).json({ message: "Incorrect passkey" });

    //@ts-ignore
    const sub = vault.items.id(itemId);
    if (!sub) return res.status(404).json({ message: "Item not found" });

    //@ts-ignore
    sub.deleteOne();
    await vault.save();

    res.json({ message: "Password deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting item", error: error.message });
  }
});

app.post("/api/v1/vault/add-item", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { vaultId, passkey, title, password, link, description } = req.body;
    if (!vaultId || !passkey || !title || !password) return res.status(400).json({ message: "Missing fields" });

    //@ts-ignore
    const vault = await Vault.findOne({ _id: vaultId, user: req.userId });
    if (!vault) return res.status(404).json({ message: "Vault not found" });

    //@ts-ignore
    const isMatch = await verifyPasskey(passkey, vault.verificationHash);
    if (!isMatch) return res.status(401).json({ message: "Incorrect passkey" });

    const blob = await encryptData(password, passkey, vault.keySalt);

    vault.items.push({
      title,
      link: link || "",
      description: description || "",
      encryptedBlob: blob
    });

    await vault.save();
    res.status(201).json({ message: "Password added and encrypted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.listen(3000, () => {});