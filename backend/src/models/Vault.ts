import mongoose from 'mongoose';

const VaultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vaultName: { type: String, required: true },
  keySalt: { type: String, required: true },
  saltRounds: { type: Number, default: 10 },
  verificationHash: { type: String, required: true },
items: [{
  title: { type: String, required: true },
  link: { type: String },
  description: { type: String },
  encryptedBlob: {
    ciphertext: { type: String, required: true },
    iv: { type: String, required: true },
    tag: { type: String, required: true }
  }
}]
});

export const Vault = mongoose.model('Vault', VaultSchema);