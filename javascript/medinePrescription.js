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
  profileExpand.addEventListener("click", ()=>{
    logoutHolder.classList.toggle("hidden");
    logoutHolderOptions.forEach((action)=>{
      action.addEventListener("click", ()=>{
        logoutHolder.classList.add("hidden")
      })
    })
  })
  //search on everytype
  search.addEventListener("input", function () {
    //your code
    console.log(this.value);
  });

  // loader
  const containerBody = document.querySelector("#containerBody");

  const templateMedicineType = document.querySelector("#templateMedicineType");
  const medsInfo = document.querySelector("#medsInfo");

  for (let i = 0; i < 20; i++) {
    const clone = document.importNode(templateMedicineType.content, true);
    containerBody.appendChild(clone);
  }
  fetch("https://run.mocky.io/v3/1e948712-e585-420c-85af-5d0a4c29ab8a")
    .then((response) => response.json())
    .then((data) => {
      updateDisplay("", data);
      var search = document.querySelector("#search");
      search.addEventListener("input", function () {
        updateDisplay(this.value, data);
      });
    });
  function filterData(data, searchTerm) {
    searchTerm = searchTerm ? searchTerm.toLowerCase() : "";
    const filteredData = [];
    for (const patientInfo of data.patients) {
      const patientNameLower = patientInfo.patientName.toLowerCase();
      const doctorNameLower = patientInfo.issuedBy.toLowerCase();
      const dateIssuedLower = patientInfo.dateIssued.toLowerCase();

      if (
        patientNameLower.includes(searchTerm) ||
        doctorNameLower.includes(searchTerm) ||
        dateIssuedLower.includes(searchTerm)
      ) {
        const filteredPatient = { ...patientInfo };
        const filteredMedicines = [];

        for (const medicineKey in patientInfo.medicinesPrescribed) {
          if (patientInfo.medicinesPrescribed.hasOwnProperty(medicineKey)) {
            const medicine = patientInfo.medicinesPrescribed[medicineKey];
            filteredMedicines.push(medicine);
          }
        }
        filteredPatient.medicinesPrescribed = filteredMedicines;
        filteredData.push(filteredPatient);
      }
    }
    return filteredData;
  }

  function updateDisplay(searchTerm, data) {
    const containerBody = document.querySelector("#containerBody");
    containerBody.innerHTML = "";
    const filteredData = filterData(data, searchTerm);

    for (const patient of filteredData) {
      const clonemedicineTypeTemplate = document.importNode(
        medsInfo.content,
        true
      );

      clonemedicineTypeTemplate.querySelector(
        "#patientNamePrescribe"
      ).innerHTML = highlightText(patient.patientName, searchTerm);
      clonemedicineTypeTemplate.querySelector(
        "#patientNamePrescribeOriginal"
      ).textContent = patient.patientName;
      truncateText(
        clonemedicineTypeTemplate.querySelector("#patientNamePrescribe"),
        22
      );
      clonemedicineTypeTemplate.querySelector("#issuedBy").innerHTML =
        highlightText(patient.issuedBy, searchTerm);
      clonemedicineTypeTemplate.querySelector("#issuedByOriginal").textContent =
        patient.issuedBy;
      truncateText(clonemedicineTypeTemplate.querySelector("#issuedBy"), 15);
      clonemedicineTypeTemplate.querySelector("#medicineBrand").innerHTML =
        highlightText(patient.dateIssued, searchTerm);
      clonemedicineTypeTemplate.querySelector("#patientAge").textContent =
        patient.age;
      clonemedicineTypeTemplate.querySelector("#patientAddress").textContent =
        patient.address;

      let patientMedications = "";

      for (const medicineKey in patient.medicinesPrescribed) {
        if (patient.medicinesPrescribed.hasOwnProperty(medicineKey)) {
          const medicine = patient.medicinesPrescribed[medicineKey];
          const medicationDetails = `${medicine.medicineName} ${medicine.medicineBrand} ${medicine.medicineDosage} ${medicine.medicineDosageType} (${medicine.medicineType}) - ${medicine.medicineTotal} pcs.`;
          patientMedications += medicationDetails + "<br>";
        }
      }

      clonemedicineTypeTemplate.querySelector("#medicineinfos").innerHTML =
        highlightText(patientMedications, searchTerm);
      clonemedicineTypeTemplate.querySelector(
        "#medicineinfosOriginal"
      ).innerHTML = patientMedications;
      truncateText(
        clonemedicineTypeTemplate.querySelector("#medicineinfos"),
        30
      );
      containerBody.appendChild(clonemedicineTypeTemplate);
    }
    const prescribeMedicine = document.querySelectorAll(".prescribeMedicine");
    const bg = document.querySelector("#bg");
    const printPage = document.querySelector("#printPage");
    prescribeMedicine.forEach((meds) => {
      meds.addEventListener("click", function () {
        bg.classList.remove("hidden");

        var patientName = this.closest(".medicineInformations").querySelector(
          "#patientNamePrescribeOriginal"
        ).textContent;
        var dentistName = this.closest(".medicineInformations").querySelector(
          "#issuedByOriginal"
        ).textContent;
        var issuedDate = this.closest(".medicineInformations").querySelector(
          "#medicineBrand"
        ).textContent;
        medicineinfosOriginal;
        var medicinesPrescribed = this.closest(
          ".medicineInformations"
        ).querySelector("#medicineinfosOriginal").innerHTML;
        var age = this.closest(".medicineInformations").querySelector(
          "#patientAge"
        ).textContent;
        var address = this.closest(".medicineInformations").querySelector(
          "#patientAddress"
        ).textContent;

        printPage.querySelector("#dentistName").textContent = dentistName;
        printPage.querySelector("#patientName").textContent = patientName;
        printPage.querySelector("#datePrescribed").textContent = issuedDate;
        printPage.querySelector(".medicinesPrescribedInfo").innerHTML =
          medicinesPrescribed;
        printPage.querySelector("#patientAge").textContent = age;
        printPage.querySelector("#patientAddress").textContent = address;
      });

      var cancelPrintButton = bg.querySelector("#cancelPrint");
      cancelPrintButton.addEventListener("click", function () {
        bg.classList.add("hidden");
      });
      var printButton = bg.querySelector("#printButton");
      printButton.addEventListener("click", function () {
        window.print(printPage);
      });
    });
  }
}
function highlightText(text, searchTerm) {
  if (!searchTerm) {
    return text;
  }

  const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, "gi");
  return text.replace(
    regex,
    (match) => `<span class="highlight">${match}</span>`
  );
}

function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
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
