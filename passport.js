const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/users');
require('dotenv').config();

// Facebook Token Strategy
passport.use(
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ facebookId: profile.id });
        if (user) {
          return done(null, user);
        } else {
          user = new User({
            username: profile.displayName,
            facebookId: profile.id,
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
          });
          await user.save();
          return done(null, user);
        }
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
},
    (accessToken, refreshToken, profile, done) => {
        User.findOne({ googleId: profile.id }, (err, user) => {
            if (err) return done(err, false);
            if (user) {
                return done(null, user);
            } else {
                const newUser = new User({
                    username: profile.displayName,
                    googleId: profile.id,
                    firstname: profile.name.givenName,
                    lastname: profile.name.familyName
                });
                newUser.save((err, user) => {
                    if (err) return done(err, false);
                    return done(null, user);
                });
            }
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

module.exports = passport;
