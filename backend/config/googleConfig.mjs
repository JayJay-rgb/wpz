import Strategy from "passport-google-oauth20";
import passport from "passport";
import { user } from "../model/userSchema.mjs";
import "dotenv/config";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const foundUser = await user.findById(id);
    if (!foundUser) {
      throw new Error("User not found");
    }
    done(null, foundUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const foundUser = await user.findOne({ email: profile.emails[0].value });

        if (!foundUser) {
          // No account exists yet — create a new Google user
          const newUser = await user.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            provider: "google",
            googleId: profile.id,
            isVerified: true,
            profilePic: profile.photos?.[0]?.value,
          });
          return done(null, newUser);
        }

        if (!foundUser.googleId) {
          // Existing local account, same email — link Google to it instead of rejecting
          foundUser.googleId = profile.id;
          foundUser.isVerified = true;
          if (!foundUser.profilePic && profile.photos?.[0]?.value) {
            foundUser.profilePic = profile.photos[0].value;
          }
          await foundUser.save();
          return done(null, foundUser);
        }

        // Already linked — normal Google login
        return done(null, foundUser);
      } catch (err) {
        console.error("Google strategy error:", err);
        done(err, null);
      }
    }
  )
);