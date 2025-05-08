const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

//register a user
router.post('/register', async (req, res) =>{
    const { username, password } = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({username, password: hashedPassword});
        await newUser.save();
        res.status(201).send('User registerd');
    } catch (err){
        res.status(400).send(err.message);
    }
});

// login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username});
        if(!user) return res.status(400).send('User not found');

        const  isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).send('Invalid password');

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET,{
            expiresIn: '1h'
        });
        res.json({token});
    } catch (error) {
        res.status(500).send(error.message);
    }
})

module.exports = router;