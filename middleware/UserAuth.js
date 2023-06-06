const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = (req, res, next) => {
    // console.log("inside user auth middleware");
    try {
        // let token = req.header("Authorization")
        // let token =  req.session.userToken
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        // token = token.split("Bearer ")[1];
        // console.log("bhaiyyya2", token);

        jwt.verify(token, process.env.Jwt_Secret, async function (err, decoded) {
            if (err) {
                console.log("token can't be verified", err);
                return res.status(401).json({ error: 'Unauthorized access' });
            }
            else {
                req.authUserId = decoded.id;


                next();
            }
        })

    } catch (error) {
        console.log("error=>", error)
        return res.status(500).json({ error: "Something went wrong" });
    }
}

module.exports = { userAuth }

          // const foundUser = await User.findOne({
                //     _id: req.authUserId
                // })
                // req.loggedUser = foundUser