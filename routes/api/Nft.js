const nftRouter = require("express").Router()
const {createNft, purchaseNft, fetchNfts, checkoutNft, verifyPurchase, userPurchasedNfts, fetchUserCreatedNfts,userNftPage} = require("../../controllers/Index");
const {userAuth} = require("../../middleware/UserAuth");
const multer = require("multer");


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        if(file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype =="image/jpeg"|| file.mimetype == "image/webp"|| file.mimetype == "image/gif"){
            cb(null, "public/ntfImages")
        }
    },
    filename: (req, file, cb) => {
        const uniqueNum = Date.now() + Math.round(Math.random() * 10); 
        cb(null, uniqueNum + file.originalname);
    }
})

const upload = multer({storage: storage})


nftRouter.post("/create", [upload.single("image"), userAuth], createNft);
nftRouter.get("/show", userAuth ,fetchNfts);
nftRouter.get("/checkout", userAuth, checkoutNft);
nftRouter.post("/purchase", userAuth,purchaseNft);
nftRouter.put("/verify_purchase", userAuth, verifyPurchase);
nftRouter.get("/puchased_nfts", userAuth, userPurchasedNfts);
nftRouter.get("/created_nfts", userAuth, fetchUserCreatedNfts)
// nftRouter.get("/usernftpage", userAuth, userNftPage)
//purchased nfts


//created by me nfts 
// Nft.find({owner: req.authUseriD})

module.exports = nftRouter;
