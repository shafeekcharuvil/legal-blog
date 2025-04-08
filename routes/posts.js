const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "അനുവാദമില്ല!" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "തെറ്റായ ടോക്കൺ!" });
    }
};

router.get("/", async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "സെർവർ പിശക്!" });
    }
});

router.post("/", verifyToken, async (req, res) => {
    const { title, content, footerNote } = req.body;
    try {
        const newPost = new Post({ title, content, footerNote });
        await newPost.save();
        res.status(201).json({ message: "പോസ്റ്റ് ചേർത്തു!" });
    } catch (error) {
        res.status(500).json({ message: "സെർവർ പിശക്!" });
    }
});

module.exports = router;