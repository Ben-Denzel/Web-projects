const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // Update path accordingly

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //callbackURL: "http://localhost:5000/api/auth/google/callback",
    callbackURL: "https://task-manager-backend-hu0f.onrender.com/api/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    // Find or create user
    const existingUser = await User.findOne({ googleId: profile.id });
    if (existingUser) return done(null, existingUser);

    const newUser = await User.create({ googleId: profile.id, username: profile.displayName });
    return done(null, newUser);
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user));
});
