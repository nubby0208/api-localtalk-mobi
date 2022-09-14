"use strict";

const serviceAccount = require('../vchatappmongo-firebase-adminsdk-r81s8-00cd33ab16.json');
var admin = require("firebase-admin");

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://yourtech-a45201.firebaseio.com"
// });
const { notificationsSchemaModel } = require('../models/notificationsModel');


module.exports = {

    getNotifications: async (req, res) => {

        const notifications = await notificationsSchemaModel.find({ notif_to_user: req.body.user_id }).sort({ created: -1 });
        if (notifications.length === 0) {
            res.status(500).json({ error: true, data: "no Notifications yet" });
        } else {
            res.status(200).json({ error: false, data: notifications });
        }

    },
    sendPushNotification: (req, res) => {
        const pushData = req.body.pushData
        const options = {
            contentAvailable: true,
            priority: "high",
            sound: "default", //{critical:true,name:"default",volume:100}
            mutableContent: true
        };
        const payload = {
            "notification": {
                body: pushData.message,
                title: pushData.title,
                sound: "default"
            },
            "data": pushData
        };

        if (pushData.deviceToken) {
            admin.messaging().sendToDevice(pushData.deviceToken, payload, options)
                .then((response) => {
                    console.log('FCM Notification sent successfully:', response);
                    return res.status(200).send({ error: false, data: 'sent_successfully' });
                })
                .catch(function (error) {
                    return res.status(500).send({ error: true, data: 'not_sent_successfully' });
                });
        } else {
            return res.status(500).send({ error: true, data: 'deviceToken_not_found' });
        }
    }


};