const {
    register,
    login,
    logout,
    loginPage
} = require("./api/Auth");

const {
    createNft,
    purchaseNft,
    fetchNfts,
    checkoutNft,
    verifyPurchase
} = require("./api/Nft")

module.exports = {
    register,
    login,
    logout,
    loginPage,
    createNft,
    purchaseNft,
    fetchNfts,
    checkoutNft,
    verifyPurchase
}