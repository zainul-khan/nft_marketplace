const mongoose = require('mongoose');

// Define the Transaction schema
const transactionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    nft_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NFT',
        required: true
    },
    razorpay_order_id:{
        type: String,
        required: true,
    },
    razorpay_payment_id: {
        type: String,
        required: true,
        default: "NA"
    },
    razorpay_signature: {
        type: String,
        required: true,
        default: "NA"
    },
    amount: {
        type: String,
        required: true
    },
    currency_type: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'pending'
    },
}, {
    timestamps: true
});

//order id badha_do , payment id badha do, payment_method, reciept, 
const Transaction = mongoose.model("Transaction", transactionSchema)
module.exports = Transaction