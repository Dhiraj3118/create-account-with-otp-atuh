let globalOTP = "";
let validCount = [0, 0, 0, 0, 0, 0];

let email = document.getElementById("email");
let otpBtn = document.getElementById("otp-btn");
let firstName = document.getElementById("firstname");
let lastName = document.getElementById("lastname");
let contact = document.getElementById("contact");
let password = document.getElementById("password");
let cpassword = document.getElementById("cpassword");
let submitBtn = document.getElementById("submit-btn");

let otp = document.getElementById("OTP");
let verifyBtn = document.getElementById("verify-btn");
let otpForm = document.getElementById("otp-form");
let errorMsg = document.getElementById("error-msg");
let notYourEmail = document.getElementById("not-ur-email");

let pswdEye = document.getElementById("password-eye");
let cpswdEye = document.getElementById("cpassword-eye");
let pswdEyeSlash = document.getElementById("password-eye-slash");
let cpswdEyeSlash = document.getElementById("cpassword-eye-slash");

// ************************** Functions **************************

// generating OTP
function generateOTP() {
  var string = "0123456789";
  let OTP = "";
  var len = string.length;
  for (let i = 0; i < 6; i++) {
    OTP += string[Math.floor(Math.random() * len)];
  }
  console.log(OTP);
  globalOTP = OTP;
  return OTP;
}

// sending mail
function sendEmail() {
  Email.send({
    Host: "smtp.elasticemail.com",
    Username: "201901022@daiict.ac.in",
    Password: "0EF12074B10E5FDDD2DE36B6B33B2FC17D07",
    To: `${email.value}`,
    From: "201901022@daiict.ac.in",
    Subject: "OTP for Email Verification",
    Body: `OTP for verification is ${generateOTP()}`,
  }).then(() => {
    otpForm.style.top = "0";
    otpBtn.textContent = "OTP sent";
    otpBtn.classList.add("sent");
    notYourEmail.textContent = `Change Your Email: ${email.value}`;
  });
}

// changing Email ID
function changeEmail() {
  otpForm.style.top = "-20rem";
  otpBtn.textContent = "Send OTP";
  otpBtn.classList.remove("sent");
}

// verifying OTP
function verifyOTP() {
  let input = document.getElementById("OTP").value;
  if (input.toString() == globalOTP) {
    otpForm.style.top = "-20rem";
    otpBtn.textContent = "Email Verified";
    otpBtn.disabled = true;
    otpBtn.classList.remove("sent");
    otpBtn.classList.add("verified");
    email.disabled = true;
    [firstName, lastName, contact, password, cpassword].forEach(
      (i) => (i.disabled = false)
    );
    validCount[0] = 1;
  } else {
    errorMsg.textContent = "Incorrect OTP";
  }
}

// Switching eye buttons
function switchEyeBtn(a, b, c, type) {
  a.classList.add("hidden");
  b.classList.remove("hidden");
  c.type = type;
}

// validating form inputs
function validateInput(inp, i) {
  if (inp.validity.valid) {
    validCount[i] = 1;
    switchSubmitBtn();
  } else {
    validCount[i] = 0;
  }
}

// enabling and disabling Submit Button
function switchSubmitBtn() {
  if (
    validCount[0] &&
    validCount[1] &&
    validCount[2] &&
    validCount[4] &&
    validCount[5]
  ) {
    submitBtn.parentElement.classList.remove("disabled");
  } else {
    submitBtn.parentElement.classList.add("disabled");
  }
}

// ******************** Event Listeners ***************************

//  enable/disable send OTP button depending on email
email.addEventListener("input", () => {
  if (email.validity.valid) {
    otpBtn.disabled = false;
  } else {
    otpBtn.disabled = true;
  }
});

// sending OTP when user clicks on OTP button
otpBtn.addEventListener("click", (e) => {
  e.preventDefault();
  sendEmail();
});

notYourEmail.addEventListener("click", (e) => {
  e.preventDefault();
  changeEmail();
});

// OTP validation
otp.addEventListener("input", () => {
  if (otp.validity.valid) {
    verifyBtn.parentElement.classList.remove("disabled");
  } else {
    verifyBtn.parentElement.classList.add("disabled");
  }
});

// OTP verification
verifyBtn.addEventListener("click", (e) => {
  e.preventDefault();
  verifyOTP();
});

// placeholder <==> label
let inpArr = [...document.getElementsByTagName("input")];
inpArr.forEach((inp) => {
  inp.addEventListener("blur", (e) => {
    if (inp.value != "") {
      inp.nextElementSibling.classList.add("done");
    } else {
      inp.nextElementSibling.classList.remove("done");
    }
  });
});

// Changing the eye buttons
pswdEye.addEventListener("click", (e) => {
  e.preventDefault();
  switchEyeBtn(pswdEye, pswdEyeSlash, password, "text");
});
cpswdEye.addEventListener("click", (e) => {
  e.preventDefault();
  switchEyeBtn(cpswdEye, cpswdEyeSlash, cpassword, "text");
});
pswdEyeSlash.addEventListener("click", (e) => {
  e.preventDefault();
  switchEyeBtn(pswdEyeSlash, pswdEye, password, "password");
});
cpswdEyeSlash.addEventListener("click", (e) => {
  switchEyeBtn(cpswdEyeSlash, cpswdEye, cpassword, "password");
  e.preventDefault();
});

// Form Validation
firstName.addEventListener("input", () => {
  validateInput(firstName, 1);
});
lastName.addEventListener("input", () => {
  validateInput(lastName, 2);
});
contact.addEventListener("input", () => {
  validateInput(contact, 3);
});
password.addEventListener("input", () => {
  validateInput(password, 4);
});
cpassword.addEventListener("input", () => {
  if (cpassword.validity.valid && cpassword.value == password.value) {
    validCount[5] = 1;
    switchSubmitBtn();
  } else {
    validCount[5] = 0;
  }
});
