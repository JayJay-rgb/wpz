import { user } from "../model/userSchema.mjs";

export const getMe = async (req, res) => {
  try {
    const foundUser = await user.findById(req.user).select("-password -currentRefreshToken -emailVerificationPin");

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: foundUser });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};