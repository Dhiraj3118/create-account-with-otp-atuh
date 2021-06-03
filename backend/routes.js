const express = require("express");
const { sendOTP, verifyOTP, createAccount } = require("./controllers");
const router = express.Router();
const { body, validationResult } = require('express-validator');


// TODO: verify email
router.post('/sendotp', [body("email").isEmail().withMessage("Please enter email in proper format")], sendOTP);

// TODO: veirfy otp
router.post('/verifyotp', [body("otp").trim().isLength({ min: 6, max: 6 }).withMessage("Please enter OTP in valid format")], verifyOTP);

// TODO: check email, firstname, lastname
router.post('/createaccount',
    [
        body("email").isEmail().withMessage("Please enter E-Mail in proper format"),
        body("firstname").trim().isLength({ min: 3 }).withMessage("Please enter a proper firstname"),
        body("lastname").trim().isLength({ min: 4 }).withMessage("Please enter a proper lastname")
    ],
    createAccount);


module.exports = router;