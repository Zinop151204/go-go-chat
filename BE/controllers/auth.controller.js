import User from "../models/user.molder.js"
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from "../ultils/token.js";
export const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "mat khau ko khop" })

        }

        const user = await User.findOne({ username })


        if (user) {
            return res.status(400).json({ error: "tai khoan da ton tai" })
        }

        // hashPassword

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)


        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`


        const newUser = new User({
            fullName,
            username,
            password: hashPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic
        })
        if (newUser) {
            // Generate JWT token here
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({ error: "Dữ liệu người dùng không hợp lệ" });
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "loi may chu" })
    }
}


export const signin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username })
        // kiểm tra mật khẩu có đúng hay ko và mật khẩu ko có trong db thì trả vè rỗng
        const passwordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !passwordCorrect) {
            return res.status(400).json({ error: "tài khoản chưa tồn tại" });
        }
        generateTokenAndSetCookie(user._id, res);
        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("lỗi đăng nhâp rồi", error.message);
        res.status(500).json({ error: "loi may chu" })
    }
}


export const logout = async (req, res) => {
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"đăng xuất thành công"})
    } catch (error) {
        console.log("lỗi đăng xuất rồi", error.message);
        res.status(500).json({ error: "loi may chu" })
    }
}