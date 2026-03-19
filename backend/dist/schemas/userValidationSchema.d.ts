import { z } from "zod";
export declare const UserValidSchema: z.ZodObject<{
    username: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=userValidationSchema.d.ts.map