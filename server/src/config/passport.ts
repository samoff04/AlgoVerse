import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/User";

export const googleAuthEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

if (googleAuthEnabled) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: "/api/auth/google/callback",
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails?.[0]?.value,
              avatarUrl: profile.photos?.[0]?.value,
            });
          }
          done(null, user);
        } catch (err) {
          done(err as Error, undefined);
        }
      }
    )
  );
} else {
  console.warn("Google OAuth not configured — skipping. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable it.");
}

export default passport;