import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const authmiddlewareVerification = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            return res.status(400).json("Auth Token is not Provided!");
        }

        const token = authHeader.replace("Bearer ", '').trim();
        const decoded = jwt.verify(token, process.env.JWT_SECERT_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export default authmiddlewareVerification;