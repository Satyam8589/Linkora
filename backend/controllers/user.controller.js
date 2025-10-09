import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import crypto from "crypto";
import { json } from "stream/consumers";

export const register = async (req, res) => {
    try {

        const { name, email, password, username } = req.body;

        if ( !name || !email || !password || !username ) return res.status(400).json({message: "All fields are required" });
        
        const user = await User.findOne({
            email,
            username
        });

        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username
        });

        await newUser.save();

        const profile = new Profile({
            userId: newUser._id
        });

        console.log(newUser);

        return res.json({ message: "User created successfuly" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    
    try {
        const { email, password } = req.body;

        if ( !email || !password) return res.status(400).json({ message: "All fields are required" });

        const user = await User.findOne({
            email
        })

        if (!user) return res.status(404).json({ message: "User not exists" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = crypto.randomBytes(32).toString("hex");

        await User.updateOne({ _id: user._id }, { token });

        return res.json({ message: "You are successfully login",  token });

    } catch (error) {
        return res.status(500).json({ message: error.message }); 
    }
};

export const uploadProfilePicture = async (req, res) => {
    const { token } = req.body;

    try {
        
        const user = await User.findOne({ token: token});
        if (!user) return res.status(400).json({ message: "User not exists" });

        user.profilePicture = req.file.filename;

        await user.save();

        return res.json({ message: 'Profile picture updated' });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateUserProfile = async (req, res) => {

    try {
        const { token, ...newUserData } = req.body;

        const user = await User.findOne({ token: token });

        if (!user) return res.status(404).json({ message: "User not found" });

        const { username, email } = newUserData;

        const existingUser = await User.findOne({ $or: [{ username }, { email }]});

        if (existingUser) {
            if (existingUser || String(existingUser._id) !== String(user._id)) {
                return res.status(400).json({ message: "User already exists" });
            }
        } 

        Object.assign(user, newUserData);
        await user.save();

        return res.json({ message: "User updated" });
        
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};