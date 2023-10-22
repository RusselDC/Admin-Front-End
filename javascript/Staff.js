function onload() {
  listeners();
  fetchNotification();
}


function listeners() {
  const links = document.querySelectorAll(".links");
  links.forEach((link) => {
    const tooltipText = link.getAttribute("data-tooltip");

    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    tooltip.textContent = tooltipText;

    link.appendChild(tooltip);
  });
  var profileExpand = document.querySelector('#profileExpand');
  var logoutHolder = document.querySelector('#logoutHolder');
  var logoutHolderOptions = document.querySelectorAll('.logoutHolder span');
  profileExpand.addEventListener("click", () => {
    logoutHolder.classList.toggle("hidden");
    logoutHolderOptions.forEach((action) => {
      action.addEventListener("click", () => {
        logoutHolder.classList.add("hidden")
      })
    })
  })

  var sortButton = document.querySelector('#sortButton');
  var sortOptions = document.querySelector('#sortOptions');
  var sorts = document.querySelectorAll('.sortOptions2 span');
  var sortText = document.querySelector('#sortText');
  const lettersOnlyRegex = /^[a-zA-Z\s]+$/;
  const numbersOnlyRegex = /^[0-9]+$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/;

  //show sort Options
  sortButton.addEventListener('click', () => {
    sortOptions.classList.toggle('showElement');
    const caretIcons = document.querySelectorAll(".fa-caret-down");
    caretIcons.forEach((icon) => {
      const currentTransform = icon.style.transform;
      if (currentTransform === '') {
        icon.style.transform = "rotate(180deg)";
      } else {
        icon.style.transform = '';
      }
    });
  })
  //change text content of sort button
  sorts.forEach(function (sort) {
    sort.addEventListener('click', function () {
      var textSpan = this.innerText;
      sortText.innerText = textSpan;
      sortOptions.classList.remove('showElement');
      const caretIcons = document.querySelectorAll(".fa-caret-down");
      caretIcons.forEach((icon) => {
        const currentTransform = icon.style.transform;
        if (currentTransform === '') {
          icon.style.transform = "rotate(180deg)";
        } else {
          icon.style.transform = '';
        }
      });
    })
  })

  const tableBody = document.querySelector("#tableBody");
  const staffTemplateLoader = document.querySelector("#staffTemplateLoader");
  const staffTemplate = document.querySelector("#staffTemplate");
  const nodatafound = document.querySelector("#no-data-found");

  for (let i = 0; i < 7; i++) {
    const clone = document.importNode(staffTemplateLoader.content, true);
    tableBody.appendChild(clone);

  }
  fetch("../JSON/staff.json")
    .then((response) => response.json())
    .then((data) => {
      updateDisplay("", data);
      var search = document.querySelector("#search");
      search.addEventListener("input", function () {
        updateDisplay(this.value, data);
      });
    })
  function filterData(data, searchTerm) {
    const employees = data.employees;

    if (!searchTerm) {
      return employees;
    }

    searchTerm = searchTerm.toLowerCase();
    return employees.filter((obj) => {
      return (
        obj.staffName.toLowerCase().includes(searchTerm) ||
        obj.position.toLowerCase().includes(searchTerm) ||
        obj.email.toLowerCase().includes(searchTerm) ||
        obj.status.toLowerCase().includes(searchTerm) ||
        obj.contactNumber.toString().toLowerCase().includes(searchTerm)
      );
    });
  }


  function updateDisplay(searchTerm, data) {
    tableBody.innerHTML = "";
    const filteredData = filterData(data, searchTerm);
    if (Object.keys(filteredData).length === 0) {
      const clone = document.importNode(nodatafound.content, true);
      tableBody.appendChild(clone);
    }
    filteredData.forEach((obj, i) => {
      const clone = document.importNode(staffTemplate.content, true);
      clone.querySelector("#staffName").innerHTML = highlightText(
        obj.staffName,
        searchTerm
      );

      clone.querySelector("#patientNameOriginalValue").innerHTML = obj.staffName
      clone.querySelector("#religionFetch").innerHTML = obj.religion
      clone.querySelector("#imgSourceFetch").innerHTML = obj.imgSource
      clone.querySelector("#birthdayFetch").innerHTML = obj.birthday
      clone.querySelector("#ageFetch").innerHTML = obj.age
      clone.querySelector("#civilStatusFetch").innerHTML = obj.civilStatus
      clone.querySelector("#addressFetch").innerHTML = obj.address
      clone.querySelector("#dateHiredFetch").innerHTML = obj.dateHired


      truncateText(clone.querySelector("#staffName"), 15);
      clone.querySelector("#position").innerHTML = highlightText(
        obj.position,
        searchTerm
      );
      clone.querySelector("#contactNumber").innerHTML = highlightText(
        obj.contactNumber.toString(),
        searchTerm
      );
      clone.querySelector("#emailAddresss").innerHTML = highlightText(
        obj.email,
        searchTerm
      );
      var status = clone.querySelector("#status");
      status.innerHTML = highlightText(obj.status.toUpperCase(), searchTerm);
      if (obj.status === "active") {
        status.style.backgroundColor = "var(--green)"
      }
      else {
        status.style.backgroundColor = "var(--orange)"
      }
      var img = clone.querySelector("#imgStaff");
      img.src = "../images/" + obj.imgSource;
      tableBody.appendChild(clone);
    });

    function highlightText(text, searchTerm) {
      if (!searchTerm) {
        return `<span>${text}</span>`;
      }

      const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, "gi");
      return text.replace(
        regex,
        (match) => `<p class="highlight">${match}</p>`
      );
    }

    function escapeRegExp(string) {
      return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
    }

    var addStaff = document.querySelector("#addStaff");
    var formContainer = document.querySelector("#formContainer");
    var line = document.querySelectorAll(".line");
    var xmarks = document.querySelectorAll(".fa-circle-xmark");

    var selectPosition = document.querySelector("#selectPosition"),
      choosePosition = document.querySelector("#choosePosition"),
      positionOption = document.querySelector("#positionOption"),
      posOpttion = document.querySelectorAll(".positionOption span"),
      positionType = document.querySelector("#positionType"),
      positionCaret = document.querySelector("#positionCaret");
    selectPosition.addEventListener("click", () => {
      positionOption.classList.toggle("showElement")
      if (positionOption.classList.contains("showElement")) {
        positionCaret.style.transform = "rotate(180deg)";
      } else {
        positionCaret.style.transform = "";
      }
      posOpttion.forEach((select) => {
        select.addEventListener("click", () => {
          removeErrorMessage(selectPosition)
          pos = select.innerText;
          choosePosition.value = pos;
          positionOption.classList.remove("showElement");
          positionType.innerText = pos;
          positionType.style.color = "var(--darkgray)"
          if (positionOption.classList.contains("showElement")) {
            positionCaret.style.transform = "rotate(180deg)";
          } else {
            positionCaret.style.transform = "";
          }
        });
      });
    });

    var selectStatus = document.querySelector("#selectStatus"),
      chooseStatus = document.querySelector("#chooseStatus"),
      statusOption = document.querySelector("#statusOption"),
      statOption = document.querySelectorAll(".statusOption span"),
      statusType = document.querySelector("#statusType"),
      statusCaret = document.querySelector("#statusCaret");
    selectStatus.addEventListener("click", () => {
      removeErrorMessage(selectStatus)
      statusOption.classList.toggle("showElement")
      if (statusOption.classList.contains("showElement")) {
        statusCaret.style.transform = "rotate(180deg)";
      } else {
        statusCaret.style.transform = "";
      }
      statOption.forEach((select) => {
        select.addEventListener("click", () => {
          pos = select.innerText;
          chooseStatus.value = pos;
          statusOption.classList.remove("showElement");
          statusType.innerText = pos;
          statusType.style.color = "var(--darkgray)"
          if (statusOption.classList.contains("showElement")) {
            statusCaret.style.transform = "rotate(180deg)";
          } else {
            statusCaret.style.transform = "";
          }
        });
      });
    });
    var inputBox = document.querySelectorAll('input[type="text"]')

    inputBox.forEach((inp) => {
      inp.addEventListener("input", () => {
        removeErrorMessage(inp)
      });
    });
    addStaff.addEventListener("click", () => {
      formContainer.classList.remove("hidden");
      document.querySelector("#viewStaffDetails").classList.add("hidden");
      document.querySelector("#addStaffForm").classList.remove("hidden");

      var line1 = document.querySelector("#line1");
      var check1 = document.querySelector("#fa-circle-check1");
      var nextButton1 = document.querySelector("#nextButton1");
      var formSection1 = document.querySelector("#formSection1");
      var formSection2 = document.querySelector("#formSection2");
      var cancelButton1 = document.querySelector("#cancelButton1");
      var cancelButton2 = document.querySelector("#cancelButton2");

      line.forEach((click) => {
        click.classList.remove("completed")
      })
      xmarks.forEach((xmark) => {
        xmark.classList.replace("fa-circle-check", "fa-circle-xmark");
      })

      var position = document.querySelector("#choosePosition"),
        // chooseClinic to be removed ↓↓↓
        clinicAsigned = document.querySelector("#clinicAsigned"),
        firstName = document.querySelector("#firstName"),
        lastName = document.querySelector("#lastName"),
        middleName = document.querySelector("#middleName"),
        religion = document.querySelector("#religion"),
        birthday = document.querySelector("#birthday"),
        age = document.querySelector("#age"),
        civilStatus = document.querySelector("#chooseStatus"),
        phoneNumber = document.querySelector("#phoneNumber"),
        email = document.querySelector("#email");

      //Automatic Date Calculation
      roundedAge = calculateAge(birthday.value);
      birthday.addEventListener("change", () => {
        let roundedAge = calculateAge(birthday.value);
        if (roundedAge <= 0) {
          showError(birthday, "Invalid birthday")
          birthday.value = ""
          age.value = 0
        }
        else if (roundedAge <= 17) {
          showError(birthday, "Person too young")
          showError(age, "Person too young")
          birthday.value = ""
          age.value = 0
        }
        else {
          removeError(birthday)
          removeError(age)
          age.value = roundedAge;
        }
      });
      nextButton1.addEventListener("click", (e) => {
        e.preventDefault()
        var firstNameValue = firstName.value.trim(),
          // chooseClinic to be removed ↓↓↓
          clinicAsignedValue = clinicAsigned.value.trim(),
          lastNameValue = lastName.value.trim(),
          middleNameValue = middleName.value.trim(),
          religionValue = religion.value.trim(),
          phoneNumberValue = phoneNumber.value.trim(),
          positionValue = position.value,
          statusValue = civilStatus.value,
          emailValue = email.value.trim();

        isValid = true
        if (positionValue == "") {
          showError(selectPosition, "Select position")
          isValid = false;
        }
        else {
          removeError(selectPosition)
        }
        // chooseClinic to be removed ↓↓↓ 
        if (clinicAsignedValue == "") {
          showError(clinicAsigned, "Select clinic")
          isValid = false;
        }
        else {
          removeError(clinicAsigned)
        }
        // chooseClinic to be removed ↑↑↑
        if (firstNameValue == "") {
          showError(firstName, "First name missing")
          isValid = false;
        }
        else if (!lettersOnlyRegex.test(firstNameValue)) {
          showError(firstName, "Invalid format")
          isValid = false;
        }
        else {
          removeError(firstName)
        }
        if (lastNameValue == "") {
          showError(lastName, "Last name missing")
          isValid = false;
        }
        else if (!lettersOnlyRegex.test(lastNameValue)) {
          showError(lastName, "Invalid format")
          isValid = false;
        }
        else {
          removeError(lastName)
        }
        if (middleNameValue == "") {
          middleName.style.borderColor = ""
        }
        else if (!lettersOnlyRegex.test(middleNameValue) && middleNameValue != "") {
          showError(middleName, "Invalid format")
          isValid = false;
        }
        else {
          removeError(middleName)
        }
        if (religionValue == "") {
          showError(religion, "Religion missing")
          isValid = false;
        }
        else if (!lettersOnlyRegex.test(religionValue)) {
          showError(religion, "Invalid format")
          isValid = false;
        }
        else {
          removeError(religion)
        }
        if (roundedAge <= 0) {
          showError(age, "Invalid age")
          showError(birthday, "Invalid birthdate")
          isValid = false;
        }
        if (birthday.value == "") {
          showError(age, "Age missing")
          showError(birthday, "Birthdate missing")
          isValid = false;
        }
        else {
          removeError(age)
        }
        if (statusValue == "") {
          showError(selectStatus, "Select status")
          isValid = false;
        }
        else {
          removeError(selectStatus)
        }
        if (phoneNumberValue == "") {
          showError(phoneNumber, "Phone number Missing")
          isValid = false;
        }
        else if (phoneNumberValue.length < 10) {
          showError(phoneNumber, "Invalid number")
          isValid = false;
        }
        else if (!numbersOnlyRegex.test(phoneNumberValue)) {
          showError(phoneNumber, "Invalid format")
          isValid = false;
        }
        else {
          removeError(phoneNumber)
        }
        if (emailValue == "") {
          showError(email, "Email missing")
          isValid = false;
        }
        else if (!emailRegex.test(emailValue)) {
          showError(email, "Invalid email")
          isValid = false;
        }
        else {
          removeError(email)
        }
        if (isValid) {
          formSection1.classList.add("hidden");
          formSection2.classList.remove("hidden");
          line1.classList.add("completed");
          setTimeout(() => {
            check1.classList.replace("fa-circle-xmark", "fa-circle-check");
          }, 900);
          check1.classList.add("completedIcon");
        }
      });


      cancelButton1.addEventListener("click", () => {
        formContainer.classList.add("hidden");
        position.value = ""
        civilStatus.value = ""
        defaultDesign(selectPosition, "")
        defaultText(positionType, "Select Position")
        defaultDesign(firstName, "")
        defaultDesign(clinicAsigned, "")
        defaultDesign(lastName, "")
        defaultDesign(middleName, "")
        defaultDesign(religion, "")
        defaultDesign(age, 0)
        defaultDesign(birthday, "")
        defaultDesign(selectStatus, "")
        defaultText(statusType, "Select Status")
        defaultDesign(phoneNumber, "")
        defaultDesign(email, "")
      });
      // var province = document.querySelector("#province"),
      //  city = document.querySelector("#city"),
      // barangay = document.querySelector("#barangay"),
      // houseNumberStreet = document.querySelector("#houseNumberStreet");

      // nextButton2.addEventListener("click", () => {

      //   var houseNumberStreetValue = houseNumberStreet.value.trim();
      //   isValid = true;
      //   if(province.value == ""){
      //     showError(province, "Province missing")
      //     isValid = false;
      //   }
      //   else{
      //     removeError(province)
      //   }
      //   if(city.value == ""){
      //     showError(city, "City missing")
      //     isValid = false;
      //   }
      //   else{
      //     removeError(city)
      //   }
      //   if(barangay.value == ""){
      //     showError(barangay, "City missing")
      //     isValid = false;
      //   }
      //   else{
      //     removeError(barangay)
      //   }
      //   if(houseNumberStreetValue == ""){
      //     showError(houseNumberStreet, "House # and Street missing")
      //     isValid = false;
      //   }
      //   else{
      //     removeError(houseNumberStreet)
      //   }
      //   if(isValid){
      //     line2.classList.add("completed");
      //     setTimeout(() => {
      //       check2.classList.replace("fa-circle-xmark", "fa-circle-check");
      //     }, 900); 
      //     check2.classList.add("completedIcon");

      //     formSection2.classList.add("hidden")
      //     formSection3.classList.remove("hidden")
      //     console.log(province.value,city.value,barangay.value,houseNumberStreetValue)
      //   }
      // });

      cancelButton2.addEventListener("click", () => {
        formSection2.classList.add("hidden")
        formSection1.classList.remove("hidden")
      });

      // cancelButton3.addEventListener("click", () => {
      //   formSection3.classList.add("hidden")
      //   formSection2.classList.remove("hidden")
      // });
    });

    var deleteButton = document.querySelectorAll(".deleteButton");
    deleteButton.forEach((del) => {
      del.addEventListener("click", function () {
        var serviceName = this.closest("tr").querySelector("#patientNameOriginalValue").textContent;

        Swal.fire({
          title: "Delete " + serviceName + "?",
          text: "You won't be able to revert this.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#73E977",
          cancelButtonColor: "#fa6363",
          confirmButtonText: "Confirm",
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Staff Deleted",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
          }
        });
      });
    });
    document.querySelector("#cancelView").addEventListener("click", () => {
      formContainer.classList.add("hidden");
    });
    var viewButton = document.querySelectorAll(".viewButton");
    viewButton.forEach((view) => {
      view.addEventListener("click", function () {
        formContainer.classList.remove("hidden");
        document.querySelector("#addStaffForm").classList.add("hidden");
        document.querySelector("#viewStaffDetails").classList.remove("hidden");
        var name = this.closest("tr").querySelector("#patientNameOriginalValue").textContent;
        var src = this.closest("tr").querySelector("#imgSourceFetch").textContent;
        var position = this.closest("tr").querySelector("#position").textContent;
        var religion = this.closest("tr").querySelector("#religionFetch").textContent;
        var birthday = this.closest("tr").querySelector("#birthdayFetch").textContent;
        var age = this.closest("tr").querySelector("#ageFetch").textContent;
        var civilStatus = this.closest("tr").querySelector("#civilStatusFetch").textContent;
        var contactNumber = this.closest("tr").querySelector("#contactNumber").textContent;
        var email = this.closest("tr").querySelector("#emailAddresss").textContent;
        var address = this.closest("tr").querySelector("#addressFetch").textContent;
        var dateHired = this.closest("tr").querySelector("#dateHiredFetch").textContent;

        var status = this.closest("tr").querySelector("#status").textContent;
        var statusController = document.querySelector("#statusController");
        console.log(status.toLowerCase)
        if (status.toLowerCase() == "active") {
          statusController.style.backgroundColor = "var(--green)"
        }
        else {
          statusController.style.backgroundColor = ""
        }

        document.querySelector("#viewName").innerText = name;
        document.querySelector("#viewImg").src = "../images/" + src;
        document.querySelector("#viewPosition").innerText = position;
        document.querySelector("#viewReligion").innerText = religion;
        document.querySelector("#viewBirthday").innerText = birthday;
        document.querySelector("#viewAge").innerText = age;
        document.querySelector("#viewCivilStatus").innerText = civilStatus;
        document.querySelector("#viewContact").innerText = contactNumber;
        document.querySelector("#viewEmail").innerText = email;
        document.querySelector("#viewAddress").innerText = address;
        document.querySelector("#viewDateHired").innerText = dateHired;
      });
    });
  }
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

function handleDrop(event) {
  event.preventDefault();
  event.stopPropagation();

  var file = event.dataTransfer.files[0];
  if (validateFileType(file) && validateFileSize(file)) {
    previewFile(file);
  } else {
    Swal.fire({
      text: "Drop a JPEG, JPG, or PNG file under 5MB.",
      icon: "warning",
      timer: 2000,
      showConfirmButton: false,
    });
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
function calculateAge(userDateInput) {
  const currentDate = new Date();
  const userDateOfBirth = new Date(userDateInput);
  const ageInMilliseconds = currentDate - userDateOfBirth;
  const ageInYears = ageInMilliseconds / (365 * 24 * 60 * 60 * 1000);
  const roundedAge = Math.floor(ageInYears);
  return roundedAge;
}

function showError(input, message) {
  parentElem = input.parentElement;
  errorMes = parentElem.querySelector(".errorPrompt")
  errorMes.innerText = message;
  input.style.borderColor = "var(--red)"
  input.classList.add("shake")
  setTimeout(() => {
    input.classList.remove("shake")
  }, 500)
}
function removeError(input) {
  parentElem = input.parentElement;
  errorMes = parentElem.querySelector(".errorPrompt")
  errorMes.innerText = "";
  input.style.borderColor = "var(--green)"
}
function removeErrorMessage(input) {
  parentElem = input.parentElement;
  errorMes = parentElem.querySelector(".errorPrompt")
  errorMes.innerText = "";
  input.style.borderColor = ""
}
function defaultDesign(input, val) {
  parentElem = input.parentElement;
  errorMes = parentElem.querySelector(".errorPrompt")
  errorMes.innerText = "";
  input.style.borderColor = ""
  input.value = val
}
function defaultText(input, opt) {
  input.innerText = opt
  input.style.color = "lightgray"
}

function addStaff() {

  var province = document.querySelector("#province"),
    name = document.querySelector("#firstName").value,
    choosePosition = document.querySelector("#choosePosition").value,
    city = document.querySelector("#city"),
    barangay = document.querySelector("#barangay"),
    houseNumberStreet = document.querySelector("#houseNumberStreet");


  var houseNumberStreetValue = houseNumberStreet.value.trim();

  if (province.value == "") {
    showError(province, "Province missing")
    return false;
  }
  else {
    removeError(province)
  }
  if (city.value == "") {
    showError(city, "City missing")
    return false;
  }
  else {
    removeError(city)
  }
  if (barangay.value == "") {
    showError(barangay, "City missing")
    return false;
  }
  else {
    removeError(barangay)
  }
  if (houseNumberStreetValue == "") {
    showError(houseNumberStreet, "House # and Street missing")
    return false;
  }
  else {
    removeError(houseNumberStreet)
  }
  if (isValid) {
    var addStaffForm = document.getElementById("addStaffForm"),
      line2 = document.getElementById("line2"),
      check2 = document.querySelector("#fa-circle-check2");
    addStaffForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const formDataObject = {};
      formData.forEach((value, key) => {
        formDataObject[key] = value;
      });
      console.log(formDataObject);
      line2.classList.add("completed");
      setTimeout(() => {
        check2.classList.replace("fa-circle-xmark", "fa-circle-check");
      }, 900);
      check2.classList.add("completedIcon");
    });
    Swal.fire({
      title: "Confirm adding " + name,
      text: "You won't be able to revert this.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#73E977",
      cancelButtonColor: "#fa6363",
      confirmButtonText: "Confirm",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: choosePosition + " added",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          //addStaffForm.submit();
        });
      }
    });
  }


}
const clinics = [
  "Pablo De Jesus",
  "Dyan sa malapit",
  "dito lang",
  "Secret",
  "Hanapin mo na lang",
  "Ipagtanong mo kasi",
];
const clinicAsigned = document.querySelector("#clinicAsigned");
const clinicOption = document.querySelector("#clinicOption");

function filterNames(searchInputValue) {
  const searchTerm = searchInputValue.toLowerCase();
  const filteredNames = clinics.filter((name) =>
    name.toLowerCase().includes(searchTerm)
  );

  return filteredNames;
}
function displaySuggestions(filteredNames) {
  clinicOption.innerHTML = "";

  const searchInputValue = clinicAsigned.value.toLowerCase();

  filteredNames.forEach((name) => {
    const suggestion = document.createElement("span");
    suggestion.className = "clinicsName"
    let highlightedName = "";
    let currentIndex = 0;
    for (let i = 0; i < name.length; i++) {
      const char = name[i].toLowerCase();

      if (
        currentIndex < searchInputValue.length &&
        char === searchInputValue[currentIndex]
      ) {
        highlightedName += `<span class="highlight">${name[i]}</span>`;
        currentIndex++;
      } else {
        highlightedName += name[i];
      }
    }

    suggestion.innerHTML = highlightedName;
    suggestion.addEventListener("click", () => {
      clinicAsigned.value = name;
      clinicOption.innerHTML = "";
    });
    clinicOption.appendChild(suggestion);
  });
}
clinicAsigned.addEventListener("input", (event) => {
  const searchInputValue = event.target.value.trim();
  if (searchInputValue === "") {
    clinicOption.innerHTML = "";
    return;
  }
  const filteredNames = filterNames(searchInputValue);
  displaySuggestions(filteredNames);
});

function truncateText(element, limit) {
  var text = element.textContent;
  if (text.length > limit) {
    var truncated = text.substring(0, limit) + "...";
    element.textContent = truncated;
  }
}
function showValue(place, input) {
  var selectedOption = document.getElementById(place);
  var inputElement = document.getElementById(input);
  var selectedText = selectedOption.options[selectedOption.selectedIndex].text;
  inputElement.value = selectedText;
  alert(inputElement.value);
}
function showValue(selectElement, input) {
  var selectedText = selectElement.options[selectElement.selectedIndex].text;
  input.value = selectedText;
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