// // Get all elements with the id #viewPatient
// var viewPatientElements = document.querySelectorAll("#viewPatient");

// // Get the patient container table
// var patientContainerTable = document.querySelector(".tableContainer");

// // Get the pagination element
// var pagination = document.querySelector(".pagination");

// // Get the addPatient element
// var addPatient = document.querySelector("#addPatient");

// // Add an onclick function to each element
// viewPatientElements.forEach(function (element) {
//   element.onclick = function () {
//     // Check if .pageTitle contains " / View Patient"
//     var pageTitle = document.querySelector(".pageTitle");
//     if (pageTitle && !pageTitle.textContent.includes(" / View Patient")) {
//       // Concatenate " / View Patient" to .pageTitle
//       pageTitle.textContent += " / View Patient";
//     }

//     // Hide the patient container table, pagination, and addPatient
//     patientContainerTable.style.display = "none";
//     pagination.style.display = "none";
//     addPatient.style.display = "none";
//   };
// });
