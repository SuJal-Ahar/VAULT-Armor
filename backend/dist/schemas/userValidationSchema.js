import { email, z } from "zod";
export const UserValidSchema = z.object({
    username: z.string()
        .min(3)
        .max(100),
    email: z.email(),
    password: z.string()
        .min(8)
        .max(100)
        .regex(/[a-z]/, "Must contain a lowercase letter")
        .regex(/[A-Z]/, "Must contain an uppercase letter")
        .regex(/[0-9]/, "Must contain a number")
});
//# sourceMappingURL=userValidationSchema.js.map