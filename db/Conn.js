const mongoose = require("mongoose");

mongoose.connect('mongodb://127.0.0.1:27017/nft_marketplace').then(()=>{
    console.log("DB connected Successfully");
}).catch((error)=>{
    console.log("Failed to connect");
});
