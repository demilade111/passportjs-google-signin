const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../entity/User");
const { getRepository } = require("typeorm");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const userRepository = getRepository(User);
        let user = await userRepository.findOne({ googleId: profile.id });

        if (!user) {
          user = new User();
          user.googleId = profile.id;
          user.name = profile.displayName;
          // Additional fields as needed
          await userRepository.save(user);
        }

        return cb(null, user);
      } catch (err) {
        return cb(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
