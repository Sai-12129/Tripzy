
import { User } from "../models/user.model.js"
import { createUser } from "../services/user.service.js"
import { validationResult } from "express-validator"
import { BlacklistToken } from "../models/blacklistToken.model.js"


const registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, password } = req.body;

    try {
        const isUserAlready = await User.findOne({ email });
        if (isUserAlready) {
            return res.status(400).json({ message: 'User already exist' });
        }

        const hashedPassword = await User.hashPassword(password);

        const user = await createUser({
            firstName: fullName.firstName,
            lastName: fullName.lastName,
            email,
            password: hashedPassword
        });

        const userToken = user.generateAuthToken();

        return res.status(201).json({ userToken, user });

    } catch (err) {
        console.error('registerUser error:', err);
        return res.status(500).json({ message: err.message });
    }
}

const loginUser = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ message: "Invalid user Details" })
        }

        const isMatch = await user.comparedPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid user Details" })
        }
        const userToken = user.generateAuthToken();

        res.cookie("userToken", userToken);

        res.status(200).json({ userToken, user })
    } catch (err) {
        console.error('loginUser error:', err);
        return res.status(500).json({ message: err.message });
    }
}

const getUserProfile = async (req, res, next) => {
    // now yha se phle to data bejo profile pe 
    res.status(200).json(req.user);
}

const logoutUser = async (req, res, next) => {
    // ✅ Read the token BEFORE clearing the cookie
    const userToken = req.cookies.userToken || req.headers.authorization?.split(' ')[1];

    res.clearCookie("userToken");

    // Blacklist the token so it can't be reused
    if (userToken) {
        await BlacklistToken.create({ token: userToken });
    }

    return res.status(200).json({ message: "Logged Out" });
}

export {
    registerUser,
    loginUser,
    getUserProfile,
    logoutUser
}