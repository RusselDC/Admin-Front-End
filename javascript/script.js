function load(){
    scroll();
    login();
    repeat();
    //loader();
    scrollPage();
    listeners();
    animation();
}
// global variables
var username = document.getElementById('username');
var password = document.getElementById('password');
var confirmPassword = document.getElementById('confirmPassword');
var usernameLogIn = document.getElementById('usernameLogIn');
var passwordLogIn = document.getElementById('passwordLogIn');
var usernameLogInAdmin = document.getElementById('usernameLogInAdmin');
var passwordLogInAdmin = document.getElementById('passwordLogInAdmin');
var modal = document.getElementById('container')
var role = document.querySelector('.role');
var resendOTP = document.querySelector('#resendOTP');
let timerOn = true;
function listeners(){

    var login = document.querySelector('#login');
    
    login.addEventListener('click', function() {
      role.classList.toggle('visible');
    });
    


    var close = document.querySelectorAll('.fa-xmark');
    var closeClickHandler = () => {
        document.querySelector('.container').classList.remove('active');
        document.querySelector('.containerAdmin').classList.remove('active');
        document.getElementById('container').classList.remove('right-panel-active');
    };
    
    close.forEach(closed => {
        closed.addEventListener('click', closeClickHandler);
    });
    
    var showTerms = document.querySelector('#showTerms');
    var termsHolder = document.querySelector('.termsHolder');
    
    showTerms.addEventListener('click', function() {
        termsHolder.className = 'termsHolder-show';
        close.forEach(closed => {
            closed.removeEventListener('click', closeClickHandler);
        });
    });
    

      var termsClose = document.querySelector('#termsClose');

      termsClose.addEventListener('click', function(){
        termsHolder.className ='termsHolder';
        close.forEach(closed => {
            closed.addEventListener('click', closeClickHandler);
        });    
      })

    var checkbox = document.querySelector('.terms input[type="checkbox"]');
    var checkbox1 = document.querySelector('.termsCheckbox input[type="checkbox"]');
    var icon = document.querySelector('#termsAndConditions');
    var icon1 = document.querySelector('#termsAndConditions1');
    var check = document.querySelector('#check');
    var check1 = document.querySelector('#check1');

    check.addEventListener('click', function() {
        checkbox.checked = !checkbox.checked;
        checkbox1.checked = checkbox.checked;
      
        if (checkbox.checked) {
          icon.style.color = 'var(--darkgray)';
          icon1.style.color = 'var(--darkgray)';
        } else {
          icon.style.color = '';
          icon1.style.color = '';
        }
      });
      
      check1.addEventListener('click', function() {
        checkbox1.checked = !checkbox1.checked;
        checkbox.checked = checkbox1.checked;
      
        if (checkbox1.checked) {
          icon1.style.color = 'var(--darkgray)';
          icon.style.color = 'var(--darkgray)';
        } else {
          icon1.style.color = '';
          icon.style.color = '';
        }
      });
      
}
function animation(){
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if(entry.isIntersecting){
                entry.target.classList.add('showLeft');
            }
        })
    });
    var animateLeft = document.querySelectorAll('.animateLeft');
    animateLeft.forEach((el) => observer.observe(el));

    const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if(entry.isIntersecting){
                entry.target.classList.add('showRight');
            }
        })
    });
    
    var animateRight = document.querySelectorAll('.animateRight');
    animateRight.forEach((el) => obs.observe(el));
}
function scroll() {
    const header = document.querySelector('header');
    let pastScrollY = window.scrollY;

    window.addEventListener('scroll', function() {
        let nextScrollY = window.scrollY;
        let scrollDifference = nextScrollY - pastScrollY;
        pastScrollY = nextScrollY;

        if (scrollDifference > 0) {
            header.classList.add('navBarScroll');
            header.classList.remove('show');
            header.classList.add('hide');
        } else if (nextScrollY === 0) {
            header.classList.remove('hide');
            header.classList.remove('navBarScroll');
            header.classList.add('show');
        } else {
            header.classList.add('show');
            header.classList.remove('hide');
        }
    });
}



var scrollPage = (function(){
    const links = document.querySelectorAll('.links');
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 300;
        let activeSectionIndex = 0;
        for (let i = 0; i < sections.length; i++) {
            if (sections[i].offsetTop <= scrollY) {
                activeSectionIndex = i;
            }
        }
        links.forEach(link => link.classList.remove('activeSection'));
        links[activeSectionIndex].classList.add('activeSection');
    });
    links.forEach(link => {
        link.addEventListener('click', () => {
            links.forEach(ltx => ltx.classList.remove('activeSection'));
            link.classList.add('activeSection');
        });
    });
});

function login(){
    const signUpForm = document.getElementById('signUpForm');
    const loginForm = document.getElementById('loginForm');
    const container = document.getElementById('container');
    const containerAdmin = document.getElementById('containerAdmin');
    const login = document.getElementById('user');
    const admin = document.getElementById('admin');
    const register = document.getElementById('register');

    signUpForm.addEventListener('click', () => {
        container.classList.add("right-panel-active")
    });
    loginForm.addEventListener('click', () => {
        container.classList.remove("right-panel-active")
        username.value = '';
    });

    login.addEventListener('click', () => {
        container.classList.toggle("active")
        containerAdmin.classList.remove("active")
        role.classList.remove('visible')
    });
    admin.addEventListener('click', () => {
        containerAdmin.classList.toggle("active")
        container.classList.remove("active")
        role.classList.remove('visible')
        document.getElementById('container').classList.remove('right-panel-active')
    });
    register.addEventListener('click', () => {
        container.classList.toggle("right-panel-active")
        container.classList.toggle("active")       
    });

}

function validateLogIn(){
    var usernameLogInValue = usernameLogIn.value.trim(); 
    var passwordLogInValue = passwordLogIn.value.trim();

    if(usernameLogInValue === ''){
        setErrorfor(usernameLogIn, 'Email Empty');
        return false;       
    }
    else if (!isValidEmail(usernameLogInValue)) {
        setErrorfor(usernameLogIn, 'Invalid Format');
      } 
    else{
        setSuccessfor(usernameLogIn)
    }

    if(passwordLogInValue === ''){
        setErrorfor(passwordLogIn, 'Password Empty');
        return false;       
    }
    else{
        setSuccessfor(passwordLogIn)
        window.location.href = '/Admin/Dashboard.html'
    }
}
function validateLogInAdmin(){
    var usernameLogInValue = usernameLogInAdmin.value.trim(); 
    var passwordLogInValue = passwordLogInAdmin.value.trim();

    if(usernameLogInValue === ''){
        setErrorfor(usernameLogInAdmin, 'Email Empty');
        return false;       
    }
    else if (!isValidEmail(usernameLogInValue)) {
        setErrorfor(usernameLogInAdmin, 'Invalid Format');
      } 
    else{
        setSuccessfor(usernameLogInAdmin)
    }

    if(passwordLogInValue === ''){
        setErrorfor(passwordLogInAdmin, 'Password Empty');
        return false;       
    }
    else{
        setSuccessfor(passwordLogInAdmin)
    }
}

function validateSignUp(){
    var checkbox = document.querySelector('.terms input[type="checkbox"]');
    var terms = document.querySelector('.terms');
    var usernameValue = username.value.trim(); 
    var passwordValue = password.value.trim();
    var confirmPasswordValue = confirmPassword.value.trim(); 

    if(usernameValue === ''){
        setErrorfor(username, 'Email empty');
        return false;       
    }
    else if (!isValidEmail(usernameValue)) {
        setErrorfor(username, 'Invalid email');
      } 
    else{
        setSuccessfor(username)
    }

    if(passwordValue === ''){
        setErrorfor(password, 'Password empty');
        return false;       
    }
    if(passwordValue.length < 6){
        setErrorfor(password, 'Password should at least 6 Characters');
        return false;
    } 
    else if (!hasNumberAndLetter(passwordValue)) {
        setErrorfor(password, 'Password must have at least one numeric digit');
        return false;
    } 
    else if (!hasUppercaseLetter(passwordValue)) 
    {
        setErrorfor(password, 'Password must have at least 1 uppercase character');
        return false;
    } 
    // else if (!hasNumberOrSpecialChar(passwordValue)) 
    // {
    //     setErrorfor(password, 'Passwords must have a number or special character');
    //     return false;
    // }
    else{
        setSuccessfor(password)
    }
    if(confirmPasswordValue ===''){
        setErrorfor(confirmPassword, 'Confirm your Password');
        return false;
       
    }
    else if(passwordValue !== confirmPasswordValue) {
		setErrorfor(confirmPassword, 'Passwords does not match');
        return false;
        
    }
    else{
       setSuccessfor(confirmPassword);
       
    }
    if(checkbox.checked === false){
        terms.classList.add('shake');
        setTimeout(() => {
            terms.classList.remove('shake');
        }, 500);
        return false;
    }
    var container = document.querySelector('.container');
    var containerOTP = document.querySelector('.containerOTP');
    var otpEmail = document.querySelector('#otpEmail');
    var editEmail = document.querySelector('#editEmail');
    var verifyEmail = document.querySelector('#verifyEmail');
    var otp = document.querySelector('#inputOTP');
    var userSignUp = document.querySelector('#userSignUp');

    container.classList.remove('active');
    containerOTP.classList.add('active');

    otpEmail.textContent = usernameValue;

    editEmail.addEventListener('click', function(){
        container.classList.add('active');
        containerOTP.classList.remove('active');
    })

    resendOTP.addEventListener('click', handleClick);
    verifyEmail.addEventListener('click', function(){
        if(otp.value.trim() ===''){
            Swal.fire({
                icon: 'error',
                title: 'OTP Required',
                showConfirmButton:false,
                timer: 2000,

              })
            return false;        
        }
        else{
            userSignUp.submit();
            return true;
        }
    })
}

function timer(remaining) {
    resendOTP.removeEventListener('click', handleClick);
    var m = Math.floor(remaining / 60);
    var s = remaining % 60;

    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    resendOTP.innerHTML = m + ':' + s;
    remaining -= 1;

    if (remaining >= 0 && timerOn) {
        setTimeout(function() {
            timer(remaining);
        }, 1000);
        return;
    } else {
        resendOTP.addEventListener('click', handleClick);
        resendOTP.innerHTML = 'Resend OTP';
    }
}

function handleClick() {
    //send otp
    timer(60);
    resendOTP.removeEventListener('click', handleClick);
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
  
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = isValidEmail(email);
    console.log(isValid); 
    return emailRegex.test(email);
  }
function setErrorfor(input, message) {
    var formControl = input.parentElement;
    var errorMessage = formControl.querySelector(".errorMessage");
    var inputField = formControl.querySelector(".input");
    var check = formControl.querySelector(".check"); 
    var warning = formControl.querySelector(".fa-exclamation-circle");   

    errorMessage.innerText = message;

    warning.style.opacity = 1;
    check.style.opacity = 0;
    formControl.className = 'inputContent error';
    inputField.classList.add('shake');
    setTimeout(() => {
        inputField.classList.remove('shake');
    }, 500);
}
function setSuccessfor(input){
    var formControl = input.parentElement;   
    var check = formControl.querySelector(".check");  
    var warning = formControl.querySelector(".fa-exclamation-circle");      

    formControl.className = 'inputContent success';
    warning.style.opacity = 0;
    check.style.opacity = 1;

}

function isValidEmail(email) {
    const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailCheck.test(email);
}
//slideshow

var slides = document.querySelectorAll('.slide');
var btns = document.querySelectorAll('.imgBtn');
let currentSlide = 1;
let timeout;

var manualNav = function(manual){
    clearTimeout(timeout);
    slides.forEach((slide) => {
        slide.classList.remove('activeSlide');
    });
    btns.forEach((btn) => {
        btn.classList.remove('activeSlide');
    });
    slides[manual].classList.add('activeSlide');
    btns[manual].classList.add('activeSlide');
    currentSlide = manual;
};

btns.forEach((btn, i) => {
    btn.addEventListener('click', ()=>{
        manualNav(i);
    });
});

var repeat = function(activeClass){
    var repeater = () => {
        timeout = setTimeout(function() {
            slides.forEach((slide) => {
                slide.classList.remove('activeSlide');
            });
            btns.forEach((btn) => {
                btn.classList.remove('activeSlide');
            });
            currentSlide++;
            if(currentSlide >= slides.length){
                currentSlide = 0;
            }
            slides[currentSlide].classList.add('activeSlide');
            btns[currentSlide].classList.add('activeSlide');
            repeater();
        }, 5000); 
    };
    repeater();
};

















function loader(){

    setTimeout(()=>{
        spinner = document.querySelector(".spinner");
        body = document.querySelector('body');

        spinner.classList.add('spinner--hidden');
        body.classList.add('loaded');
    },3000);
}

  

  









