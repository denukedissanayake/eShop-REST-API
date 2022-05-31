import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        contactdetails: { type: String },
        location: { type: String },
        role: { type: String, required: true },
        photo: { type :String }
    }, { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
