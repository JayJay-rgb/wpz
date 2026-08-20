import jwt from "jsonwebtoken";
import "dotenv/config";
import { user } from "../model/userSchema.mjs";
import { comparePassword } from "../utils/hashing.mjs";

const refreshController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const foundUser = await user.findById(decoded.id);

    if (!foundUser) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const isValid = await comparePassword(
      refreshToken,
      foundUser.currentRefreshToken
    );

    if (!isValid) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { id: foundUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const newrefreshToken = jwt.sign(
      { id: foundUser._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    foundUser.currentRefreshToken = await hashPassword(newrefreshToken);
    await foundUser.save();

    res.cookie("refreshToken", newrefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ accessToken });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

export default refreshController;