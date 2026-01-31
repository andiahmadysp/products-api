import User from './src/models/User.js';
import jwt from 'jsonwebtoken';

// Helper function buat bikin JWT token
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Helper function buat set cookie
const setTokenCookie = (res, token) => {
    res.cookie('token', token, {
        httpOnly: true,  // Cookie gak bisa diakses via JavaScript (keamanan dari XSS)
        secure: process.env.NODE_ENV === 'production',  // Hanya HTTPS di production
        sameSite: 'strict',  // Cookie cuma dikirim ke same site (keamanan dari CSRF)
        maxAge: 7 * 24 * 60 * 60 * 1000  // 7 hari dalam milliseconds
    });
};

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Cek apakah user sudah ada
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Bikin user baru
        const user = new User({ username, email, password });
        await user.save();

        // Bikin token dan simpan di cookie
        const token = generateToken(user._id);
        setTokenCookie(res, token);

        res.status(201).json({
            message: 'User registered successfully',
            userId: user._id,
            username: user.username
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Cari user berdasarkan email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Cek password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Bikin token dan simpan di cookie
        const token = generateToken(user._id);
        setTokenCookie(res, token);

        res.json({
            message: 'Login successful',
            userId: user._id,
            username: user.username
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logout = (req, res) => {
    // Clear cookie dengan set maxAge ke 0
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.json({ message: 'Logout successful' });
};

// Endpoint baru buat cek status login
export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};