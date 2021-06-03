const OTPobj = {
    // email: otp
}
const { body, validationResult } = require('express-validator');
const User = require("./models")
const nodemailer = require("nodemailer");
const { google } = require("googleapis");


// 1. Goto console.cloud.google.com and create a new project.
// 2. Then go to APIs nd services and crete oAuth consent screen using 'https://developers.google.com/oauthplayground' as redirect uri.
// 3. You will get clientId and clientSecret in the credentials tab
// 4. Go to 'https://developers.google.com/oauthplayground' and first of all put your credentials in the gear icon [check use your own credentials]
// 5. In the api input box type 'https://mail.google.com' and authorize api.
// 6. Exchange authorization code for token to get refreshToken

const CLIENT_ID = '63049176664-4c2fnngnppqmespv1qrirj8bs5f74pak.apps.googleusercontent.com';
const CLIENT_SECRET = '8ug2T7waAkfFU5V-EOpaqNHe';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04rl3Da2xvAFYCgYIARAAGAQSNwF-L9Irginz4fi94VdA29zUPjlpMyuRwJAk7wsPkpGQsnrLQrpt1ICh_LuVE7da2p0xeZKzPvM';

// creating oAuthClient
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });


// sending the mail using nodemailer
async function sendMail(to, sub, html) {

    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: '201901022@daiict.ac.in',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = {
            from: 'Dhiraj<201901022@daiict.ac.in>',
            to: to,
            subject: sub,
            text: "this sends only simple text",
            html: html
        }

        const result = await transport.sendMail(mailOptions)

        return result;
    }
    catch (error) {
        console.log("ERROR:", error)
        return error;
    }
}

// generating OTP
const generateOTP = () => {
    const string = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
        OTP += string[Math.floor(Math.random() * 10)]
    }
    return OTP;
}


// sendMail(${email}, ${subject}, ${content})
//     .then(result => console.log("mail sent..."))
//     .catch(error => console.log(error))



exports.sendOTP = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
            param: errors.array()[0].param,
            success: false
        })
    }

    const email = req.body.email;

    User.findOne({ email }, (err, user) => {
        if (user) {
            return res.status(400).json({
                error: "user already exists",
                success: false
            })
        }
        else {
            let otp = generateOTP();
            OTPobj[email] = otp;

            sendMail(email, "Verify Your E-Mail", `OTP for verification of your E-Mail ID is: <br> <h1>${otp}</h1>`)
                .then(result => console.log("mail sent..."))
                .catch(error => console.log(error))

            setInterval(() => {
                delete OTPobj[email]
            }, 2 * 60 * 1000)

            return res.status(200).json({
                success: true,
                email: email,
                otp: otp
            })
        }
    })
}

exports.verifyOTP = (req, res) => {
    // verify the OTP generated and submitted

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({
            error: errors.array()[0].msg,
            param: errors.array()[0].param,
            success: false
        })
    }

    let incomingOTP = req.body.otp;

    if (incomingOTP == OTPobj[req.body.email]) {
        return res.status(200).json({
            msg: "OTP verified successfully",
            success: true
        })
    }

    return res.status(422).json({
        error: "Incorrect OTP",
        success: false
    })
}

exports.createAccount = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({
            error: errors.array()[0].msg,
            param: errors.array()[0].param,
            success: false
        })
    }

    if (req.body.password === req.body.cpassword) {
        const user = new User(req.body);

        user.save((error, user) => {
            if (error) {
                return res.json({
                    error: error,
                    success: false
                });
            }

            return res.json({
                success: true,
                msg: "Account created successfully."
            })
        })
    }
    else {
        return res.status(400).json({
            success: false,
            error: "Password and Confirm Password didnot match"
        })
    }
}

