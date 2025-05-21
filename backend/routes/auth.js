const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

//register a user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
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

router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    User.findById(decoded.id).select('username')
      .then(user => res.json({ username: user.username }))
      .catch(err => res.status(400).json({ error: err.message }));
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});


router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

  
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });
      // Redirect to Angular with token as query param
      //res.redirect(`http://localhost:4200/dashboard?token=${token}`);
      res.redirect(`https://ben-task.vercel.app/dashboard?token=${token}`);
    }
  );
  
  

module.exports = router;