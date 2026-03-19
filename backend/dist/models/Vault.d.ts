import mongoose from 'mongoose';
export declare const Vault: mongoose.Model<{
    user: mongoose.Types.ObjectId;
    vaultName: string;
    keySalt: string;
    saltRounds: number;
    verificationHash: string;
    items: mongoose.Types.DocumentArray<{
        title: string;
        link?: string | null;
        description?: string | null;
        encryptedBlob?: {
            ciphertext: string;
            iv: string;
            tag: string;
        } | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        title: string;
        link?: string | null;
        description?: string | null;
        encryptedBlob?: {
            ciphertext: string;
            iv: string;
            tag: string;
        } | null;
    }> & {
        title: string;
        link?: string | null;
        description?: string | null;
        encryptedBlob?: {
            ciphertext: string;
            iv: string;
            tag: string;
        } | null;
    }>;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    user: mongoose.Types.ObjectId;
    vaultName: string;
    keySalt: string;
    saltRounds: number;
    verificationHash: string;
    items: mongoose.Types.DocumentArray<{
        title: string;
        link?: string | null;
        description?: string | null;
        encryptedBlob?: {
            ciphertext: string;
            iv: string;
            tag: string;
        } | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        title: string;
        link?: string | null;
        description?: string | null;
        encryptedBlob?: {
            ciphertext: string;
            iv: string;
            tag: string;
        } | null;
    }> & {
        title: string;
        link?: string | null;
        description?: string | null;
        encryptedBlob?: {
            ciphertext: string;
            iv: string;
            tag: string;
        } | null;
    }>;
}, {}, mongoose.DefaultSchemaOptions> & {
    user: mongoose.Types.ObjectId;
    vaultName: string;
    keySalt: string;
    saltRounds: number;
    verificationHash: string;
    items: mongoose.Types.DocumentArray<{
        title: string;
        link?: string | null;
        description?: string | null;
        encryptedBlob?: {
            ciphertext: string;
            iv: string;
            tag: string;
        } | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        title: string;
        link?: string | null;
        description?: string | null;
        encryptedBlob?: {
            ciphertext: string;
            iv: string;
            tag: string;
        } | null;
    }> & {
        title: string;
        link?: string | null;
        description?: string | null;
        encryptedBlob?: {
            ciphertext: string;
            iv: string;
            tag: string;
        } | null;
    }>;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    user: mongoose.Types.ObjectId;
    vaultName: string;
    keySalt: string;
    saltRounds: number;
    verificationHash: string;
    items: mongoose.Types.DocumentArray<{
        title: string;
        link?: string | null;
        description?: string | null;
        encryptedBlob?: {
            ciphertext: string;
            iv: string;
            tag: string;
        } | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        title: string;
        link?: string | null;
        description?: string | null;
        encryptedBlob?: {
            ciphertext: string;
            iv: string;
            tag: string;
        } | null;
    }> & {
        title: string;
        link?: string | null;
        description?: string | null;
        encryptedBlob?: {
            ciphertext: string;
            iv: string;
            tag: string;
        } | null;
    }>;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    user: mongoose.Types.ObjectId;
    vaultName: string;
    keySalt: string;
    saltRounds: number;
    verificationHash: string;
    items: mongoose.Types.DocumentArray<{
        title: string;
        link?: string | null;
        description?: string | null;
        encryptedBlob?: {
            ciphertext: string;
            iv: string;
            tag: string;
        } | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        title: string;
        link?: string | null;
        description?: string | null;
        encryptedBlob?: {
            ciphertext: string;
            iv: string;
            tag: string;
        } | null;
    }> & {
        title: string;
        link?: string | null;
        description?: string | null;
        encryptedBlob?: {
            ciphertext: string;
            iv: string;
            tag: string;
        } | null;
    }>;
}>, {}, mongoose.DefaultSchemaOptions> & mongoose.FlatRecord<{
    user: mongoose.Types.ObjectId;
    vaultName: string;
    keySalt: string;
    saltRounds: number;
    verificationHash: string;
    items: mongoose.Types.DocumentArray<{
        title: string;
        link?: string | null;
        description?: string | null;
        encryptedBlob?: {
            ciphertext: string;
            iv: string;
            tag: string;
        } | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        title: string;
        link?: string | null;
        description?: string | null;
        encryptedBlob?: {
            ciphertext: string;
            iv: string;
            tag: string;
        } | null;
    }> & {
        title: string;
        link?: string | null;
        description?: string | null;
        encryptedBlob?: {
            ciphertext: string;
            iv: string;
            tag: string;
        } | null;
    }>;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=Vault.d.ts.map