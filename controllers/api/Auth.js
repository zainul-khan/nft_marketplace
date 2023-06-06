const Joi = require("joi");
const User = require("../../models/User");
const Response = require("../../services/Response");
const AuthService = require("../../services/AuthService");
const HashService = require("../../services/HashService");


const register = async (req, res) => {
    try {

        const schema = Joi.object({
            name: Joi.string().min(3).max(40).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(5).required(),
            phone: Joi.array().items(Joi.string()).required(),
        });

        const { error, value } = schema.validate(req.body);

        if (error) {
            return Response.joiErrorResponseData(res, error);
        }

        const userExist = await User.findOne({ email: value.email });
        if (userExist) {
            return Response.errorResponseWithoutData(res, "This email already exists")
        }

        const hashNewPassword = await HashService.hashPwd(value.password);


        const saveUser = await User.create({
            name: value.name,
            email: value.email,
            password: hashNewPassword,
            phone: value.phone
        })

        if (saveUser) {
            const generateToken = await AuthService.issueToken({ id: saveUser.id })
            saveUser.reset_token = generateToken
            await saveUser.save()
        }

        return Response.successResponseData(res, "Registered succesfully", saveUser);

    } catch (error) {
        console.log("error=>", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}

const loginPage = async (req, res) => {
    try {
        return res.render("login/index")
    } catch (error) {
        console.log("error", error);
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const schema = Joi.object({
            email: Joi.string().email().trim().required(),
            password: Joi.string().required()
        })

        const { error, value } = schema.validate({ email, password });

        if (error) {
            return Response.joiErrorResponseData(res, error);
        }

        const userExist = await User.findOne({ email: value.email, is_active: true })
        // .select("first_name last_name email password phone is_manager");

        if (!userExist) {
            console.log("not exists");
            return Response.errorResponseWithoutData(res, 'Invalid Credentials');
        }

        const comparePass = await HashService.comparePwd(value.password, userExist.password);

        if (!comparePass) {
            return Response.errorResponseWithoutData(res, 'Invalid Credentials')
        }

        const generateToken = await AuthService.issueToken({ id: userExist.id })


        const updatedResetToken = await User.findOneAndUpdate(
            { email: value.email },
            { reset_token: generateToken },
            { new: true }
        )

        if (!updatedResetToken) {
            return Response.errorResponseWithoutData('Reset token cannot be updated');
        }

        const data = {
            updatedResetToken
        };


        req.session.userToken = generateToken;
        // return Response.successResponseData(res, 'Logged in successfully!', data);
        res.cookie('token', generateToken, { httpOnly: true });

        return res.redirect("/api/v1/nft/show")

    } catch (error) {
        console.log("error=>", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}

const logout = async (req, res) => {
    console.log("hii", req.authUserId);
    try {
        const user = await User.findById(req.authUserId);

        if (!user) {
            return Response.errorResponseWithoutData(res, "User does not exist");
        }

        user.reset_token = null;
        await user.save();

        return Response.successResponseWithoutData(res, "User logged out successfully");

    } catch (error) {
        console.log("error=>", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}

module.exports = { register, login, logout, loginPage }