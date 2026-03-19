export declare const generateSalt: () => string;
export declare const hashPasskey: (passkey: string) => Promise<string>;
export declare const verifyPasskey: (passkey: string, storedHash: string) => Promise<boolean>;
export declare const encryptData: (plaintext: string, passkey: string, salt: string) => Promise<{
    ciphertext: string;
    iv: string;
    tag: string;
}>;
export declare const decryptData: (encryptedBlob: any, passkey: string, salt: string) => Promise<string>;
//# sourceMappingURL=cryptoUtils.d.ts.map