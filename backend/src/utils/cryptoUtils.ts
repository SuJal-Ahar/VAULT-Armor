import argon2 from 'argon2';
import crypto from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';

const normalizePasskey = (passkey: any) => String(passkey);

export const generateSalt = () => {
    const salt = crypto.randomBytes(16).toString('hex');
    return salt;
};

export const hashPasskey = async (passkey: string) => {
    const pass = normalizePasskey(passkey);
    const hash = await argon2.hash(pass, { type: argon2.argon2id });
    return hash;
};

export const verifyPasskey = async (passkey: string, storedHash: string) => {
    const pass = normalizePasskey(passkey);
    const result = await argon2.verify(storedHash, pass);
    return result;
};

const deriveKey = async (passkey: string, salt: string) => {
    const pass = normalizePasskey(passkey);

    const key = await argon2.hash(pass, {
        salt: Buffer.from(salt, 'hex'),
        type: argon2.argon2id,
        hashLength: 32,
        raw: true
    });

    return key;
};

export const encryptData = async (
    plaintext: string,
    passkey: string,
    salt: string
) => {
    const key = await deriveKey(passkey, salt);

    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv(ALGORITHM, key as Buffer, iv);

    let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
    ciphertext += cipher.final('hex');

    const tag = cipher.getAuthTag();

    return {
        ciphertext,
        iv: iv.toString('hex'),
        tag: tag.toString('hex')
    };
};

export const decryptData = async (
    encryptedBlob: any,
    passkey: string,
    salt: string
) => {
    if (!encryptedBlob) {
        throw new Error("❌ encryptedBlob is missing");
    }

    const { ciphertext, iv, tag } = encryptedBlob;

    if (!ciphertext || !iv || !tag) {
        throw new Error("Invalid encrypted data format");
    }

    const key = await deriveKey(passkey, salt);

    try {
        const decipher = crypto.createDecipheriv(
            ALGORITHM,
            key as Buffer,
            Buffer.from(iv, 'hex')
        );

        decipher.setAuthTag(Buffer.from(tag, 'hex'));

        let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;

    } catch (err: any) {
        throw err;
    }
};