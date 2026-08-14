import { user } from "../model/userSchema.mjs";
import { hashPassword } from "../utils/hashing.mjs";
import { comparePassword } from "../utils/hashing.mjs";
import { sendVerificationEmail } from "../utils/sendEmail.mjs";

const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }
    const hashedPassword = await hashPassword(password);

    const pin = Math.floor(10000 + Math.random() * 90000).toString();
    const hashedPin = await hashPassword(pin);
    const newUser = await user.create({
      name,
      email,
      password: hashedPassword,
      emailVerificationPin: hashedPin,
      emailVerificationExpires: new Date(Date.now() + 15 * 60 * 1000),
    });

    await sendVerificationEmail(email, pin);

    res
      .status(201)
      .json({
        message:
          "User registered successfully, check your email for the verification code",
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, pin } = req.body;
    if (!email || !pin) {
      return res.status(400).json({ message: "Email and PIN are required" });
    }

    const foundUser = await user.findOne({ email });
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (foundUser.isVerified) {
      return res.status(400).json({ message: "Account already verified" });
    }

    if (
      !foundUser.emailVerificationPin ||
      foundUser.emailVerificationExpires < new Date()
    ) {
      return res
        .status(400)
        .json({ message: "PIN expired, please request a new one" });
    }

    const isMatch = await comparePassword(pin, foundUser.emailVerificationPin);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid PIN" });
    }

    foundUser.isVerified = true;
    foundUser.emailVerificationPin = null;
    foundUser.emailVerificationExpires = null;
    await foundUser.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resendVerificationPin = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const foundUser = await user.findOne({ email });
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (foundUser.isVerified) {
      return res.status(400).json({ message: "Account already verified" });
    }

    const pin = Math.floor(10000 + Math.random() * 90000).toString();
    const hashedPin = await hashPassword(pin);

    foundUser.emailVerificationPin = hashedPin;
    foundUser.emailVerificationExpires = new Date(Date.now() + 15 * 60 * 1000);
    await foundUser.save();

    await sendVerificationEmail(email, pin);

    res.status(200).json({ message: "New verification code sent" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default registerController;
