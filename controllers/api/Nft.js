const Joi = require("joi");
const Nft = require("../../models/Nft");
const Transaction = require("../../models/Transaction");
const User = require("../../models/User");
const PurchasedNft = require("../../models/PurchasedNft")
const Response = require("../../services/Response");
const Razorpay = require("razorpay");

var razorpayInstance = new Razorpay({
    key_id: process.env.Rzp_Key,
    key_secret: process.env.Rzp_Secret,
});

const createNft = async (req, res) => {
    // console.log("shamm", req.file);
    try {

        const schema = Joi.object({
            name: Joi.string().trim().min(4).max(20).required(),
            description: Joi.string().trim().min(1).max(200).required(),
            image: Joi.string().optional(),
            price: Joi.string().required()
        })

        const { error, value } = schema.validate(req.body);

        if (error) {
            return Response.joiErrorResponseData(res, error)
        }


        let nftImg = '/public/nftImages/' + req.file.filename;
        const saveNft = await Nft.create({
            name: value.name,
            description: value.description,
            image: nftImg,
            price: value.price,
            owner: req.authUserId
        })

        return Response.successResponseData(res, "Nft Created Successfully", saveNft)

    } catch (error) {
        console.log("error=>", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}


const fetchNfts = async (req, res) => {
    try {
        const allNfts = await Nft.find({ owner: { $ne: req.authUserId } }).populate("owner");
        return res.render("nft/index", { nfts: allNfts })
    } catch (error) {
        console.log("error=>", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}

const checkoutNft = async (req, res) => {
    try {
        const rzpKey = process.env.Rzp_Key;
        const nftId = req.query.nftid;

        if(!nftId){
            return Response.errorResponseWithoutData(res, "Nft Id is required")
        }
        
        const nftExist = await Nft.findOne({ _id: nftId }).populate("owner");
        
        if (!nftExist) {
            return Response.errorResponseWithoutData(res, "Nft does not exists");
        }

        return res.render("nft/checkout", { nftExist, rzpKey });

    } catch (error) {
        console.log("error=>", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}


const purchaseNft = async (req, res) => {
    try {
        console.log("haeettt", req.query, req.body);
        const nftId = req.body.nftid;
        const fetchNft = await Nft.findOne({ _id: nftId });

        const user = await User.findOne({ _id: req.authUserId });

        var options = {
            amount: fetchNft.price,  // amount in the smallest currency unit
            currency: "INR",
            receipt: Date.now()
        };

        razorpayInstance.orders.create(options, async function (err, order) {
            console.log("order", order);

            if (err) {
                console.log("error->", err);
                return Response.errorResponseWithoutData(res, "Your payment cannot be processed")
            }

            else {
                const createTransaction = await Transaction.create({
                    user_id: req.authUserId,
                    nft_id: fetchNft._id,
                    razorpay_order_id: order.id,
                    amount: fetchNft.price,
                    currency_type: "INR",
                    // status: "pending",
                })
                return res.status(200).send({
                    success: true,
                    msg: 'Order Created',
                    order_id: order.id,
                    amount: req.body.amount,
                    key_id: "rzp_test_b1iTQgmp1SBWo8",
                    product_name: req.body.name,
                    description: req.body.description,
                    contact: user.phone,
                    name: user.name,
                    email: user.email
                });
            }
        });
    } catch (error) {
        console.log("error=>", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}

const verifyPurchase = async (req, res) => {
    try {
        const schema = Joi.object({
            orderId: Joi.string().required(),
            paymentId: Joi.string().required(),
            signature: Joi.string().required(),
            status: Joi.string().required()
        })


        const { error, value } = schema.validate(req.body);

        if (error) {
            return Response.joiErrorResponseData(res, error)
        }

        // const transaction = await Transaction.findOne({ razorpay_order_id: value.orderId, user_id: req.authUserId });

        // console.log("transaction", transaction);
    

        const transaction = await Transaction.findOneAndUpdate({
            razorpay_order_id: value.orderId,
            user_id: req.authUserId
        }, {
            razorpay_payment_id: value.paymentId,
            razorpay_signature: value.signature,
            status: value.status
        }, {
            new: true
        })

        if(transaction){
            await PurchasedNft.create({
                customer_id: req.authUserId,
                nft_id: transaction.nft_id,
                transaction_id: transaction._id
            })
        }

        return Response.successResponseData(res, "Transaction updated successfully", transaction)
    }
    catch (error) {
        console.log("error", error);
        return res.status(500).json({ error: "Something went wrong" })
    }
}


//this api will fetch nfts purchased bu user
const userPurchasedNfts = async (req, res) => {
    try {
        
        const userNfts = await PurchasedNft.find({customer_id: req.authUserId})
        .populate({
            path:'nft_id',
            populate: 'owner',
        });
        console.log(userNfts)
        // return Response.successResponseData(res, "Nfts fetched successfully", userNfts);
        return res.status(200).render('nft/purchased',{nfts:userNfts})

    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ error: "Something went wrong" })
    }
}

const fetchUserCreatedNfts = async (req, res) => {
    try {
        
        const createdNfts = await Nft.find({owner: req.authUserId});
        
        // return Response.successResponseData(res, "Nfts fetched successfully", createdNfts);
        return res.render("nft/usernfts", { nfts:createdNfts})

    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ error: "Something went wrong" })
    }
}

// const userNftPage = async (req, res) => {
//     try {
//         return res.render("nft/usernfts")
//     } catch (error) {
//         console.log("error", error);
//     }
// }
module.exports = {
    createNft,
    purchaseNft,
    fetchNfts,
    checkoutNft,
    verifyPurchase,
    userPurchasedNfts,
    fetchUserCreatedNfts,
    // userNftPage
}