import jwt from "jsonwebtoken";
import "dotenv/config";
import { user } from "../model/userSchema.mjs";
import { comparePassword, hashPassword } from "../utils/hashing.mjs";

const refreshController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(403).json({ message: "Refresh token not found" });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      console.log(err);
      return res.status(403).json({ message: "invalid token" });
    }

    const foundUser = await user.findById(decoded.id);
    if (!foundUser) return res.status(404).json({ message: "No found user" });

    const isValid = await comparePassword(refreshToken, foundUser.currentRefreshToken);
    if (!isValid) {
      return res.sendStatus(403);
    }

    const newRefreshToken = jwt.sign(
      { id: foundUser._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    const accessToken = jwt.sign(
      { id: foundUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const hashedNewRefreshToken = await hashPassword(newRefreshToken);
    foundUser.currentRefreshToken = hashedNewRefreshToken;
    await foundUser.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ accessToken });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

export default refreshController;