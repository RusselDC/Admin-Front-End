function onload() {
  listeners();
}

function listeners() {
  var sortButton = document.querySelector("#sortButton");
  var sortOptions = document.querySelector("#sortOptions");
  var sorts = document.querySelectorAll(".sortOptions span");
  var sortText = document.querySelector("#sortText");
  var search = document.querySelector("#search");
  var calendarShow = document.querySelector("#calendarShow");
  var calendarShow = document.querySelector("#calendarShow");
  var calendarContainer = document.querySelector("#calendarContainer");
  const caretIcons = document.querySelectorAll(".fa-caret-down");
  //show sort Options
  sortButton.addEventListener("click", () => {
    sortOptions.classList.toggle("showElement");
    calendarContainer.classList.remove("showElement");
    caretIcons.forEach((icon) => {
      const currentTransform = icon.style.transform;
      if (currentTransform === "") {
        icon.style.transform = "rotate(180deg)";
      } else {
        icon.style.transform = "";
      }
    });
  });
  calendarShow.addEventListener("click", function () {
    calendarContainer.classList.toggle("showElement");
    sortOptions.classList.remove("showElement");
    caretIcons.forEach((icon) => {
      icon.style.transform = "";
    });
  });
  //change text content of sort button
  sorts.forEach(function (sort) {
    sort.addEventListener("click", function () {
      var textSpan = this.innerText;
      sortText.innerText = textSpan;
      sortOptions.classList.remove("showElement");
      const caretIcons = document.querySelectorAll(".fa-caret-down");
      caretIcons.forEach((icon) => {
        const currentTransform = icon.style.transform;
        if (currentTransform === "") {
          icon.style.transform = "rotate(180deg)";
        } else {
          icon.style.transform = "";
        }
      });
    });
  });
  //search on everytype
  search.addEventListener("input", function () {
    //your code
    console.log(this.value);
  });
  const tableBody = document.querySelector("#tableBody");
  const patientTemplate = document.querySelector("#patientTemplate");
  const patientTemplate1 = document.querySelector("#patientTemplate1");

  for (let i = 0; i < 10; i++) {
    tableBody.append(patientTemplate1.content.cloneNode(true));
  }
  fetch("https://run.mocky.io/v3/ebc4366c-c6c2-48fb-9f84-0a92d48ab30e")
    .then((res) => res.json())
    .then((posts) => {
      console.log(posts);
      tableBody.innerHTML = "";
      posts.forEach((post) => {
        const tableRow = patientTemplate.content.cloneNode(true);
        var stat = tableRow.querySelector("#statusTable");
        if (post.status == "Pending") {
          stat.style.color = "#FCC865";
        } else {
          stat.style.color = "#fa6363";
        }

        tableRow.querySelector("#numberTable").textContent = post.number;
        tableRow.querySelector("#patientName").textContent = post.name;
        tableRow.querySelector("#dateTable").textContent = post.date;
        tableRow.querySelector("#timeTable").textContent = post.date;
        tableRow.querySelector("#serviceTable").textContent = post.service;
        tableRow.querySelector("#statusTable").textContent = post.status;
        tableBody.append(tableRow);
      });

      var editButtons = document.querySelectorAll(".fa-pen");
      var deleteButtons = document.querySelectorAll(".fa-trash");

      editButtons.forEach((editButton) => {
        editButton.addEventListener("click", function () {
          var patientName =
            this.closest("tr").querySelector("#patientName").textContent;
          var statusTable =
            this.closest("tr").querySelector("#statusTable").textContent;
          var dateTable =
            this.closest("tr").querySelector("#dateTable").textContent;
          var timeTable =
            this.closest("tr").querySelector("#timeTable").textContent;
          var serviceTable =
            this.closest("tr").querySelector("#serviceTable").textContent;

          if (statusTable === "Pending") {
            // Show Accept Modal
            var acceptModal = document.querySelector("#acceptModal");
            acceptModal.classList.add("showElement");

            //fetch data
            document.querySelector("#appoinmentService").textContent =
              serviceTable;
            document.querySelector("#serviceInfo").textContent = serviceTable;
            document.querySelector("#appointmentDate").textContent = dateTable;
            document.querySelector("#appointmentTime").textContent = timeTable;
            document.querySelector("#patientName").textContent = patientName;

            var closeAcceptModal = document.querySelector("#closeAcceptModal");
            closeAcceptModal.onclick = function () {
              acceptModal.classList.remove("showElement");
            };
            //reject apppointment then show the rejectmodal
            var rejectAppointment =
              document.querySelector("#rejectAppointment");
            rejectAppointment.addEventListener("click", function () {
              acceptModal.classList.remove("showElement");

              var rejectModal = document.querySelector("#rejectModal");
              rejectModal.classList.add("showElement");

              document.querySelector("#note").value = "";

              document.querySelector("#rejectModalServiceTitle").textContent =
                serviceTable;
              document.querySelector(
                "#rejectModalServiceTreatment"
              ).textContent = serviceTable;
              document.querySelector("#rejectModalDate").textContent =
                dateTable;
              document.querySelector("#rejectModalTime").textContent =
                dateTable;
              document.querySelector("#rejectModalPatientName").textContent =
                patientName;

              var sendButton = document.querySelector("#sendButton");
              sendButton.addEventListener("click", function () {
                //send note then reject appointment
                Swal.fire({
                  title: "Reject this Appointment?",
                  text: "You won't be able to revert this.",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#73E977",
                  cancelButtonColor: "#fa6363",
                  confirmButtonText: "Confirm",
                }).then((result) => {
                  if (result.isConfirmed) {
                    Swal.fire({
                      title: "Appointment Rejected",
                      icon: "success",
                      timer: 2000,
                      showConfirmButton: false,
                    }).then(() => {
                      rejectModal.classList.remove("showElement");
                      //reject appointment
                    });
                  }
                });
              });
            });
            var cancelButton = document.querySelector("#cancelButton");
            cancelButton.onclick = function () {
              rejectModal.classList.remove("showElement");
              acceptModal.classList.add("showElement");
            };
            var acceptAppointment =
              document.querySelector("#acceptAppointment");
            acceptAppointment.addEventListener("click", function () {
              //accept appointment
              Swal.fire({
                title: "Accept this Appointment?",
                text: "You won't be able to revert this.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#73E977",
                cancelButtonColor: "#fa6363",
                confirmButtonText: "Confirm",
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire({
                    title: "Appointment accepted",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                  }).then(() => {
                    acceptModal.classList.remove("showElement");
                    //reject appointment
                  });
                }
              });
            });
          } else if (statusTable === "Accepted") {
            //appointment Completed
            Swal.fire({
              title: "Appointment finished?",
              text: "You won't be able to revert this.",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#73E977",
              cancelButtonColor: "#fa6363",
              confirmButtonText: "Confirm",
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire({
                  title: "Appointment Completed",
                  icon: "success",
                  timer: 2000,
                  showConfirmButton: false,
                });
              }
            });
          }
        });
      });

      deleteButtons.forEach((deleteButton) => {
        deleteButton.addEventListener("click", function () {
          var numberTable =
            this.closest("tr").querySelector("#numberTable").textContent;
          //delete appointment
          Swal.fire({
            title: "Delete Appointment " + numberTable + "?",
            text: "You won't be able to revert this.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#73E977",
            cancelButtonColor: "#fa6363",
            confirmButtonText: "Confirm",
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "Appointment Deleted",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
              });
            }
          });
        });
      });
    });
}
