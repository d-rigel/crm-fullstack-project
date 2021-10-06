const express = require("express");
const {
  insertUser,
  getUserByEmail,
  getUserById,
  updatePassword,
} = require("../model/user/User.model");
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper");
const {
  UserAuthorization,
} = require("../middlewares/authorization.middleware");
const {
  setPasswordResetPin,
  getPinByEmailPin,
  deletePin,
} = require("../model/resetPin/resetPin.model");
const {
  mailProcessor,
  mailProcessorUpdate,
} = require("../helpers/email.helper");
const {
  resetPassReqValidation,
  updatePassReqValidation,
} = require("../middlewares/formValidation.middleware");

const router = express.Router();

router.all("/", (req, res, next) => {
  // res.json({ message: "return form user router" });
  next();
});

//Register a user
router.post("/", async (req, res) => {
  const { name, company, address, phone, email, password } = req.body;
  try {
    //hash password
    const hashedPass = await hashPassword(password);

    const newUserObj = {
      name,
      company,
      address,
      phone,
      email,
      password: hashedPass,
    };

    // const result = await insertUser(req.body);
    const result = await insertUser(newUserObj);
    console.log(result);
    res.json({ message: "New user created", result });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
});

//User sign in Router
router.post("/login", async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;

  //hash our password and compare with the db one
  if (!email || !password) {
    return res.json({ message: "error", status: "Invalid form submission" });
  }

  //get user with email from db

  const user = await getUserByEmail(email);
  // console.log(user);

  const pwFrmDb = user && user._id ? user.password : null;

  if (!pwFrmDb)
    return res.json({ status: "error", message: "invalid email or password" });

  const result = await comparePassword(password, pwFrmDb);
  console.log(result);

  if (!result) {
    return res.json({ status: "error", message: "invalid email or password" });
  }

  const accessJWT = await createAccessJWT(user.email, `${user._id}`);
  const refreshJWT = await createRefreshJWT(user.email, `${user._id}`);

  res.json({
    status: " success",
    message: "Login Successfully!",
    accessJWT,
    refreshJWT,
  });
});

//get user profile endpoint
router.get("/", UserAuthorization, async (req, res) => {
  //As if Getting user data from db
  const _id = req.userId;

  const userProfile = await getUserById(_id);
  //3. extract user id
  //4. get user profile based on user id

  res.json({ user: userProfile });
});

//FOR RESET PASSWORD
//A. Create and send password reset pin number
//1. receive email
//2. check if user exists for the email
//3. create unique 6 digit pin
//4. save pin and email in database
//5. email the pin

router.post("/reset-password", resetPassReqValidation, async (req, res) => {
  const { email } = req.body;

  const user = await getUserByEmail(email);
  if (user && user._id) {
    const setpin = await setPasswordResetPin(email);
    // await mailProcessor(email, setpin.pin);
    await mailProcessor(email, setpin.pin);
    // const result = await mailProcessor(email, setpin.pin);
    // if (result && result.messageId) {
    return res.json({
      status: "success",
      message:
        "If the email exist in our database, the passoword reset pin will be sent shortly",
    });
  }
  return res.json({
    status: "error",
    message:
      "If the email exist in our database, the passoword reset pin will be sent shortly",
  });
});

//B. Update password in DB
//1. receive email, pin and new Password
//2. validate pin
//3. encrypt new password
//4. update password in db
//5. send email notification

//C. Server side form validation
//1. create middleware to validate form data

router.patch("/reset-password", updatePassReqValidation, async (req, res) => {
  const { email, pin, newPassword } = req.body;

  const getPin = await getPinByEmailPin(email, pin);

  //set expiring date
  if (getPin._id) {
    const dbDate = getPin.addedAt;
    const expiresIn = 1;
    let expDate = dbDate.setDate(dbDate.getDate() + expiresIn);

    const today = new Date();

    if (today > expDate) {
      return res.json({ status: "error", message: "Invalid or expired pin." });
    }

    //encrypt new password
    const hasPw = await hashPassword(newPassword);
    //store in db
    const user = await updatePassword(email, hasPw);
    if (user._id) {
      //send email notification
      await mailProcessorUpdate(email);

      //delete pin from database
      deletePin(email, pin);

      return res.json({
        status: "success",
        message: "Your password has been updated",
      });
    }
  }
  res.json({
    status: "error",
    message: "Unable to update your password. please try again later",
  });
});

module.exports = router;
