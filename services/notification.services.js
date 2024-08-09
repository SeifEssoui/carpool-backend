const notificationModel = require("../models/notification.model");
const NotificationService = require("./notification.services");
const nodemailer = require("nodemailer");

exports.getNotificationByUser = async (userID) => {
  return await notificationModel.find({ receiver: userID });
};

exports.getAllNotifications = async () => {
  return await notificationModel.find();
};

exports.createNotification = async (params) => {
  const newNotification = new notificationModel(params);
  return await newNotification.save();
};

exports.createReservationCancellationNotification = async (params) => {
  try {
    var content = await notificationModel.create(params);
    return content;

  }catch (error) {
    console.error("Error while adding notification", error);
  throw error;
}
};

exports.createNotification = async (params) => {

  const newNotification = new notificationModel(params);
  return await newNotification.save();
};




exports.sendMail = async (receiver, subject, textBody) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.SERVER_PORT,
      secureConnection: true,
      auth: {
        user: process.env.SERVER_USERNAME,
        pass: process.env.SERVER_PASSWORD,
      },
    });
    console.log(receiver)
    const message = {
      from: process.env.SERVER_MAIL,
      to: receiver,
      subject: subject,
      text: `
            Hello ${receiver.firstname},
            ${textBody}
            Kind regards,
            WorkPoint Team
            `,
    };
    transporter.sendMail(message, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  } catch (e) {
    console.log(e);
  }
};