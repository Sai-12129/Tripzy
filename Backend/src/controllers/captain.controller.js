import { Captain } from '../models/captain.model.js';
import { createCaptain } from '../services/captain.service.js';
import { BlacklistToken } from '../models/blacklistToken.model.js';
import { validationResult } from 'express-validator';


const registerCaptain = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullName, email, password, vehicle } = req.body;

        const isCaptainAlreadyExist = await Captain.findOne({ email });

        if (isCaptainAlreadyExist) {
            return res.status(400).json({ message: 'Captain already exist' });
        }

        const hashedPassword = await Captain.hashPassword(password);

        const captain = await createCaptain({
            firstName: fullName.firstName,
            lastName: fullName.lastName,
            email,
            password: hashedPassword,
            color: vehicle.color,
            plate: vehicle.plate,
            capacity: vehicle.capacity,
            vehicleType: vehicle.vehicleType,
        });

        const captainToken = captain.generateAuthToken();

        return res.status(201).json({ captainToken, captain });
    } catch (err) {
        console.error('registerCaptain error:', err);
        return res.status(500).json({ message: err.message });
    }
}

const loginCaptain = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        const captain = await Captain.findOne({ email }).select('+password');

        if (!captain) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await captain.comparedPassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const captainToken = captain.generateAuthToken();

        res.cookie('captainToken', captainToken);

        return res.status(200).json({ captainToken, captain });
    } catch (err) {
        console.error('loginCaptain error:', err);
        return res.status(500).json({ message: err.message });
    }
}

const getCaptainProfile = async (req, res, next) => {
    res.status(200).json({ captain: req.captain });
}

const logoutCaptain = async (req, res, next) => {
    try {
        const captainToken = req.cookies.captainToken || req.headers.authorization?.split(' ')[1];

        if (captainToken) {
            await BlacklistToken.create({ token: captainToken });
        }

        res.clearCookie('captainToken');

        return res.status(200).json({ message: 'Logout successfully' });
    } catch (err) {
        console.error('logoutCaptain error:', err);
        return res.status(500).json({ message: err.message });
    }
}

export {
    registerCaptain,
    loginCaptain,
    getCaptainProfile,
    logoutCaptain

}