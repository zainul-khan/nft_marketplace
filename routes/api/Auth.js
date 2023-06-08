const userRouter = require("express").Router();
const {userAuth} = require("../../middleware/UserAuth");
const {login, logout, register, loginPage,registerPage} = require("../../controllers/Index");

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/", loginPage);
userRouter.post("/logout", userAuth,logout);
userRouter.get('/register_page',registerPage)

module.exports = userRouter



