function onload() {
  listeners();
  fetchNotification();
}
const containerBody = document.querySelector("#containerBody"),
  templateLoader = document.querySelector("#templateLoader"),
  mainTemplate = document.querySelector("#mainTemplate"),
  staffTemplateLoader = document.querySelector("#staffTemplateLoader"),
  staffTemplateMain = document.querySelector("#staffTemplateMain"),
  ci1 = document.querySelector("#ci1"),
  serviceTemplateLoader = document.querySelector("#serviceTemplateLoader"),
  serviceTemplateMain = document.querySelector("#serviceTemplateMain"),
  ci2 = document.querySelector("#ci2"),
  appointmentTemplateLoader = document.querySelector(
    "#appointmentTemplateLoader"
  ),
  appointmentTemplateMain = document.querySelector("#appointmentTemplateMain"),
  ci3 = document.querySelector("#ci3"),
  tableBody = document.querySelector("#tableBody"),
  contactNumberTemplate = document.querySelector("#contactNumberTemplate"),
  contactNumberContainer = document.querySelector("#contactNumberContainer"),
  nodatafound = document.querySelector("#no-data-found"),
  lettersOnlyRegex = /^[a-zA-Z\s]+$/,
  numbersOnlyRegex = /^[0-9]+$/,
  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/,
  facebookPattern =
    /^(https?:\/\/)?(www\.)?facebook\.com\/(profile\.php\?id=\d+|[^/?&]+)$/i;
var birthdate = document.querySelector("#birthdayAdd"),
  age = document.querySelector("#ageAdd"),
  roundedAge = calculateAge(birthdate.value);
birthdate.addEventListener("change", () => {
  let roundedAge = calculateAge(birthdate.value);
  console.log(roundedAge);
  if (roundedAge <= 0) {
    showError(birthdate, "Invalid birthday");
    birthdate.value = "";
    age.value = 0;
  } else if (roundedAge <= 17) {
    showError(birthdate, "Person too young");
    showError(age, "Person too young");
    birthdate.value = "";
    age.value = 0;
  } else {
    removeError(birthdate);
    removeError(age);
    age.value = roundedAge;
  }
});
function listeners() {
  const links = document.querySelectorAll(".links");
  links.forEach((link) => {
    const tooltipText = link.getAttribute("data-tooltip");

    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    tooltip.textContent = tooltipText;

    link.appendChild(tooltip);
  });
  var profileExpand = document.querySelector("#profileExpand");
  var logoutHolder = document.querySelector("#logoutHolder");
  var logoutHolderOptions = document.querySelectorAll(".logoutHolder span");
  profileExpand.addEventListener("click", () => {
    logoutHolder.classList.toggle("hidden");
    logoutHolderOptions.forEach((action) => {
      action.addEventListener("click", () => {
        logoutHolder.classList.add("hidden");
      });
    });
  });
  for (let i = 0; i < 4; i++) {
    const clone = document.importNode(templateLoader.content, true);
    containerBody.appendChild(clone);
  }

  fetch("../JSON/clinic.json")
    .then((response) => response.json())
    .then((data) => {
      containerBody.innerHTML = "";
      function filterData(data, searchTerm) {
        searchTerm = searchTerm ? searchTerm.toLowerCase() : "";
        const filteredData = [];

        for (const clinic of data.clinics) {
          const name = clinic.name.toLowerCase();
          const description = clinic.description.toLowerCase();
          const staffCount = String(clinic.staffs);
          const servicesCount = String(clinic.services);
          const location = clinic.location.toLowerCase();

          if (
            name.includes(searchTerm) ||
            description.includes(searchTerm) ||
            staffCount.includes(searchTerm) ||
            servicesCount.includes(searchTerm) ||
            location.includes(searchTerm)
          ) {
            filteredData.push(clinic);
          }
        }

        return filteredData;
      }

      function updateDisplay(searchTerm) {
        containerBody.innerHTML = "";
        const filteredData = filterData(data, searchTerm);
        if (Object.keys(filteredData).length === 0) {
          const clone = document.importNode(nodatafound.content, true);
          containerBody.appendChild(clone);
        }

        for (const [i, clinic] of filteredData.entries()) {
          const clinicTemplate = document.importNode(
            mainTemplate.content,
            true
          );
          clinicTemplate.querySelector("#clinicId").textContent = clinic.id;
          clinicTemplate.querySelector("#clinicName").innerHTML = highlightText(
            String(clinic.name),
            searchTerm
          );
          clinicTemplate.querySelector("#clinicDescription").innerHTML =
            highlightText(String(clinic.description), searchTerm);
          clinicTemplate.querySelector("#clinicNameOriginal").innerHTML =
            String(clinic.name);
          truncateText(clinicTemplate.querySelector("#clinicName"), 36);
          clinicTemplate.querySelector("#clinicStaffCount").innerHTML =
            highlightText(String(clinic.staffs), searchTerm);
          clinicTemplate.querySelector("#clinicServicesCount").innerHTML =
            highlightText(String(clinic.services), searchTerm);
          clinicTemplate.querySelector("#clinicAddress").innerHTML =
            highlightText(String(clinic.location), searchTerm);
          clinicTemplate.querySelector("#clinicImage").src =
            "../images/" + clinic.imageSource;
          containerBody.appendChild(clinicTemplate);
        }
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
        var viewButton = document.querySelectorAll(".viewButton");
        var viewClinicInfos = document.querySelector("#viewClinicInfos");
        viewButton.forEach((view) => {
          view.addEventListener("click", (event) => {
            fetchStaff();
            fetchService();
            fetchAppointment();
            fetchClinicInformation();
            //fetch clinic ID
            // clinicId = event.target.closest(".clinic").querySelector("#clinicId").textContent
            // alert(clinicId)

            document.querySelector(".searchBar").classList.add("hidden");
            containerBody.classList.add("hidden");
            viewClinicInfos.classList.remove("hidden");
            let selectedPageIndex = 0;

            const searchInputs = document.querySelectorAll(".searchInputs");

            const navItems = document.querySelectorAll(".clinicInfoNavBar li");
            const contentElements = document.querySelectorAll(
              ".clinicInformations"
            );
            navItems.forEach((navItem, index) => {
              navItem.addEventListener("click", () => {
                navItems.forEach((item) =>
                  item.classList.remove("activeNavBar")
                );
                navItem.classList.add("activeNavBar");
                contentElements.forEach((content) =>
                  content.classList.add("hidden")
                );
                contentElements[index].classList.remove("hidden");
                toggleSearchInputs(searchInputs, index);
                // if (index >= 0 && index <= 2) {
                //   switch (index) {
                //     case 0:
                //       fetchStaff();
                //       break;
                //     case 1:
                //       fetchService();
                //       break;
                //     case 2:
                //       fetchAppointment();
                //       break;
                //   }
                // } else if (index === 3) {
                //   fetchClinicInformation();
                // }
                selectedPageIndex = index;
              });
            });
            navItems[selectedPageIndex].click();
          });

          var closeButton = document.querySelector("#closeButton");
          closeButton.addEventListener("click", () => {
            containerBody.classList.remove("hidden");
            viewClinicInfos.classList.add("hidden");
            document.querySelector(".searchBar").classList.remove("hidden");
            var searchBox = document.querySelectorAll(".searchBox");

            searchBox.forEach((search) => {
              clearSearchBoxes(search);
            });
          });
        });
      }

      updateDisplay("");
      var search = document.querySelector("#search");
      search.addEventListener("input", function () {
        updateDisplay(this.value);
      });
    });
}
function showForm() {
  var formBg = document.querySelector("#formBg"),
    closeForm = document.querySelector("#closeForm"),
    formContainer = document.querySelectorAll(".formContainer"),
    formContainer1 = document.querySelector(".formContainer1"),
    formContainer2 = document.querySelector(".formContainer2"),
    clinicNameAdd = document.querySelector("#clinicNameAdd"),
    facebookLinkAdd = document.querySelector("#facebookLinkAdd"),
    clinicDescriptionAdd = document.querySelector("#clinicDescriptionAdd"),
    numberAdd = document.querySelector("#numberAdd"),
    emailAdd = document.querySelector("#emailAdd"),
    province = document.querySelector("#province"),
    provinceInput = document.querySelector("#provinceInput"),
    city = document.querySelector("#city"),
    cityInput = document.querySelector("#cityInput"),
    barangay = document.querySelector("#barangay"),
    barangayInput = document.querySelector("#barangayInput"),
    firstName = document.querySelector("#firstNameAdd"),
    lastName = document.querySelector("#lastNameAdd"),
    middleName = document.querySelector("#middleNameAdd"),
    selectSex = document.querySelector("#selectSex"),
    sex = document.querySelector("#sex"),
    religion = document.querySelector("#religionAdd"),
    email = document.querySelector("#emailAddAdmin"),
    number = document.querySelector("#numberAdmin"),
    provinceAdmin = document.querySelector("#provinceAdmin"),
    cityAdmin = document.querySelector("#cityAdmin"),
    barangayAdmin = document.querySelector("#barangayAdmin"),
    provinceInputAdmin = document.querySelector("#provinceInputAdmin"),
    cityInputAdmin = document.querySelector("#cityInputAdmin"),
    barangayInputAdmin = document.querySelector("#barangayInputAdmin"),
    houseNumber = document.querySelector("#houseNumberAndStreet");

  resetDefault(clinicNameAdd, "");
  resetDefault(facebookLinkAdd, "");
  resetDefault(
    clinicDescriptionAdd,
    "This is a modern healthcare clinic providing quality services."
  );
  resetDefault(numberAdd, "");
  resetDefault(emailAdd, "");
  resetDefault(firstName, "");
  resetDefault(lastName, "");
  resetDefault(middleName, "");
  resetDefault(religion, "");
  resetDefault(birthdate, "");
  resetDefault(age, "");
  resetDefault(email, "");
  resetDefault(number, "");
  resetDefault(birthdate, "");
  resetDefault(houseNumber, "");
  resetDefaultSelect(selectSex, sex, "");
  resetDefaultSelect(province, provinceInput, "");
  resetDefaultSelect(city, cityInput, "");
  resetDefaultSelect(barangay, barangayInput, "");
  resetDefaultSelect(provinceAdmin, provinceInputAdmin, "");
  resetDefaultSelect(cityAdmin, cityInputAdmin, "");
  resetDefaultSelect(barangayAdmin, barangayInputAdmin, "");

  formContainer.forEach((forms) => {
    forms.classList.remove("hidden");
  });

  if (
    !formContainer1.classList.contains("hidden") &&
    !formContainer2.classList.contains("hidden")
  ) {
    formContainer1.classList.add("hidden");
    formContainer2.classList.add("hidden");
  }
  formBg.classList.remove("hidden");
  closeForm.addEventListener("click", () => {
    formBg.classList.add("hidden");
  });
}
function showValue(selectElement, input) {
  var selectedText = selectElement.options[selectElement.selectedIndex].text;
  input.value = selectedText;
}
function validateClinicInfo() {
  var clinicNameAdd = document.querySelector("#clinicNameAdd"),
    facebookLinkAdd = document.querySelector("#facebookLinkAdd"),
    clinicDescriptionAdd = document.querySelector("#clinicDescriptionAdd"),
    numberAdd = document.querySelector("#numberAdd"),
    emailAdd = document.querySelector("#emailAdd"),
    province = document.querySelector("#province"),
    provinceInput = document.querySelector("#provinceInput").value.trim(),
    city = document.querySelector("#city"),
    cityInput = document.querySelector("#cityInput").value.trim(),
    barangay = document.querySelector("#barangay"),
    barangayInput = document.querySelector("#barangayInput").value.trim();

  var clinicName = clinicNameAdd.value.trim(),
    facebook = facebookLinkAdd.value.trim(),
    description = clinicDescriptionAdd.value.trim(),
    number = numberAdd.value.trim(),
    email = emailAdd.value.trim(),
    isValid = true;

  if (clinicName == "") {
    showError(clinicNameAdd, "This field is required");
    isValid = false;
  } else if (!lettersOnlyRegex.test(clinicName)) {
    showError(clinicNameAdd, "Invalid format");
    isValid = false;
  } else {
    removeError(clinicNameAdd);
  }

  if (facebook == "") {
    facebookLinkAdd.style.borderColor = "";
  } else if (!facebookPattern.test(facebook)) {
    showError(facebookLinkAdd, "Invalid format");
    isValid = false;
  } else {
    removeError(facebookLinkAdd);
  }

  if (description == "") {
    showError(clinicDescriptionAdd, "This field is required.");
    isValid = false;
  } else {
    removeError(clinicDescriptionAdd);
  }

  if (number == "") {
    showError(numberAdd, "This field is required.");
    isValid = false;
  } else if (!numbersOnlyRegex.test(number)) {
    showError(numberAdd, "Invalid format");
    isValid = false;
  } else if (number.length < 10) {
    showError(numberAdd, "Invalid format");
    isValid = false;
  } else {
    removeError(numberAdd);
  }

  if (email == "") {
    showError(emailAdd, "This field is required.");
    isValid = false;
  } else if (!emailRegex.test(email)) {
    showError(emailAdd, "Invalid format");
    isValid = false;
  } else {
    removeError(emailAdd);
  }

  if (provinceInput == "") {
    showError(province, "This field is required.");
    isValid = false;
  } else {
    removeError(province);
  }

  if (cityInput == "") {
    showError(city, "This field is required.");
    isValid = false;
  } else {
    removeError(city);
  }

  if (barangayInput == "") {
    showError(barangay, "This field is required.");
    isValid = false;
  } else {
    removeError(barangay);
  }
  if (isValid) {
    var formContainer = document.querySelectorAll(".formContainer"),
      formContainer1 = document.querySelector(".formContainer1"),
      formContainer2 = document.querySelector(".formContainer2");
    formContainer.forEach((forms) => {
      forms.classList.add("hidden");
    });

    formContainer1.classList.remove("hidden");
    formContainer2.classList.remove("hidden");
  }
}

function valdidateClinicAdmin() {
  var addClinicForm = document.querySelector("#addClinicForm"),
    clinicNameAdd = document.querySelector("#clinicNameAdd").value.trim(),
    firstName = document.querySelector("#firstNameAdd"),
    lastName = document.querySelector("#lastNameAdd"),
    middleName = document.querySelector("#middleNameAdd"),
    selectSex = document.querySelector("#selectSex"),
    sex = document.querySelector("#sex"),
    religion = document.querySelector("#religionAdd"),
    email = document.querySelector("#emailAddAdmin"),
    number = document.querySelector("#numberAdmin"),
    province = document.querySelector("#provinceAdmin"),
    city = document.querySelector("#cityAdmin"),
    barangay = document.querySelector("#barangayAdmin"),
    provinceInput = document.querySelector("#provinceInputAdmin"),
    cityInput = document.querySelector("#cityInputAdmin"),
    barangayInput = document.querySelector("#barangayInputAdmin"),
    houseNumber = document.querySelector("#houseNumberAndStreet");

  var firstNameValue = firstName.value.trim(),
    lastNameValue = lastName.value.trim(),
    middleNameValue = middleName.value.trim(),
    sexValue = sex.value.trim(),
    religionValue = religion.value.trim(),
    birthdateValue = birthdate.value.trim(),
    emailValue = email.value.trim(),
    numberValue = number.value.trim(),
    provinceValue = provinceInput.value.trim(),
    cityValue = cityInput.value.trim(),
    barangayValue = barangayInput.value.trim(),
    houseNumberValue = houseNumber.value.trim(),
    isValid = true;

  if (firstNameValue == "") {
    showError(firstName, "Field required");
    isValid = false;
  } else if (!lettersOnlyRegex.test(firstNameValue)) {
    showError(firstName, "Invalid format");
    isValid = false;
  } else {
    removeError(firstName);
  }
  if (lastNameValue == "") {
    showError(lastName, "Field required");
    isValid = false;
  } else if (!lettersOnlyRegex.test(lastNameValue)) {
    showError(lastName, "Invalid format");
    isValid = false;
  } else {
    removeError(lastName);
  }
  if (middleNameValue == "") {
    middleName.style.borderColor = "";
  } else if (!lettersOnlyRegex.test(middleNameValue)) {
    showError(firstName, "Invalid format");
    isValid = false;
  } else {
    removeError(middleName);
  }
  if (firstNameValue == "") {
    showError(firstName, "Field required");
    isValid = false;
  } else if (!lettersOnlyRegex.test(firstNameValue)) {
    showError(firstName, "Invalid format");
    isValid = false;
  } else {
    removeError(firstName);
  }
  if (sexValue == "") {
    showError(selectSex, "Field required");
    isValid = false;
  } else {
    removeError(selectSex);
  }
  if (religionValue == "") {
    showError(religion, "Field required");
    isValid = false;
  } else if (!lettersOnlyRegex.test(religionValue)) {
    showError(religion, "Invalid format");
    isValid = false;
  } else {
    removeError(religion);
  }
  if (roundedAge <= 0) {
    showError(age, "Invalid age");
    showError(birthdate, "Invalid birthdate");
    isValid = false;
  }
  if (birthdateValue == "") {
    showError(age, "Age missing");
    showError(birthdate, "Birthdate missing");
    isValid = false;
  } else {
    removeError(age);
  }
  if (emailValue == "") {
    showError(email, "Email missing");
    isValid = false;
  } else if (!emailRegex.test(emailValue)) {
    showError(email, "Invalid format");
    isValid = false;
  } else {
    removeError(email);
  }
  if (numberValue == "") {
    showError(number, "Phone number Missing");
    isValid = false;
  } else if (numberValue.length < 10) {
    showError(number, "Invalid number");
    isValid = false;
  } else if (!numbersOnlyRegex.test(numberValue)) {
    showError(number, "Invalid format");
    isValid = false;
  } else {
    removeError(number);
  }
  if (provinceValue == "") {
    showError(province, "Field required");
    isValid = false;
  } else {
    removeError(province);
  }
  if (cityValue == "") {
    showError(city, "Field required");
    isValid = false;
  } else {
    removeError(city);
  }
  if (barangayValue == "") {
    showError(barangay, "Field required");
    isValid = false;
  } else {
    removeError(barangay);
  }

  if (isValid) {
    addClinicForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const formDataObject = {};
      formData.forEach((value, key) => {
        formDataObject[key] = value;
      });
      console.log(formDataObject);
    });
    Swal.fire({
      title: "Confirm adding " + clinicNameAdd,
      text: "You won't be able to revert this.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#73E977",
      cancelButtonColor: "#fa6363",
      confirmButtonText: "Confirm",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: clinicNameAdd + " added",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          addClinicForm.submit();
        });
      }
    });
  }
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
  var parentElem = input.parentElement,
    errorMes = parentElem.querySelector(".errorMessage");
  errorMes.innerText = message;
  input.style.borderColor = "var(--red)";
  input.classList.add("shake");
  setTimeout(() => {
    input.classList.remove("shake");
  }, 500);
}
function removeError(input) {
  (parentElem = input.parentElement),
    (errorMes = parentElem.querySelector(".errorMessage"));
  errorMes.innerText = "";
  input.style.borderColor = "var(--green)";
}
function resetDefault(input, inputValue) {
  input.style.borderColor = "";
  input.value = inputValue;
  (parentElem = input.parentElement),
    (errorMes = parentElem.querySelector(".errorMessage"));
  errorMes.innerText = "";
}
function resetDefaultSelect(select, input, inputValue) {
  select.selectedIndex = 0;
  select.style.borderColor = "";
  input.value = inputValue;
  (parentElem = select.parentElement),
    (errorMes = parentElem.querySelector(".errorMessage"));
  errorMes.innerText = "";
}
function copyLink() {
  var link = document.querySelector("#facebookLink").textContent;
  navigator.clipboard.writeText(link).then(() => {
    var confirmSound = document.querySelector("#confirmSound");
    confirmSound.play();
    Swal.fire({
      title: "Link copied",
      icon: "success",
      timer: 1000,
      showConfirmButton: false,
    });
  });
}
async function fetchStaff() {
  try {
    for (let i = 0; i < 10; i++) {
      const clone = document.importNode(staffTemplateLoader.content, true);
      const mainDiv = clone.querySelector(".staffViewHolder");

      mainDiv.style.animationDelay = `${i * 0.1}s`;

      ci1.appendChild(clone);
      setTimeout(() => {
        mainDiv.classList.add("pop-up");
      }, 100 + i * 100);
    }

    const response = await fetch("../JSON/fetchStaffperClinic.json");
    const data = await response.json();

    function filterData(data, searchTerm) {
      searchTerm = searchTerm ? searchTerm.toLowerCase() : "";
      const filteredData = [];

      for (const item of data.staff) {
        const fullName = item.fullName.toLowerCase();
        const position = item.position.toLowerCase();
        const email = item.email.toLowerCase();
        const contactNumber = item.contactNumber.toLowerCase();

        if (
          fullName.includes(searchTerm) ||
          position.includes(searchTerm) ||
          email.includes(searchTerm) ||
          contactNumber.includes(searchTerm)
        ) {
          filteredData.push(item);
        }
      }

      return filteredData;
    }

    function updateDisplay(searchTerm) {
      const filteredData = filterData(data, searchTerm);
      ci1.innerHTML = "";

      if (filteredData.length === 0) {
        const clone = document.importNode(nodatafound.content, true);
        ci1.appendChild(clone);
      } else {
        filteredData.forEach((item, i) => {
          const clone = document.importNode(staffTemplateMain.content, true);
          const mainDiv = clone.querySelector(".staffViewHolder");
          const staffViewHolder = clone.querySelector(".staffViewHolder");
          const staffImgHolder = clone.querySelector(".staffImgHolder1");

          staffImgHolder.style.backgroundColor =
            item.status === "pending" ? "var(--lightgray)" : "";
          staffViewHolder.querySelector("#staffImgHolder").src =
            "../images/" + item.imageSource;
          staffViewHolder.querySelector("#staffName").innerHTML = highlightText(
            item.fullName,
            searchTerm
          );
          staffViewHolder.querySelector("#staffPosition").innerHTML =
            highlightText(item.position, searchTerm);
          staffViewHolder.querySelector("#staffEmail").innerHTML =
            highlightText(item.email, searchTerm);
          staffViewHolder.querySelector("#staffNumber").innerHTML =
            highlightText(item.contactNumber, searchTerm);

          ci1.appendChild(clone);
          setTimeout(() => {
            mainDiv.classList.add("pop-up");
          }, 100 + i * 100);
        });
      }
    }

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

    updateDisplay("");

    // Add an event listener for the search input
    var search = document.querySelector("#searchStaff");
    search.addEventListener("input", function () {
      updateDisplay(this.value);
    });
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function fetchService() {
  try {
    for (let i = 0; i < 12; i++) {
      const clone = document.importNode(serviceTemplateLoader.content, true);
      const mainDiv = clone.querySelector(".serviceViewHolder");

      mainDiv.style.animationDelay = `${i * 0.1}s`;

      ci2.appendChild(clone);
      setTimeout(() => {
        mainDiv.classList.add("pop-up");
      }, 100 + i * 100);
    }

    const response = await fetch("../JSON/fetchServicesperClinic.json");
    const data = await response.json();

    function filterData(data, searchTerm) {
      searchTerm = searchTerm ? searchTerm.toLowerCase() : "";
      const filteredData = [];

      for (const item of data.services) {
        const fullName = item.serviceName.toLowerCase();

        if (fullName.includes(searchTerm)) {
          filteredData.push(item);
        }
      }

      return filteredData;
    }

    function updateDisplay(searchTerm) {
      const filteredData = filterData(data, searchTerm);
      ci2.innerHTML = "";

      if (filteredData.length === 0) {
        const clone = document.importNode(nodatafound.content, true);
        ci2.appendChild(clone);
      } else {
        filteredData.forEach((item, i) => {
          const clone = document.importNode(serviceTemplateMain.content, true);
          const mainDiv = clone.querySelector(".serviceViewHolder");
          const serviceViewHolder = clone.querySelector(".serviceViewHolder");

          serviceViewHolder.querySelector("#serviceImage").src =
            "../images/" + item.imageSource;
          serviceViewHolder.querySelector("#serviceName").innerHTML =
            highlightText(item.serviceName, searchTerm);

          ci2.appendChild(clone);
          setTimeout(() => {
            mainDiv.classList.add("pop-up");
          }, 100 + i * 100);
        });
      }
    }

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

    updateDisplay("");

    // Add event listener for the search input
    var search = document.querySelector("#searchServices");
    search.addEventListener("input", function () {
      updateDisplay(this.value);
    });
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function fetchAppointment() {
  try {
    for (let i = 0; i < 12; i++) {
      const clone = document.importNode(
        appointmentTemplateLoader.content,
        true
      );
      const mainDiv = clone.querySelector(".tableRow");

      mainDiv.style.animationDelay = `${i * 0.1}s`;

      tableBody.appendChild(clone);
      setTimeout(() => {
        mainDiv.classList.add("pop-up");
      }, 100 + i * 100);
    }

    const response = await fetch("../JSON/fetchAppointmentpreClinic.json");
    const data = await response.json();

    function filterData(data, searchTerm) {
      searchTerm = searchTerm ? searchTerm.toLowerCase() : "";
      const filteredData = [];

      for (const item of data.appointments) {
        const fullName = item.fullName.toLowerCase();
        const appointmentStatus = item.appointmentStatus.toLowerCase();
        const date = String(item.date);
        const time = String(item.time.toLowerCase());

        if (
          fullName.includes(searchTerm) ||
          appointmentStatus.includes(searchTerm) ||
          date.includes(searchTerm) ||
          time.includes(searchTerm)
        ) {
          filteredData.push(item);
        }
      }

      return filteredData;
    }

    function updateDisplay(searchTerm) {
      const filteredData = filterData(data, searchTerm);
      tableBody.innerHTML = "";

      if (filteredData.length === 0) {
        const clone = document.importNode(nodatafound.content, true);
        tableBody.appendChild(clone);
      } else {
        filteredData.forEach((item, i) => {
          const clone = document.importNode(
            appointmentTemplateMain.content,
            true
          );
          const mainDiv = clone.querySelector(".tableRow");
          const tableRow = clone.querySelector(".tableRow");
          var appointmentStatus = item.appointmentStatus.toLowerCase();
          var color = tableRow.querySelector("#patientAppointmentStatus");
          switch (appointmentStatus) {
            case "accepted":
              color.style.color = "var(--green)";
              break;
            case "pending":
              color.style.color = "var(--orange)";
              break;
            case "rejected":
              color.style.color = "var(--red)";
              break;
          }
          tableRow.querySelector("#appointmentImage").src =
            "../images/" + item.imageSource;
          tableRow.querySelector("#patientName").innerHTML = highlightText(
            item.fullName,
            searchTerm
          );
          tableRow.querySelector("#patientAppointmentStatus").innerHTML =
            highlightText(item.appointmentStatus, searchTerm);
          tableRow.querySelector("#appointmentDate").innerHTML = highlightText(
            item.date,
            searchTerm
          );
          tableRow.querySelector("#appointmentTime").innerHTML = highlightText(
            item.time,
            searchTerm
          );

          tableRow.querySelector("#originalServices").innerHTML =
            item.servicesAvailed.join("<br> ");
          const servicesAvailedElement = tableRow.querySelector(
            "#patientServicesAvailed"
          );
          servicesAvailedElement.innerHTML = item.servicesAvailed.join("<br> ");
          truncateText(tableRow.querySelector("#patientServicesAvailed"), 25);
          tableBody.appendChild(clone);
          setTimeout(() => {
            mainDiv.classList.add("pop-up");
          }, 100 + i * 100);
        });
      }
    }

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

    updateDisplay("");

    // Add event listener for the search input
    var search = document.querySelector("#searchAppointment");
    search.addEventListener("input", function () {
      updateDisplay(this.value);
    });
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function fetchClinicInformation() {
  try {
    const response = await fetch("../JSON/fetchClinicInformation.json");
    const data = await response.json();

    const clinicInfo = data.clinicInfo;
    const image = clinicInfo.image;
    const logo = clinicInfo.logo;
    const clinicName = clinicInfo.clinicName;
    const description = clinicInfo.description;
    const staffCount = clinicInfo.staffCount;
    const servicesCount = clinicInfo.servicesCount;
    const appointmentsCount = clinicInfo.appointmentsCount;
    const email = clinicInfo.email;
    const location = clinicInfo.location;
    const facebookLink = clinicInfo.facebookLink;

    document.querySelector("#clinicNameAbout").textContent = clinicName;
    document.querySelector("#image1").src = "../images/" + logo;
    document.querySelector("#image2").src = "../images/" + image;
    document.querySelector("#clinicDescriptionAbout").textContent = description;
    document.querySelector("#staffCount").textContent = staffCount;
    document.querySelector("#servicesCount").textContent = servicesCount;
    document.querySelector("#appointmentsCount").textContent =
      appointmentsCount;
    document.querySelector("#emailAbout").textContent = email;
    document.querySelector("#locationAbout").textContent = location;
    document.querySelector("#facebookLink").textContent = facebookLink;

    for (const contactNumber of clinicInfo.contactNumbers) {
      const temp = document.importNode(contactNumberTemplate.content, true);
      temp.querySelector("#numberAbout").innerText = contactNumber;
      contactNumberContainer.appendChild(temp);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
function selectSex() {
  var options = document.querySelector(".sexOptions");
  var sexValue = document.querySelector("#sex");
  var sexOptions = document.querySelectorAll(".sexOptions span");
  var selectedSex = document.querySelector("#selectedSex");
  var preview2 = document.querySelector("#preview2");
  var addAdminPicture = document.querySelector("#addAdminPicture");

  options.classList.toggle("hidden");

  sexOptions.forEach((select) => {
    select.addEventListener("click", () => {
      var sex = select.textContent;
      selectedSex.textContent = sex;
      sexValue.value = selectedSex;
      if (addAdminPicture.files.length === 0) {
        switch (sex) {
          case "Male":
            preview2.src = "../images/noProfile.png";
            break;
          case "Female":
            preview2.src = "../images/noProfileGirl.png";
        }
      }
      if (!options.classList.contains("hidden")) {
        options.classList.add("hidden");
      }
    });
  });
}
function backButton() {
  var formContainer = document.querySelectorAll(".formContainer"),
    formContainer1 = document.querySelector(".formContainer1"),
    formContainer2 = document.querySelector(".formContainer2");
  formContainer.forEach((forms) => {
    forms.classList.remove("hidden");
  });

  formContainer1.classList.add("hidden");
  formContainer2.classList.add("hidden");
}
function deleteClinic(event) {
  clinicNameOriginal = event.target
    .closest(".clinic")
    .querySelector("#clinicNameOriginal").textContent;
  Swal.fire({
    title: "Delete " + clinicNameOriginal,
    text: "You won't be able to revert this.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#73E977",
    cancelButtonColor: "#fa6363",
    confirmButtonText: "Confirm",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        text: clinicNameOriginal + " deleted",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  });
}

function clearSearchBoxes(input) {
  input.value = "";
}
function toggleSearchInputs(searchInputs, selectedIndex) {
  searchInputs.forEach((input, index) => {
    if (index === selectedIndex) {
      input.classList.remove("hidden"); // Show the selected input
    } else {
      input.classList.add("hidden"); // Hide other inputs
    }
  });
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
function previewImage1(event) {
  var fileInput = event.target;
  var file = fileInput.files[0];

  if (file) {
    if (validateFileType(file) && validateFileSize(file)) {
      previewFile1(file);
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
function previewImage2(event) {
  var fileInput = event.target;
  var file = fileInput.files[0];

  if (file) {
    if (validateFileType(file) && validateFileSize(file)) {
      previewFile2(file);
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
function handleDrop1(event) {
  event.preventDefault();
  event.stopPropagation();

  var file = event.dataTransfer.files[0];
  if (validateFileType(file) && validateFileSize(file)) {
    previewFile1(file);
  } else {
    Swal.fire({
      text: "Drop a JPEG, JPG, or PNG file under 5MB.",
      icon: "warning",
      timer: 2000,
      showConfirmButton: false,
    });
  }
}
function handleDrop2(event) {
  event.preventDefault();
  event.stopPropagation();

  var file = event.dataTransfer.files[0];
  if (validateFileType(file) && validateFileSize(file)) {
    previewFile2(file);
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
function previewFile1(file) {
  var reader = new FileReader();

  reader.onload = function (e) {
    var previewImage = document.getElementById("preview1");
    previewImage.src = e.target.result;
  };

  reader.readAsDataURL(file);
}
function previewFile2(file) {
  var reader = new FileReader();

  reader.onload = function (e) {
    var previewImage = document.getElementById("preview2");
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

function truncateText(element, limit) {
  var text = element.textContent;
  if (text.length > limit) {
    var truncated = text.substring(0, limit) + "...";
    element.textContent = truncated;
  }
}

function truncateText(element, limit) {
  var text = element.textContent;
  if (text.length > limit) {
    var truncated = text.substring(0, limit) + "...";
    element.textContent = truncated;
  }
}
function viewNotification(event) {
  var url = event.currentTarget.querySelector("#urlRedirect").textContent;
  window.location.href = "../Admin" + url;
}

async function fetchNotification() {
  const container = document.querySelector("#allNotification");
  const loader = document.querySelector("#notificationLoader");
  const mainContainer = document.querySelector("#notificationMainTemplate");
  const nodatafound = document.querySelector("#no-notifications");
  try {
    for (let i = 0; i < 5; i++) {
      const clone = document.importNode(loader.content, true);
      container.appendChild(clone);
    }
    const response = await fetch("../JSON/notification.json");
    const data = await response.json();
    console.log(data);

    function filterData(data, searchTerm) {
      searchTerm = searchTerm ? searchTerm.toLowerCase() : "";
      const filteredData = [];

      for (const notifs of data.notification) {
        const title = notifs.title.toLowerCase();
        const text = notifs.text.toLowerCase();
        if (title.includes(searchTerm) || text.includes(searchTerm)) {
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

          var notificationStatus = item.status;

          if (notificationStatus === false) {
            clone.querySelector(".notif").classList.add("unread");
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
          notificationDots.classList.add("hidden");
        } else {
          notificationDots.classList.remove("hidden");
        }
      }
    }
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

    updateDisplay("");
    var search = document.querySelector("#searchNotification");
    search.addEventListener("input", function () {
      updateDisplay(this.value);
    });
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
function viewNotificationContainer(event) {
  var parent = event.target.parentElement;
  var notificationContainer = parent.querySelector(".notificationContainer");
  notificationContainer.classList.toggle("hidden");
  event.target.classList.toggle("showContainer");
}
