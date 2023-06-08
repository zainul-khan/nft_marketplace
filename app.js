require("dotenv").config();
require("./db/Conn");
const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const cookieParser = require('cookie-parser');

const Port = process.env.Port

const userRouter = require("./routes/api/Auth");
const nftRouter = require("./routes/api/Nft");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}))

app.use(cookieParser());

app.use("/public", express.static(path.join(__dirname + "/public/")))
console.log(path.join(__dirname + "/public/"));
app.use("/api/v1/user", userRouter);
app.use("/api/v1/nft", nftRouter);

app.set("views", path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
    res.status(200).render('home/index')
})
app.listen(Port, (err) => {
    if (err) {
        console.log("Error=>", err);
    } else {
        console.log(`Listening to port ${Port}`);
    }
})
