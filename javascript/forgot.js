function load() {
  listener();
}

function listener() {
  var numberRecover = document.querySelector("#numberRecover");
  var emailRecover = document.querySelector("#emailRecover");
  var continueButton = document.querySelector("#continueButton");
  var verifyButton = document.querySelector("#verifyButton");
  var format = document.querySelector("#format");
  var recovery = document.querySelector("#recovery");
  var otpCode = document.querySelector("#otpCode");
  var containerHolder1 = document.querySelector("#containerHolder1");
  var containerHolder2 = document.querySelector("#containerHolder2");
  var containerHolder3 = document.querySelector("#containerHolder3");
  var containerHolder4 = document.querySelector("#containerHolder4");
  var emailOrPhoneInput = document.querySelector("#emailOrPhoneInput");
  var errormessage = document.querySelector("#errormessage");
  var errormessage1 = document.querySelector("#errormessage1");
  var errormessage2 = document.querySelector("#errormessage2");
  var errormessage3 = document.querySelector("#errormessage3");
  var back1 = document.querySelector("#back1");
  var back2 = document.querySelector("#back2");
  var back3 = document.querySelector("#back3");
  var resend = document.querySelector("#resend");
  var open = document.querySelector("#open");
  var close = document.querySelector("#close");
  var password = document.querySelector("#password");
  var confirmPassword = document.querySelector("#confirmPassword");
  var newPassword = document.querySelector("#newPassword");
  var emailOrPhone = document.querySelectorAll(".emailOrPhone");
  var loginLink = document.querySelectorAll(".loginLink");

  loginLink.forEach(function (loginLinks) {
    //back to landing page
    loginLinks.addEventListener("click", function () {
      location.href = "http://127.0.0.1:5500/index.html";
      otpCode.value = "";
      recovery.value = "";
      password.value = "";
      confirmPassword.value = "";

      password.value = "";
      errormessage2.innerText = "";
      errormessage2.style.opacity = 0;
      password.style.borderColor = "";

      confirmPassword.value = "";
      errormessage3.innerText = "";
      errormessage3.style.opacity = 0;
      confirmPassword.style.borderColor = "";
    });
  });

  numberRecover.addEventListener("click", function () {
    //recover through number
    errormessage.innerText = "";
    errormessage.style.opacity = 0;
    recovery.style.borderColor = "";
    continueButton.onclick = function () {
      var recoveryValue = recovery.value;
      if (recoveryValue === "") {
        errormessage.innerText = "Number Empty";
        errormessage.style.opacity = 1;
        recovery.classList.add("shake");
        recovery.style.borderColor = "var(--red)";
        setTimeout(() => {
          recovery.classList.remove("shake");
        }, 500);
      } else if (isNaN(recoveryValue)) {
        errormessage.innerText = "Invalid Number";
        errormessage.style.opacity = 1;
        recovery.classList.add("shake");
        recovery.style.borderColor = "var(--red)";
        setTimeout(() => {
          recovery.classList.remove("shake");
        }, 500);
      } else if (recoveryValue.length < 10) {
        errormessage.innerText = "Invalid Number";
        errormessage.style.opacity = 1;
        recovery.classList.add("shake");
        recovery.style.borderColor = "var(--red)";
        setTimeout(() => {
          recovery.classList.remove("shake");
        }, 500);
      } else {
        //send OTP Code
        errormessage.innerText = "";
        errormessage.style.opacity = 0;
        recovery.style.borderColor = "var(--green)";
        setTimeout(function () {
          containerHolder2.style.visibility = "hidden";
          containerHolder2.style.opacity = 0;

          containerHolder3.style.visibility = "visible";
          containerHolder3.style.opacity = 1;
        }, 400);
      }
      emailOrPhoneInput.innerText = "+63-" + recoveryValue;
    };
    containerHolder1.style.visibility = "hidden";
    containerHolder1.style.opacity = 0;

    containerHolder2.style.visibility = "visible";
    containerHolder2.style.opacity = 1;

    recovery.value = "";
    format.removeAttribute("hidden");
    recovery.setAttribute("maxLength", "10");

    emailOrPhone.forEach(function (emailOrPhone) {
      emailOrPhone.innerHTML = "Phone Number";
    });
  });

  emailRecover.addEventListener("click", function () {
    errormessage.innerText = "";
    errormessage.style.opacity = 0;
    recovery.style.borderColor = "";

    continueButton.onclick = function () {
      var recoveryValue = recovery.value.trim();
      if (recoveryValue === "") {
        errormessage.innerText = "Email Empty";
        errormessage.style.opacity = 1;
        recovery.classList.add("shake");
        recovery.style.borderColor = "var(--red)";
        setTimeout(() => {
          recovery.classList.remove("shake");
        }, 500);
      } else if (!isValidEmail(recoveryValue)) {
        errormessage.innerText = "Invalid email";
        errormessage.style.opacity = 1;
        recovery.classList.add("shake");
        recovery.style.borderColor = "var(--red)";
        setTimeout(() => {
          recovery.classList.remove("shake");
        }, 400);
      } else {
        //send OTP Code
        errormessage.innerText = "";
        errormessage.style.opacity = 0;
        recovery.style.borderColor = "var(--green)";
        setTimeout(function () {
          containerHolder2.style.visibility = "hidden";
          containerHolder2.style.opacity = 0;

          containerHolder3.style.visibility = "visible";
          containerHolder3.style.opacity = 1;
        }, 300);
      }
      emailOrPhoneInput.innerText = recoveryValue;
    };
    containerHolder1.style.visibility = "hidden";
    containerHolder1.style.opacity = 0;

    containerHolder2.style.visibility = "visible";
    containerHolder2.style.opacity = 1;

    recovery.value = "";
    format.hidden = true;
    recovery.removeAttribute("maxLength");

    emailOrPhone.forEach(function (emailOrPhone) {
      emailOrPhone.innerHTML = "Email address";
    });
  });

  back1.addEventListener("click", function () {
    containerHolder1.style.visibility = "visible";
    containerHolder1.style.opacity = 1;

    containerHolder2.style.visibility = "hidden";
    containerHolder2.style.opacity = 0;
  });

  back2.addEventListener("click", function () {
    recovery.value = "";
    otpCode.value = "";
    containerHolder2.style.visibility = "visible";
    containerHolder2.style.opacity = 1;

    containerHolder3.style.visibility = "hidden";
    containerHolder3.style.opacity = 0;
    recovery.style.borderColor = "";
  });

  back3.addEventListener("click", function () {
    otpCode.value = "";

    password.value = "";
    errormessage2.innerText = "";
    errormessage2.style.opacity = 0;
    password.style.borderColor = "";

    confirmPassword.value = "";
    errormessage3.innerText = "";
    errormessage3.style.opacity = 0;
    confirmPassword.style.borderColor = "";

    containerHolder3.style.visibility = "visible";
    containerHolder3.style.opacity = 1;

    containerHolder4.style.visibility = "hidden";
    containerHolder4.style.opacity = 0;
    otpCode.style.borderColor = "";
  });

  resend.addEventListener("click", handleClick);

  verifyButton.addEventListener("click", function () {
    var otpCodeValue = otpCode.value.trim();
    if (otpCodeValue === "") {
      errormessage1.innerText = "OTP Required";
      errormessage1.style.opacity = 1;
      otpCode.classList.add("shake");
      otpCode.style.borderColor = "var(--red)";
      setTimeout(() => {
        otpCode.classList.remove("shake");
      }, 500);
    } else if (otpCodeValue.length < 6) {
      errormessage1.innerText = "Invalid OTP";
      errormessage1.style.opacity = 1;
      otpCode.classList.add("shake");
      otpCode.style.borderColor = "var(--red)";
      setTimeout(() => {
        otpCode.classList.remove("shake");
      }, 500);
    }
    //insert ka lang else if dito pang valiate nung code galing sa server
    else {
      errormessage1.innerText = "";
      errormessage1.style.opacity = 0;
      otpCode.style.borderColor = "var(--green)";
      setTimeout(function () {
        containerHolder3.style.visibility = "hidden";
        containerHolder3.style.opacity = 0;

        containerHolder4.style.visibility = "visible";
        containerHolder4.style.opacity = 1;
      }, 300);
    }
  });
  otpCode.addEventListener("input", function () {
    otpCode.style.borderColor = "";
    errormessage1.innerText = "";
    errormessage1.style.opacity = 0;
  });
  recovery.addEventListener("input", function () {
    recovery.style.borderColor = "";
    errormessage.innerText = "";
    errormessage.style.opacity = 0;
  });
  password.addEventListener("input", function () {
    errormessage2.innerText = "";
    errormessage2.style.opacity = 0;
    var passwordValue = password.value.trim();

    if (passwordValue !== "") {
      close.style.visibility = "visible";
      close.style.opacity = 1;

      close.onclick = function () {
        if (password.type === "password") {
          password.type = "text";
          close.style.visibility = "hidden";
          close.style.opacity = 0;
          open.style.visibility = "visible";
          open.style.opacity = 1;
        } else {
          password.type = "password";
          close.style.visibility = "visible";
          close.style.opacity = 1;
          open.style.visibility = "hidden";
          open.style.opacity = 0;
        }
      };

      open.onclick = function () {
        if (password.type === "text") {
          password.type = "password";
          open.style.visibility = "hidden";
          open.style.opacity = 0;
          close.style.visibility = "visible";
          close.style.opacity = 1;
        } else {
          password.type = "text";
        }
      };

      if (passwordValue.length < 6) {
        password.style.borderColor = "var(--red)";
      } else if (!hasNumberAndLetter(passwordValue)) {
        password.style.borderColor = "var(--orange)";
      } else if (!hasUppercaseLetter(passwordValue)) {
        password.style.borderColor = "var(--orange)";
      } else if (/^\d+$/.test(passwordValue)) {
        password.style.borderColor = "var(--orange)";
      } else if (/^[a-zA-Z]+$/.test(passwordValue)) {
        password.style.borderColor = "var(--orange)";
      } else {
        password.style.borderColor = "var(--green)";
      }
    } else {
      close.style.visibility = "hidden";
      close.style.opacity = 0;
    }
  });
  confirmPassword.addEventListener("input", function () {
    errormessage3.innerText = "";
    errormessage3.style.opacity = 0;
  });

  password.addEventListener("blur", function () {
    var passwordValue = password.value.trim();
    if (passwordValue === "") {
      password.style.borderColor = "";

      open.style.visibility = "hidden";
      open.style.opacity = 0;
      close.style.visibility = "hidden";
      close.style.opacity = 0;

      errormessage2.innerText = "";
      errormessage2.style.opacity = 0;
    }
  });
  confirmPassword.addEventListener("blur", function () {
    var confirmPasswordValue = confirmPassword.value.trim();
    if (confirmPasswordValue === "") {
      confirmPassword.style.borderColor = "";
    }
  });
  newPassword.addEventListener("click", function () {
    var passwordValue = password.value.trim();
    var confirmPasswordValue = confirmPassword.value.trim();

    if (passwordValue === "") {
      errormessage2.innerText = "Number Empty";
      errormessage2.style.opacity = 1;
      password.classList.add("shake");
      password.style.borderColor = "var(--red)";
      setTimeout(() => {
        password.classList.remove("shake");
      }, 500);
    } else if (passwordValue.length < 6) {
      errormessage2.innerText = "Password should at least 6 Characters";
      errormessage2.style.opacity = 1;
      password.classList.add("shake");
      password.style.borderColor = "var(--orange)";
      setTimeout(() => {
        password.classList.remove("shake");
      }, 500);
    } else if (!hasNumberAndLetter(passwordValue)) {
      errormessage2.innerText = "Password must have at least one numeric digit";
      errormessage2.style.opacity = 1;
      password.classList.add("shake");
      password.style.borderColor = "var(--orange)";
      setTimeout(() => {
        password.classList.remove("shake");
      }, 500);
    } else if (!hasUppercaseLetter(passwordValue)) {
      errormessage2.innerText =
        "Password must have at least 1 uppercase character";
      errormessage2.style.opacity = 1;
      password.classList.add("shake");
      password.style.borderColor = "var(--orange)";
      setTimeout(() => {
        password.classList.remove("shake");
      }, 500);
    }
    if (confirmPasswordValue === "") {
      errormessage3.innerText = "Confirm your Password";
      errormessage3.style.opacity = 1;
      confirmPassword.classList.add("shake");
      confirmPassword.style.borderColor = "var(--red)";
      setTimeout(() => {
        confirmPassword.classList.remove("shake");
      }, 500);
    } else if (passwordValue !== confirmPasswordValue) {
      errormessage3.innerText = "Passwords does not match";
      errormessage3.style.opacity = 1;
      confirmPassword.classList.add("shake");
      confirmPassword.style.borderColor = "var(--red)";
      setTimeout(() => {
        confirmPassword.classList.remove("shake");
      }, 500);
    } else {
      //submit form
      errormessage2.innerText = "";
      errormessage2.style.opacity = 0;
      errormessage3.innerText = "";
      errormessage3.style.opacity = 0;
      password.style.borderColor = "var(--green)";
      confirmPassword.style.borderColor = "var(--green)";
    }
  });
}

function isValidEmail(email) {
  const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailCheck.test(email);
}
let timerOn = true;
function timer(remaining) {
  resend.removeEventListener("click", handleClick);
  var m = Math.floor(remaining / 60);
  var s = remaining % 60;

  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;
  resend.innerHTML = m + ":" + s;
  remaining -= 1;

  if (remaining >= 0 && timerOn) {
    setTimeout(function () {
      timer(remaining);
    }, 1000);
    return;
  } else {
    resend.addEventListener("click", handleClick);
    resend.innerHTML = "Resend OTP";
  }
}

function handleClick() {
  //resend otp
  timer(60);
  resend.removeEventListener("click", handleClick);
}
function hasNumberAndLetter(passwordValue) {
  var hasNumber = false;
  var hasLetter = false;

  for (var i = 0; i < passwordValue.length; i++) {
    var char = passwordValue[i];

    if (!hasNumber && !isNaN(char)) {
      hasNumber = true;
    }

    if (!hasLetter && char.match(/[a-zA-Z]/)) {
      hasLetter = true;
    }
  }

  return hasNumber && hasLetter;
}

function hasUppercaseLetter(passwordValue) {
  for (var i = 0; i < passwordValue.length; i++) {
    var char = passwordValue[i];

    if (char === char.toUpperCase() && char.match(/[a-zA-Z]/)) {
      return true;
    }
  }

  return false;
}

// function hasNumberOrSpecialChar(passwordValue) {
//     var regex = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
//     return regex.test(passwordValue);
// }
