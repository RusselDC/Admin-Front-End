function onload() {
  listeners();
  fetchNotification();
}

function listeners() {
  //update the sidebar js
  const links = document.querySelectorAll(".links");
  links.forEach((link) => {
      const tooltipText = link.getAttribute("data-tooltip");

      const tooltip = document.createElement("div");
      tooltip.classList.add("tooltip");
      tooltip.textContent = tooltipText;

      link.appendChild(tooltip);
  });
   //end of the update
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
  fetch("https://run.mocky.io/v3/f2868cd7-e6bb-4af5-a24d-42f4c37e7614")
    .then((res) => res.json())
    .then((posts) => {
      console.log(posts);
      tableBody.innerHTML = "";
      posts.forEach((post) => {
        const tableRow = patientTemplate.content.cloneNode(true);
        var stat = tableRow.querySelector("#statusTable");
        if (post.status == "Accepted") {
          stat.style.color = "#73E977";
        } else if (post.status == "Pending") {
          stat.style.color = "#FCC865";
        } else {
          stat.style.color = "#fa6363";
        }

        tableRow.querySelector("#numberTable").textContent = post.number;
        tableRow.querySelector("#patientName").textContent = post.name;
        tableRow.querySelector("#patientNameOriginalValue").textContent =
          post.name;
        truncateText(tableRow.querySelector("#patientName"), 25);
        tableRow.querySelector("#dateTable").textContent = post.date;
        tableRow.querySelector("#timeTable").textContent = post.date;
        tableRow.querySelector("#serviceTable").textContent = post.service;
        tableRow.querySelector("#serviceTableOriginalValue").textContent =
          post.service;
        truncateText(tableRow.querySelector("#serviceTable"), 15);
        tableRow.querySelector("#statusTable").textContent = post.status;
        tableBody.append(tableRow);
      });

      var editButtons = document.querySelectorAll(".fa-pen");
      var deleteButtons = document.querySelectorAll(".fa-trash");

      editButtons.forEach((editButton) => {
        editButton.addEventListener("click", function () {
          var patientName = this.closest("tr").querySelector(
            "#patientNameOriginalValue"
          ).textContent;
          var statusTable =
            this.closest("tr").querySelector("#statusTable").textContent;
          var dateTable =
            this.closest("tr").querySelector("#dateTable").textContent;
          var timeTable =
            this.closest("tr").querySelector("#timeTable").textContent;
          var serviceTable = this.closest("tr").querySelector(
            "#serviceTableOriginalValue"
          ).textContent;

          if (statusTable === "Pending") {
            // Show Accept Modal
            var acceptModal = document.querySelector("#acceptModal");
            acceptModal.classList.add("showElement");

            //fetch data
            acceptModal.querySelector("#appoinmentService").textContent =
              serviceTable;
            acceptModal.querySelector("#serviceInfo").textContent =
              serviceTable;
            acceptModal.querySelector("#appointmentDate").textContent =
              dateTable;
            acceptModal.querySelector("#appointmentTime").textContent =
              timeTable;
            acceptModal.querySelector("#patientName").textContent = patientName;

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
