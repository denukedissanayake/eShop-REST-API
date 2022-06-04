import mongoose from "mongoose"

const OrderSchema = new mongoose.Schema(
    {
        userID: { type: String, required: true },
        srripeOrderID :  { type: String, required: true },
        products: [
            {
                productId: { type: String },
                quantity: { type: Number, default: 1 },
                productName: { type: String },
                productPrice: { type: String },
                productImage: { type: String },
                productBrand: { type: String },
                productSize: { type: String },
                productColor: { type: String }
            },
        ],
        amount: { type: Number, required: true },
        address: { type: Object, required: true },
        status: {type : String, default: "Pending"}
    }, { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);