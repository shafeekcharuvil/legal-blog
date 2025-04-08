const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const hardcodedUser = {
    username: "admin",
    password: "$2a$10$your_hashed_password" // ഈ ഭാഗം പിന്നീട് മാറ്റും
};

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (username !== hardcodedUser.username) {
        return res.status(400).json({ message: "തെറ്റായ യൂസർനെയിം!" });
    }

    const isMatch = await bcrypt.compare(password, hardcodedUser.password);
    if (!isMatch) {
        return res.status(400).json({ message: "തെറ്റായ പാസ്‌വേഡ്!" });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
});

module.exports = router;