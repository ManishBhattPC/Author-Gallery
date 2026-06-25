import mongoose from "mongoose"
const userSchema = new mongoose.Schema(
{
   name:{
    type: String,
    required: true,
    trim: true
   },
     email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "author", "admin"],
      default: "user",
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
},
{
   timestamps: true,
}

)
const User = mongoose.model("User", userSchema)

export default User