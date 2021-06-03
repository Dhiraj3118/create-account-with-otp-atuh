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

/* ************************** Functions ************************** */

// sending mail without backend [Issue: mail goes to spam]
/* function sendEmail() {
  Email.send({
    Host: "smtp.elasticemail.com",
    Username: "201901022@daiict.ac.in",
    Password: "0EF12074B10E5FDDD2DE36B6B33B2FC17D07",
    To: `${email.value}`,
    From: "201901022@daiict.ac.in",
    Subject: "OTP for Email Verification",
    Body: `OTP for verification is ${generateOTP()}`,
  }).then(() => {
    otpBtn.textContent = "OTP sent";
    otpBtn.classList.add("sent");
    otpForm.style.top = "0";
    notYourEmail.textContent = `Change Your Email: ${email.value}`;
  });
}
*/

// sending mail using node backend
function sendEmail() {
  fetch('http://localhost:8000/api/sendotp', {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "*"
    },
    body: JSON.stringify({ email: email.value })
  })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      if (data.success) {
        otpBtn.textContent = "OTP sent";
        otpBtn.classList.add("sent");
        otpForm.style.top = "0";
        notYourEmail.textContent = `Change Your Email: ${email.value}`;
      }
      else {
        alert(data.error)
      }
    })
    .catch(err => console.log(err))
}

// verifying OTP
function verifyOTP() {
  fetch("http://localhost:8000/api/verifyotp", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "*"
    },
    body: JSON.stringify({ email: email.value, otp: otp.value })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        console.log(data)
        otpForm.style.top = "-30rem";
        otpBtn.textContent = "Email Verified";
        otpBtn.disabled = true;
        otpBtn.classList.remove("sent");
        otpBtn.classList.add("verified");
        email.disabled = true;
        [firstName, lastName, contact, password, cpassword].forEach(
          (i) => (i.disabled = false)
        );
        validCount[0] = 1;
        pswdEye.classList.remove("hidden");
        cpswdEye.classList.remove("hidden");
      }
      else {
        alert(data.error)
      }
    })
    .catch(error => {
      console.log(error)
      errorMsg.textContent = "Incorrect OTP";
    })
}

// changing Email ID
function changeEmail() {
  otpForm.style.top = "-30rem";
  otpBtn.textContent = "Send OTP";
  otpBtn.classList.remove("sent");
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
    inp.parentElement.nextElementSibling.style.visibility = "hidden";
  } else {
    validCount[i] = 0;
    inp.parentElement.nextElementSibling.style.visibility = "visible";
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

// finally submit the form
function verifyNsubmit() {
  if (contact.value.length == 0) {
    // submit without contact
    body = {
      email: email.value,
      firstname: firstName.value,
      lastname: lastName.value,
      password: password.value,
      cpassword: cpassword.value
    }
    submitToServer(body);
  } else if (validCount[3]) {
    // submit with contact
    body = {
      email: email.value,
      firstname: firstName.value,
      lastname: lastName.value,
      contact: contact.value,
      password: password.value,
      cpassword: cpassword.value
    }
    submitToServer(body);
  } else {
    // error at contact. dont submit
    contact.parentElement.nextElementSibling.style.visibility = "visible";
    contact.focus();
  }
}

function submitToServer(body) {
  fetch("http://localhost:8000/api/createaccount", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "*"
    },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert(data.msg);
        [...document.getElementsByTagName('input')].forEach(inp => {
          inp.value = "";
        })
      }
      else {
        alert(data.error);
      }
    })
    .catch(error => console.log(error))
}
/* ******************** Event Listeners *************************** */

//  enable/disable send OTP button depending on email
email.addEventListener("input", () => {
  if (email.validity.valid) {
    otpBtn.disabled = false;
    email.parentElement.nextElementSibling.style.visibility = "hidden";
  } else {
    otpBtn.disabled = true;
    email.parentElement.nextElementSibling.style.visibility = "visible";
  }
});

// sending OTP when user clicks on OTP button
otpBtn.addEventListener("click", (e) => {
  e.preventDefault();
  sendEmail();
});

// change email
notYourEmail.addEventListener("click", (e) => {
  e.preventDefault();
  changeEmail();
});

// OTP validation
otp.addEventListener("input", () => {
  if (otp.validity.valid) {
    verifyBtn.parentElement.classList.remove("disabled");
    otp.parentElement.nextElementSibling.style.visibility = "hidden";
  } else {
    verifyBtn.parentElement.classList.add("disabled");
    otp.parentElement.nextElementSibling.style.visibility = "visible";
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
let arr = [firstName, lastName, contact, password]
for (let i = 0; i < 4; i++) {
  arr[i].addEventListener("input", () => {
    validateInput(arr[i], i + 1);
  })
}

cpassword.addEventListener("input", () => {
  if (cpassword.validity.valid && cpassword.value == password.value) {
    validCount[5] = 1;
    switchSubmitBtn();
    cpassword.parentElement.nextElementSibling.style.visibility = "hidden";
  } else {
    validCount[5] = 0;
    cpassword.parentElement.nextElementSibling.style.visibility = "visible";
  }
});

// final verification and submission
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  verifyNsubmit();
});
