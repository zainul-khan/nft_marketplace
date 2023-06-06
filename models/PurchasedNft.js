const mongoose = require('mongoose');

const purchasedNftSchema = new mongoose.Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    nft_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nft',
        required: true
    },
    transaction_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        required: true
    }
}, {
    timestamps: true
})

const PurchasedNft = mongoose.model("PurchasedNft", purchasedNftSchema)
module.exports = PurchasedNft