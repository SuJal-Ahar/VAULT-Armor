import mongoose from "mongoose";

// interface UserI {
//   username: string;
//   email: string;
//   password: string;
// }

// const UserSchema = new mongoose.Schema({
//   username: { type: String,unique : true},
//   email: { type: String , unique : true},
//   password: { type: String},
// });

// const User = mongoose.model("User", UserSchema);

// export default User;
// export { UserSchema };

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique:true,
    // Optional: async validator (UX-level check)
    async validate(value: string) {
      const existing = await User.findOne({ username: value });
      if (existing) {
        throw new Error("Username already exists");
      }
    },
  },

  email: {
    type: String,
    required: true,

    // Optional: async validator (UX-level check)
    async validate(value: string) {
      const existing = await User.findOne({ email: value });
      if (existing) {
        throw new Error("Email already exists");
      }
    },
  },

  password: {
    type: String,
    required: true,
  },
});

/**
 * 🚨 FINAL AUTHORITY (MANDATORY)
 * Database-level protection against race conditions
 */
UserSchema.index(
  { email: 1, username: 1 },
  { unique: true }
);

const User = mongoose.model("User", UserSchema, "Users");
export default User;
