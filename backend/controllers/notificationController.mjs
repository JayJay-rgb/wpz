import  {notification}  from "../model/notificationSchema.mjs";

export const sendNotification = async (io, { userId, type, message, link }) => {
    try {
        const newNotification = await notification.create({
            user: userId,
            type,
            message,
            link
        });

        io.to(userId.toString()).emit("newNotification", newNotification);

        return newNotification;
    } catch (err) {
        console.log(err);
    }
}

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await notification
      .find({ user: req.user })
      .sort({ createdAt: -1 });

    res.status(200).json({ notifications });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const foundNotification = await notification.findById(notificationId);
    if (!foundNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (foundNotification.user.toString() !== req.user) {
      return res.status(403).json({ message: "Not allowed" });
    }

    foundNotification.read = true;
    await foundNotification.save();

    res.status(200).json({ notification: foundNotification });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
