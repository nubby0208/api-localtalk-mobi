const asyncHandler = require('express-async-handler');
// const User = require('../models/User');
const { userSchemaModel } = require('../models/userModel');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const jwt = require('jsonwebtoken');
const countries = require('i18n-iso-countries');
const passwordHash = require("password-hash");
const nodemailer = require('nodemailer');
const { getCountryCode } = require('../geoNamesAxios');
const { numbersSchemaModel } = require('../models/NumberModels');
const { settingsSchemaModel } = require('../models/settingsModel');
const mongoService = require('../utils/mongo.service');
const MongoClient = require('mongodb').MongoClient;
const urlMongo = "mongodb+srv://Leo:admin2158600@cluster0.93qwz.mongodb.net/admin_panel?retryWrites=true&w=majority";

exports.register = asyncHandler(async (req, res, next) => {
  // const ipinfo = await fetch(`https://ipinfo.io/?token=${process.env.IP_INFO_TOKEN}`);
  // const geo = await ipinfo.json();
  // const country = countries.getName(geo.country, 'en', { select: 'official' });

  // const { name, email, password, gender, role, coverage, phoneNumber, address, isVerified, status, note, number, deviceToken } = req.body;
  const { name, email, password, gender, number, deviceToken } = req.body;
  let { location } = req.body;
  const hashedPassword = await passwordHash.generate(password);

  //const user = await userSchemaModel.findOne({ number });

  mongoService.findOne("users", { number }, async (result) => {

    console.log("result===>", result);
    let user = result
    if (user) {
      return res.status(401).json({
        success: false,
        message: "The number already registered. Please choose another."
      });
    }

    if (location) {
      const locationObj = location.split(',');
      location = {
        type: "Point",
        coordinates: [Number(locationObj[1].trim()), Number(locationObj[0].trim())]
      };
    } else {
      location = {
        type: "Point",
        coordinates: [37.617680, 55.755871]
      };
    }
    const countryCode = await getCountryCode(location.coordinates[1], location.coordinates[0]);

    const params = {
      name: name,
      email: email,
      // gender: gender,
      password: hashedPassword,
      originPassword: password,
      // role: role,
      // coverage: coverage,
      // phoneNumber: phoneNumber,
      // address: address,
      location: location,
      country: countryCode.data.countryName,
      // isVerified: isVerified,
      // status: status,
      // note: note,
      like: 1,
      created: new Date(),
      number: number,
      deviceToken: deviceToken
    };

    const userModel = userSchemaModel(params);
    userModel.save(async err => {
      console.log("err===>", err);
      if (err) {
        res.status(401).json({
          success: false,
          message: err.message
        });
      } else {
        const accessToken = jwt.sign({ userModel }, 'secret');
        mongoService.findOne("numbers", { number }, async (result) => {
          if (!result) {
            mongoService.save("numbers", { number: number, isAssigned: true, created: 1646159576 }, async (result) => {
              console.log("Register findOneAndUpdate===>", result);
            });
          } else {
            mongoService.findOneAndUpdate("numbers", { number: number }, { isAssigned: true }, (result) => {
              console.log("Register findOneAndUpdate===>", result);
            })
          }
        });

        //numbersSchemaModel.findOneAndUpdate({ number }, { isAssigned: true });
        res.json({
          success: true,
          message: 'register successfully',
          accessToken: accessToken,
          user: userModel
        });
      }
    });
  });

  // console.log(user);

});

exports.login = asyncHandler(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await userSchemaModel.findOne({ email });

  if (!user) return res.json({ success: false, message: 'The email address does not exist.' }).status(400);

  const isPasswordMatch = await passwordHash.verify(
    password,
    user.password
  );

  if (!isPasswordMatch) {
    return res.json({
      success: false,
      message: 'Incorrect username or password.'
    }).status(400);
  }

  let accessToken = null;
  if (user.token) {
    const decoded = jwt.verify(user.token, 'secret');
    if (decoded && decoded.user._id == user._id) {
      accessToken = user.token;
    }
  }
  if (!accessToken)
    accessToken = jwt.sign({ user }, 'secret', { expiresIn: '365d' });

  await userSchemaModel.findOneAndUpdate({ email }, { online: true, token: accessToken });

  res.json({
    success: true,
    message: 'login successfully',
    accessToken,
    user
  });
});

exports.loginV2 = asyncHandler(async (req, res, next) => {
  const number = req.body.number;
  const password = req.body.password;

  const user = await userSchemaModel.findOne({ number });

  if (!user) return res.json({ success: false, message: 'The number does not exist.' }).status(400);

  const isPasswordMatch = await passwordHash.verify(
    password,
    user.password
  );

  if (!isPasswordMatch) {
    return res.json({
      success: false,
      message: 'Incorrect number or password.'
    }).status(400);
  }

  let accessToken = null;
  if (user.token) {
    const decoded = jwt.verify(user.token, 'secret');
    if (decoded && decoded.user._id == user._id) {
      accessToken = user.token;
    }
  }
  if (!accessToken)
    accessToken = jwt.sign({ user }, 'secret', { expiresIn: '365d' });

  await userSchemaModel.findOneAndUpdate({ number }, { online: true, token: accessToken });

  res.json({
    success: true,
    message: 'login successfully',
    accessToken,
    user
  });
});

exports.adminlogin = asyncHandler(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await userSchemaModel.findOne({ email, role: 'admin' });
  if (!user) return res.json({ success: false, message: 'There is no user corresponding to the email address.' }).status(400);

  const isPasswordMatch = await passwordHash.verify(
    password,
    user.password
  );

  if (!isPasswordMatch) {
    return res.json({ success: false, message: 'Wrong password' }).status(400);
  }

  let accessToken = null;
  try {
    if (user.token) {
      const decoded = jwt.verify(user.token, 'secret');
      if (decoded && decoded.user._id == user._id) {
        accessToken = user.token;
      }
    }
  } catch (err) {

  }
  if (!accessToken)
    accessToken = jwt.sign({ user }, 'secret', { expiresIn: '365d' });

  await userSchemaModel.findOneAndUpdate({ email }, { online: true, token: accessToken });

  res.json({
    success: true,
    message: 'login successfully',
    accessToken,
    user
  });
});

exports.myAccount = asyncHandler(async (req, res, next) => {
  const user = await userSchemaModel.findById(req.user._id);
  res.json({
    success: true,
    user
  });
});

exports.logout = asyncHandler(async (req, res, next) => {

  const email = req.user.email;
  await userSchemaModel.findOneAndUpdate({ email }, { online: false, token: '' });

  res.json({
    success: true,
    message: 'logout successfully'
  });

});

exports.putState = asyncHandler(async (req, res, next) => {
  const email = req.body.email;
  const user = await userSchemaModel.findOneAndUpdate({ email }, { online: req.body.onlineState });
  res.json({
    success: true,
    message: 'set state successfully',
    state: user.online
  });
});

exports.getState = asyncHandler(async (req, res, next) => {
  const email = req.body.email;
  const user = await userSchemaModel.findOne({ email });
  res.json({
    success: true,
    state: user.online
  });
});

exports.retrievePasswordMailSend = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await userSchemaModel.findOne({ email });
  if (!user) {
    return res.json({
      success: false,
      message: `Unregistered email: ${email}`
    });
  }
  const verifyCode = Math.floor(100000 + Math.random() * 900000);

  const parameterSettings = await settingsSchemaModel.findOne({ type: "parameter" });
  let adminEmail = (parameterSettings && parameterSettings.admin_mail_address) || 'toptalkapp@gmail.com';
  let adminPassword = (parameterSettings && parameterSettings.admin_mail_password) || 'My0428loaclchat';
  let adminSubject = (parameterSettings && parameterSettings.admin_mail_subject) || 'Toptalk APP Verification Code';
  const transporter = nodemailer.createTransport({
    port: 465,               // true for 465, false for other ports
    host: "smtp.gmail.com",
    auth: {
      user: adminEmail,
      pass: adminPassword,
    }
  });
  const fromEmail = (parameterSettings && parameterSettings.admin_mail_address) || 'toptalkapp@gmail.com';
  const mailData = {
    from: fromEmail,  // sender address
    to: email,   // list of receivers
    subject: adminSubject,
    text: 'Verification Code',
    html: `<b><strong>${verifyCode}</strong></b>`
  };
  transporter.sendMail(mailData, function (err, info) {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        message: 'Failed Mail Sending',
        code: verifyCode,
        user_id: user._id,
        error: err
      });
    }
    else {
      res.json({
        success: true,
        code: verifyCode,
        user_id: user._id,
        message_id: info.messageId
      });
    }
  });
});

exports.registerMailSend = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const verifyCode = Math.floor(100000 + Math.random() * 900000);

  const parameterSettings = await settingsSchemaModel.findOne({ type: "parameter" });
  let adminEmail = (parameterSettings && parameterSettings.admin_mail_address) || 'toptalkapp@gmail.com';
  let adminPassword = (parameterSettings && parameterSettings.admin_mail_password) || 'My0428loaclchat';
  let adminSubject = (parameterSettings && parameterSettings.admin_mail_subject) || 'Toptalk APP Verification Code';

  const transporter = nodemailer.createTransport({
    port: 465,               // true for 465, false for other ports
    host: "smtp.gmail.com",
    auth: {
      user: adminEmail,
      pass: adminPassword,
    }
  });

  const fromEmail = (parameterSettings && parameterSettings.admin_mail_address) || 'toptalkapp@gmail.com';
  const mailData = {
    from: fromEmail,  // sender address
    to: email,   // list of receivers
    subject: adminSubject,
    text: 'Verification Code',
    html: `<b><strong>${verifyCode}</strong></b>`
  };
  transporter.sendMail(mailData, function (err, info) {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        message: 'Failed Mail Sending',
        code: verifyCode,
        error: err
      });
    }
    else {
      res.json({
        success: true,
        code: verifyCode,
        message_id: info.messageId
      });
    }
  });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;
  let user;
  try {
    user = await userSchemaModel.findById(userId);
  } catch (err) {
    return res.status(500).json({ error: true, data: "no user found !" });
  }
  const newPassword = req.body.new_password;
  const hashedPassword = await passwordHash.generate(newPassword);
  const newUser = await userSchemaModel.findByIdAndUpdate(userId, { password: hashedPassword, originPassword: newPassword }).exec((err) => {
    if (err) res.status(400).send({ error: true, data: 'err' + err });
    else res.send({ error: false, data: 'done' });
  });
});