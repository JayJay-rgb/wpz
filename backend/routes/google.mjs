import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { user } from "../model/userSchema.mjs";
import { hashPassword } from "../utils/hashing.mjs";
import "dotenv/config";

const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/auth/google/redirect",
  passport.authenticate("google", { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }),
  async (req, res) => {
    try {
      const foundUser = req.user;

      const accessToken = jwt.sign(
        { id: foundUser._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      const refreshToken = jwt.sign(
        { id: foundUser._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      const hashedRefreshToken = await hashPassword(refreshToken);
      foundUser.currentRefreshToken = hashedRefreshToken;
      await foundUser.save();

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.redirect(`${process.env.CLIENT_URL}/oauth-success?accessToken=${accessToken}`);
    } catch (err) {
      console.error(err);
      res.redirect(`${process.env.CLIENT_URL}/login`);
    }
  }
);

export default router;