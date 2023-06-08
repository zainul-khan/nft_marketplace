const {
    register,
    login,
    logout,
    loginPage,
    registerPage
} = require("./api/Auth");

const {
    createNft,
    purchaseNft,
    fetchNfts,
    checkoutNft,
    verifyPurchase,
    userPurchasedNfts,
    fetchUserCreatedNfts,
    // userNftPage
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
    verifyPurchase,
    userPurchasedNfts,
    fetchUserCreatedNfts,
    registerPage
   
}