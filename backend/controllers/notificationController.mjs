import { notification } from "../model/notificationSchema.mjs";

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
