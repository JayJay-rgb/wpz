import mongoose from 'mongoose';
import { uploadBufferToCloudinary } from '../utils/cloudinaryUploads.mjs';
import cloudinary from '../config/cloudinary.mjs';
import { user as User } from '../model/userSchema.mjs';

export const addPortfolioItem = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (user.portfolio.length >= 12) {
      return res.status(400).json({ message: 'Portfolio limit reached (12 items max)' });
    }

    let imageUrl = null;
    let publicId = null;

    if (req.file) {
      const result = await uploadBufferToCloudinary(
        req.file.buffer,
        'freelancer-marketplace/portfolio'
      );
      imageUrl = result.secure_url;
      publicId = result.public_id;
    }

    user.portfolio.push({
      imageUrl,
      publicId,
      title: req.body.title,
      description: req.body.description,
      link: req.body.link,
    });

    await user.save();
    res.status(201).json(user.portfolio[user.portfolio.length - 1]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePortfolioItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const user = await User.findById(req.user);

    const item = user.portfolio.id(itemId);

    if (!item) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    if (item.publicId) {
      await cloudinary.uploader.destroy(item.publicId);
    }

    user.portfolio.pull({ _id: itemId });

    await user.save();

    res.status(200).json({ message: 'Portfolio item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const editPortfolioItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { title, description, link } = req.body;

    const user = await User.findById(req.user);
    if (!user) return res.status(401).json({ message: 'Not allowed' });

    const item = user.portfolio.id(itemId);
    if (!item) return res.status(404).json({ message: 'No item found' });

    if (req.file) {
      const result = await uploadBufferToCloudinary(
        req.file.buffer,
        'freelancer-marketplace/portfolio'
      );

      if (item.publicId) {
        await cloudinary.uploader.destroy(item.publicId);
      }

      item.imageUrl = result.secure_url;
      item.publicId = result.public_id;
    }

    if (title !== undefined) item.title = title;
    if (description !== undefined) item.description = description;
    if (link !== undefined) item.link = link;

    await user.save();

    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};