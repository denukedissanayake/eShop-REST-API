import mongoose from "mongoose"

const CustomerSchema = new mongoose.Schema(
    {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        photo: { type :String }
    }, { timestamps: true }
);

module.exports = mongoose.model("Customer", CustomerSchema);