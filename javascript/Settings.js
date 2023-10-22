function onload(){
    listeners();
    fetchNotification();
}
    
    
function listeners(){
  const links = document.querySelectorAll(".links");
  links.forEach((link) => {
      const tooltipText = link.getAttribute("data-tooltip");

      const tooltip = document.createElement("div");
      tooltip.classList.add("tooltip");
      tooltip.textContent = tooltipText;

      link.appendChild(tooltip);
  });
  const lettersOnlyRegex = /^[a-zA-Z\s]+$/;
  const numbersOnlyRegex = /^[0-9]+$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/;

    var profileExpand = document.querySelector('#profileExpand');
    var logoutHolder = document.querySelector('#logoutHolder');
    var logoutHolderOptions = document.querySelectorAll('.logoutHolder span');
    profileExpand.addEventListener("click", ()=>{
      logoutHolder.classList.toggle("hidden");
      logoutHolderOptions.forEach((action)=>{
        action.addEventListener("click", ()=>{
          logoutHolder.classList.add("hidden")
        })
      })
    })
fetch("../JSON/personalDetails.json")
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    const details = data.details;
    const imgSourceFetch = details.imgSource;
    const firstNameFetch  = details.firstName;
    const lastNameFetch  = details.lastName;
    const middleNameFetch  = details.middleName;
    const positionFetch  = details.position;
    const religionFetch  = details.religion;
    const birthdayFetch  = details.birthday;
    const ageFetch  = details.age;
    const civilStatusFetch  = details.civilStatus;
    const emailFetch  = details.email;
    const contactNumberFetch  = details.contactNumber;
    const provinceFetch  = details.province;
    const cityFetch  = details.city;
    const barangayFetch  = details.barangay;
    const houseNumberStreetFetch  = details.houseNumberStreet;
    const statusFetch  = details.status;
    const passwordFetch  = details.password;
    const dateHiredFetch  = details.dateHired;

    var preview = document.querySelector("#preview"),
    firstName =  document.querySelector("#firstName"),
    lastName =  document.querySelector("#lastName"),
    middleName =  document.querySelector("#middleName"),
    password =  document.querySelector("#oldPassword"),
    phoneNumber =  document.querySelector("#phoneNumber"),
    email =  document.querySelector("#email"),
    dateJoined = document.querySelector("#dateJoined"),
    newPassword = document.querySelector("#newPassword"),
    confirmPassword = document.querySelector("#confirmPassword"),
    passwordFields = document.querySelectorAll(".passwordField");

    preview.src = "../images/" + imgSourceFetch;
    namePreview.innerText = firstNameFetch + " " + lastNameFetch;
    firstName.value = firstNameFetch;
    lastName.value = lastNameFetch;
    middleName.value = middleNameFetch;
    phoneNumber.value = contactNumberFetch;
    email.value = emailFetch;
    dateJoined.innerText = formatDate(dateHiredFetch);

    passwordFields.forEach((passwordField)=>{
      handlePassword(passwordField)
    })

    disableInput(newPassword,passwordFetch, password)
    disableInput(confirmPassword,passwordFetch, password)

    var inputBox = document.querySelectorAll('input[type="text"]')

    inputBox.forEach((inp) => {
      inp.addEventListener("input", () => {
        removeErrorMessage(inp)
      });
    });

    var updateInfo1 = document.querySelector("#updateInfo1"),
    form1 = document.querySelector("#form1");

    updateInfo1.addEventListener("click", ()=>{
      var firstNameValue = firstName.value.trim(),
      lastNameValue = lastName.value.trim(),
      middleNameValue = middleName.value.trim(),
      passwordValue = password.value.trim(),
      newPasswordValue = newPassword.value.trim(),
      confirmPasswordValue = confirmPassword.value.trim(),
      phoneNumberValue = phoneNumber.value.trim(),
      emailValue = email.value.trim(),
      isValid = true;

      if(
        firstNameValue !== firstNameFetch ||
        lastNameValue !== lastNameFetch ||
        middleNameValue !== middleNameFetch ||
        phoneNumberValue !== contactNumberFetch ||
        emailValue !== emailFetch 
      ){
        if(passwordValue === passwordFetch){
          removeError(password)
          if(newPasswordValue == ""){
            showError(newPassword, "New password missing")
            isValid = false
          }
          else if(newPasswordValue != confirmPasswordValue){
            showError(newPassword, "Password not matched")
            showError(confirmPassword, "Password not matched")
            isValid = false
          }
          else if (!hasNumberAndLetter(newPasswordValue)) {
            showError(newPassword, 'Password must have at least one numeric digit');
            isValid = false;
          } 
          else if (!hasUppercaseLetter(newPasswordValue)) {
            showError(newPassword, 'Password must have at least 1 uppercase character');
              isValid = false;
          } 
          else{
            removeError(newPassword)
            removeError(confirmPassword)
          }
        }
        else if(passwordValue == ""){
          removeError(password)
          isValid = true
        }
        else if(passwordValue !== passwordFetch){
          showError(password, 'Password not matched');
          isValid = false;
        }
        else{
          removeError(password)
        }
        if(firstNameValue == ""){
          showError(firstName, "First name missing")
          isValid = false
        }
        else if(!lettersOnlyRegex.test(firstNameValue)){
          showError(firstName, "Invalid format")
          isValid = false;
        }
        else{
          removeError(firstName)
        }
  
        if(lastNameValue == ""){
          showError(lastName, "First name missing")
          isValid = false
        }
        else if(!lettersOnlyRegex.test(lastNameValue)){
          showError(lastName, "Invalid format")
          isValid = false;
        }
        else{
          removeError(lastName)
        }
  
        if(middleNameValue == ""){
          showError(middleName, "First name missing")
          isValid = false
        }
        else if(!lettersOnlyRegex.test(middleNameValue)){
          showError(middleName, "Invalid format")
          isValid = false;
        }
        else{
          removeError(middleName)
        }
  
        if(phoneNumberValue == ""){
          showError(phoneNumber, "Phone number Missing")
          isValid = false;
        }
        else if(phoneNumberValue.length < 10 ){
          showError(phoneNumber, "Invalid number")
          isValid = false;
        }
        else if(!numbersOnlyRegex.test(phoneNumberValue)){
          showError(phoneNumber, "Invalid format")
          isValid = false;
        }
        else{
          removeError(phoneNumber)
        }
        if(emailValue == ""){
          showError(email, "Email missing")
          isValid = false;
        }
        else if(!emailRegex.test(emailValue)){
          showError(email, "Invalid email")
          isValid = false;
        }
        else{
          removeError(email)
        }
        if(isValid){
          Swal.fire({
            title: "Update information?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#73E977",
            cancelButtonColor: "#fa6363",
            confirmButtonText: "Confirm",
          }).then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Information updated',
              showConfirmButton:false,
              timer: 1500,
  
            }).then(()=>{
              form1.submit()
            })
          });
        }
      }
      else if(firstNameValue === firstNameFetch &&
        lastNameValue === lastNameFetch &&
        middleNameValue === middleNameFetch &&
        phoneNumberValue === contactNumberFetch &&
        emailValue === emailFetch &&
        passwordValue != ""
        ){
          if(passwordValue === passwordFetch){
            removeError(password)
            if(newPasswordValue == ""){
              showError(newPassword, "New password missing")
              isValid = false
            }
            else if(newPasswordValue != confirmPasswordValue){
              showError(newPassword, "Password not matched")
              showError(confirmPassword, "Password not matched")
              isValid = false
            }
            else if (!hasNumberAndLetter(newPasswordValue)) {
              showError(newPassword, 'Must include a numeric digit');
              isValid = false;
            } 
            else if (!hasUppercaseLetter(newPasswordValue)) {
              showError(newPassword, 'Must include upper case letter');
                isValid = false;
            } 
            else{
              removeError(newPassword)
              removeError(confirmPassword)
            }
          }
          else if(passwordValue !== passwordFetch){
            showError(password, 'Password not matched');
            isValid = false;
          }
          else{
            removeError(password)
          }
          if(isValid){
            Swal.fire({
              title: "Update information?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#73E977",
              cancelButtonColor: "#fa6363",
              confirmButtonText: "Confirm",
            }).then(() => {
              Swal.fire({
                icon: 'success',
                title: 'Information updated',
                showConfirmButton:false,
                timer: 1500,
    
              }).then(()=>{
                form1.submit()
              })
            });
          }
      }
      else {
        isValid = false
      }

      console.log(firstNameValue,lastNameValue,middleNameValue,passwordValue,
        newPasswordValue,confirmPasswordValue,phoneNumberValue,emailValue )
    })

})
    const navButton1 = document.querySelector("#navButton"),
    navButton2 = document.querySelector("#navButton1"),
    basicInfos = document.querySelector("#form1"),
    otherInfos = document.querySelector("#form2");

    switchForm(navButton2, navButton1, otherInfos, basicInfos)
    switchForm(navButton1, navButton2, basicInfos, otherInfos)


    var updatePhotoForm = document.querySelector("#updatePhotoForm"),
    updatePhoto = document.querySelector("#updatePhoto");

    updatePhoto.addEventListener("click", (e)=>{
      fileInput =  document.querySelector("#fileInput").value;
      console.log(fileInput)
      if(fileInput != ""){
        Swal.fire({
          title: "Update avatar?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#73E977",
          cancelButtonColor: "#fa6363",
          confirmButtonText: "Confirm",
        }).then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Avatar changed',
            showConfirmButton:false,
            timer: 2000,

          }).then(()=>{
            updatePhotoForm.submit();
          })
        });
      }
    })


}
function previewImage(event) {
  var fileInput = event.target;
  var file = fileInput.files[0];

  if (file) {
    if (validateFileType(file) && validateFileSize(file)) {
      previewFile(file);
    } else {
      Swal.fire({
        text: "Please select a JPEG, JPG, or PNG file under 5MB.",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      });
      fileInput.value = "";
    }
  }
}
function handleDragOver(event) {
  event.preventDefault();
  event.stopPropagation();
}
function previewFile(file) {
  var reader = new FileReader();

  reader.onload = function (e) {
    var previewImage = document.getElementById("preview");
    previewImage.src = e.target.result;
  };

  reader.readAsDataURL(file);
}
function validateFileType(file) {
  var allowedExtensions = /(\.jpeg|\.jpg|\.png)$/i;
  return allowedExtensions.exec(file.name);
}
function validateFileSize(file) {
  var maxSizeInBytes = 5 * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}
function showError(input, message){
  parentElem = input.parentElement;
  errorMes = parentElem.querySelector(".errorMessage")
  errorMes.innerText = message;
  input.style.borderColor = "var(--red)"
  input.classList.add("shake")
  setTimeout(()=>{
    input.classList.remove("shake")
  },500)
}
function removeError(input){
  parentElem = input.parentElement;
  errorMes = parentElem.querySelector(".errorMessage")
  errorMes.innerText = "";
  input.style.borderColor = ""
}
function removeErrorMessage(input){
  parentElem = input.parentElement;
  errorMes = parentElem.querySelector(".errorMessage")
  errorMes.innerText = "";
  input.style.borderColor = ""
}
function formatDate(dateString) {
  const inputDate = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = inputDate.toLocaleDateString(undefined, options);
  return formattedDate;
}
function disableInput(input, oldPassword, curPass) {
  input.addEventListener("focus", () => {
    if (curPass.value === "" || curPass.value !== oldPassword) {
      input.readOnly = true;
    } 
    else {
      input.readOnly = false;
    }
  });
}
function handlePassword(input){
  input.addEventListener("input", (e)=>{
    e.preventDefault()
    var eyeOpen = input.closest(".input").querySelector("#open");
    var eyeClose = input.closest(".input").querySelector("#close");
    if(input.value != ""){
      eyeClose.classList.remove("hidden")
      toggleEye(eyeOpen,eyeClose, input, "text", "password")
      toggleEye(eyeClose, eyeOpen, input,"password", "text")
    }
    else{
      eyeClose.classList.add("hidden")
    }
  })
}
function toggleEye(eyeOpen, eyeClose, input, type1, type2){
  eyeOpen.addEventListener("click", ()=>{           
    if(input.type = type1){
      input.type = type2;
      eyeClose.classList.remove("hidden")  
      eyeOpen.classList.add("hidden")    
    }
    else{
      input.type = type1
      eyeOpen.classList.remove("hidden")
      eyeClose.classList.add("hidden")  
    }
  })
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
function switchForm(button1,button2, formsShow, formHide){
  button1.addEventListener("click", ()=>{
    button2.classList.remove("active");
    button1.classList.add("active");
    formHide.classList.add("hidden")
    formsShow.classList.remove("hidden")
  })
}
function viewNotification(event) {
  var url = event.currentTarget.querySelector("#urlRedirect").textContent;
  window.location.href ="../Admin" + url;
}

async function fetchNotification(){
  const container = document.querySelector("#allNotification")
  const loader = document.querySelector("#notificationLoader")
  const mainContainer = document.querySelector("#notificationMainTemplate")
  const nodatafound = document.querySelector("#no-notifications")
  try {
    for (let i = 0; i < 5; i++) {
      const clone = document.importNode(loader.content, true);
      container.appendChild(clone);
    }
    const response = await fetch("../JSON/notification.json");
    const data = await response.json();
    console.log( data);

    function filterData(data, searchTerm) {
      searchTerm = searchTerm ? searchTerm.toLowerCase() : "";
      const filteredData = [];

      for (const notifs of data.notification) {
        const title = notifs.title.toLowerCase();
        const text = notifs.text.toLowerCase();
        if (
          title.includes(searchTerm) ||
          text.includes(searchTerm)
        ) {
          filteredData.push(notifs);
        }
      }

      return filteredData;
    }
    function updateDisplay(searchTerm) {
      const filteredData = filterData(data, searchTerm);
      container.innerHTML = "";

      if (filteredData.length === 0) {
        const clone = document.importNode(nodatafound.content, true);
        container.appendChild(clone);
      } else {
        let hasUnreadNotifications = false; 
        filteredData.sort((a, b) => {
          if (a.status === b.status) {
            return 0;
          }
          return a.status ? 1 : -1;
        });
        filteredData.forEach((item) => {
          const clone = document.importNode(mainContainer.content, true);

          var notificationStatus = item.status

          if(notificationStatus === false){
            clone.querySelector(".notif").classList.add("unread")
            const notifDot = document.createElement("div");
            notifDot.classList.add("notifDot");
            clone.querySelector(".notif").appendChild(notifDot);
            hasUnreadNotifications = true; 
          }
          clone.querySelector("#imgNotif").src = "../images/" + item.image;
          clone.querySelector("#notificationTitle").innerHTML = highlightText(
            item.title,
            searchTerm
          );
          clone.querySelector("#notificationMessage").innerHTML = highlightText(
            item.text,
            searchTerm
          );
          clone.querySelector("#urlRedirect").innerHTML = item.url;
          container.appendChild(clone);
        });
        const notificationDots = document.querySelector(".notification-dot");
        if (!hasUnreadNotifications) {
          notificationDots.classList.add("hidden")
        }
        else{
          notificationDots.classList.remove("hidden")
        }
      }
    }
    function highlightText(text, searchTerm) {
      if (!searchTerm) {
        return `<span>${text}</span>`;
      }

      const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, "gi");
      return text.replace(regex, (match) => `<p class="highlight">${match}</p>`);
    }

    function escapeRegExp(string) {
      return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
    }

    updateDisplay("");
    var search = document.querySelector("#searchNotification");
    search.addEventListener("input", function () {
      updateDisplay(this.value);
    });
  }
  catch (error) {
    console.error("An error occurred:", error);
  }

}
function viewNotificationContainer(event) {
  var parent = event.target.parentElement;
  var notificationContainer = parent.querySelector(".notificationContainer");
  notificationContainer.classList.toggle("hidden");
  event.target.classList.toggle("showContainer")
}
