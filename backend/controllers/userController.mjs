import { user } from "../model/userSchema.mjs";

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const foundUser = await user
      .findById(userId)
      .select("-password -currentRefreshToken -emailVerificationPin -email -emailVerificationExpires");

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: foundUser });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const foundUser = await user.findById(req.user);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, bio, hasCompletedOnboarding } = req.body;

    if (name !== undefined) foundUser.name = name;
    if (bio !== undefined) foundUser.bio = bio;
    if (hasCompletedOnboarding !== undefined) foundUser.hasCompletedOnboarding = hasCompletedOnboarding;

    await foundUser.save();

    res.status(200).json({ user: foundUser });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(200).json({ users: [] });
    }

    const users = await user.find({
      _id: { $ne: req.user },
      name: { $regex: query.trim(), $options: "i" },
    })
      .select("_id name")
      .limit(10);

    res.status(200).json({ users });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};