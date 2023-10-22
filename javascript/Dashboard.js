function onload() {
  listeners();
  fetchNotification();
  fetchDataForCharts();
  fetchTodayAppointments();
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
}
function viewNotification(event) {
  var url = event.currentTarget.querySelector("#urlRedirect").textContent;
  window.location.href = "../Admin" + url;
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
const hexColors = [
  { main: "#EF5350", subcolors: ["#F44336", "#E57373", "#FFCDD2"] },
  { main: "#7E57C2", subcolors: ["#673AB7", "#9575CD", "#D1C4E9"] },
  { main: "#42A5F5", subcolors: ["#2196F3", "#64B5F6", "#BBDEFB"] },
  { main: "#26A69A", subcolors: ["#009688", "#4DB6AC", "#B2DFDB"] },
];

const usedMainColors = [];
function getRandomMainColor() {
  if (usedMainColors.length === 3) {
    usedMainColors.length = 0;
  }
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * hexColors.length);
  } while (usedMainColors.includes(randomIndex));
  usedMainColors.push(randomIndex);
  return hexColors[randomIndex].main;
}

function getSubColors(mainColor) {
  const colorObj = hexColors.find((color) => color.main === mainColor);
  if (!colorObj) {
    return [];
  }
  const subcolors = [...colorObj.subcolors];

  return { mainColor, subcolors };
}

function getTotal(arr) {
  if (!Array.isArray(arr)) {
    return 0;
  }
  return arr.reduce((total, currentValue) => total + currentValue, 0);
}

let color1 = getRandomMainColor();
let color2 = getRandomMainColor();
let color3 = getRandomMainColor();

async function fetchDataForCharts() {
  fetch("../JSON/dataForCharts.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      let chartLabel = document.querySelector("#chartLabel"),
        chartLabel1 = document.querySelector("#chartLabel1"),
        chartLabel2 = document.querySelector("#chartLabel2"),
        count = document.querySelector("#count"),
        count1 = document.querySelector("#count1"),
        count2 = document.querySelector("#count2");
        const totalAppointments = data.totalAppointments;
        const topServices = data.topServices;
        const totalPatients = data.totalPatients;
        const dataBarChart1 = data.dataBarChart1;
        const dataBarChart2 = data.dataBarChart2;
        const dataBarChart3 = data.dataBarChart3;

      let totalValue = [];
      let services = [];
      let patients = 0;
      for(item of topServices){       
          totalValue.push(item.total)
          services.push(item.serviceName)
      }
      for(item of totalPatients){       

      }
      console.log(services + totalValue)

      if(services.length > 0){
        fetchDataPolarChart1(services, totalValue);
      }

      fetchDataPolarChart(totalAppointments);
      fetchDataPolarChart2(totalPatients);
      fetchDataBarChart(dataBarChart1, dataBarChart2, dataBarChart3);

      chartLabel.style.color = color1;
      count.style.backgroundColor = color1;
      count.textContent = getTotal(totalAppointments);

      chartLabel1.style.color = color2;
      count1.style.backgroundColor = color2;
      count1.textContent = getTotal(totalValue);

      chartLabel2.style.color = color3;
      count2.style.backgroundColor = color3;
      count2.textContent = getTotal(totalPatients);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function getMonthsAroundCurrent() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth();

  const monthsLast = [];

  for (let i = 0; i < 10; i++) {
    const monthIndex = (currentMonthIndex - i + 12) % 12;
    monthsLast.unshift(months[monthIndex]);
  }

  return monthsLast;
}
const result = getMonthsAroundCurrent();

let subcolorsForBarChart = [];

function fetchDataBarChart(dataBarChart1, dataBarChart2, dataBarChart3) {
  const ctx = document.querySelector("#barChart").getContext("2d");
  const data = {
    labels: result,
    datasets: [
      {
        label: "Appointments",
        data: dataBarChart1,
        backgroundColor: color1,
        borderColor: color1,
        borderWidth: 2,
        hoverOffset: 4,
        fill: false,
        cubicInterpolationMode: "monotone",
        tension: 1,
      },
      {
        label: "Services",
        data: dataBarChart2,
        backgroundColor: color2,
        borderColor: color2,
        borderWidth: 2,
        hoverOffset: 4,
        fill: false,
        cubicInterpolationMode: "monotone",
        tension: 1,
      },
      {
        label: "Patients",
        data: dataBarChart3,
        backgroundColor: color3,
        borderColor: color3,
        borderWidth: 2,
        hoverOffset: 4,
        fill: false,
        cubicInterpolationMode: "monotone",
        tension: 1,
      },
    ],
  };

  const myChart = new Chart(ctx, {
    type: "line",
    data: data,
    options: {
      plugins: {
        title: {
          display: true,
          position: "top",
        },
        legend: {
          display: true,
          position: "bottom",
          labels: {
            boxWidth: 10,
            padding: 20,
            usePointStyle: true,
            font: {
              size: 13,
              color: "#424242",
              family: "Poppins, Helvetica, sans-serif",
            },
          },
        },
      },
      interaction: {
        intersect: false,
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
          },
        },
        y: {
          display: true,
          title: {
            display: true,
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  });
  myChart.update();
}
function setupPolarChart(ctx, data) {
  const myChart1 = new Chart(ctx, {
    type: "polarArea",
    data: data,
    options: {
      plugins: {
        legend: {
          display: true,
          position: "right",
          labels: {
            boxWidth: 10,
            padding: 20,
            usePointStyle: true,
            font: {
              size: 10,
              color: "#424242",
              family: "Poppins, Helvetica ,sans-serif",
            },
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  });
  myChart1.update();
}
function fetchDataPolarChart(totalAppointments) {
  const ctx = document.querySelector("#doughnutChart").getContext("2d");
  const { subcolors } = getSubColors(color1);
  const data = {
    labels: ["Accepted", "Pending", "Cancelled"],
    datasets: [
      {
        data: totalAppointments,
        backgroundColor: subcolors,
        hoverOffset: 4,
        fill: false,
      },
    ],
  };

  setupPolarChart(ctx, data);
}
function fetchDataPolarChart1(services, totalValue) {
  const ctx = document.querySelector("#doughnutChart1").getContext("2d");
  const { subcolors } = getSubColors(color2);
  const data = {
    labels: [services[0],services[1],services[2]],
    datasets: [
      {
        data: [totalValue[0],totalValue[1],totalValue[2]],
        backgroundColor: subcolors,
        hoverOffset: 4,
        fill: false,
      },
    ],
  };

  setupPolarChart(ctx, data);
}
function fetchDataPolarChart2(totalPatients) {
  const ctx = document.querySelector("#doughnutChart2").getContext("2d");
  const { subcolors } = getSubColors(color3);
  const data = {
    labels: ["Male", "Female"],
    datasets: [
      {
        data: totalPatients,
        backgroundColor: subcolors,
        hoverOffset: 4,
        fill: false,
      },
    ],
  };

  setupPolarChart(ctx, data);
}

async function fetchTodayAppointments() {
  const appointmentCurrent = document.querySelector("#appointmentCurrent");
  const appointmentUpcoming = document.querySelector("#appointmentUpcoming");
  const appointmentLoader = document.querySelector("#appointmentLoader");
  const appointmentMain = document.querySelector("#appointmentMain");
  const noappointment = document.querySelector("#noappointment");

  try {
    for (let i = 0; i < 1; i++) {
      const clone = document.importNode(appointmentLoader.content, true);
      appointmentCurrent.appendChild(clone);
    }
    for (let i = 0; i < 5; i++) {
      const clone = document.importNode(appointmentLoader.content, true);
      appointmentUpcoming.appendChild(clone);
    }

    const response = await fetch("../JSON/appointmentsEveryday.json");
    const data = await response.json();

    const now = new Date();
    const currentTime = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const currentAppointments = data.appointments.filter((appointment) => {
      return !appointment.status && appointment.startTime < currentTime;
    });

    const upcomingAppointments = data.appointments.filter((appointment) => {
      return !appointment.status && appointment.startTime > currentTime;
    });

    
    currentAppointments.sort((a, b) => a.startTime.localeCompare(b.startTime));
    upcomingAppointments.sort((a, b) => a.startTime.localeCompare(b.startTime));
    console.log(currentAppointments)
    appointmentCurrent.innerHTML = "";
    appointmentUpcoming.innerHTML = "";

    if (currentAppointments.length > 0) {
      appointmentCurrent.innerHTML = "";
      const lastCurrentAppointment = currentAppointments[currentAppointments.length - 1];
      const mainTemplateClone = document.importNode(appointmentMain.content, true);
      mainTemplateClone.querySelector(".appointment").style.borderColor = "#A5D6A7";
      mainTemplateClone.querySelector("#time").textContent = lastCurrentAppointment.startTime;
      mainTemplateClone.querySelector("#appointmentId").textContent = lastCurrentAppointment.id;
      mainTemplateClone.querySelector("#name").textContent = lastCurrentAppointment.name;
      mainTemplateClone.querySelector("#serviceAvailed").textContent = lastCurrentAppointment.service;
      appointmentCurrent.appendChild(mainTemplateClone);
    } else {
      const clone = document.importNode(noappointment.content, true);
      clone.querySelector("#prompt").textContent = "No current appointment";
      appointmentCurrent.appendChild(clone);
    }

    if (upcomingAppointments.length > 0) {
      for (let i = 0; i < 5 && i < upcomingAppointments.length; i++) {
        const mainTemplateClone = document.importNode(appointmentMain.content, true);
        mainTemplateClone.querySelector("#appointmentId").textContent = upcomingAppointments[i].id;
        mainTemplateClone.querySelector("#time").textContent = upcomingAppointments[i].startTime;
        mainTemplateClone.querySelector("#name").textContent = upcomingAppointments[i].name;
        mainTemplateClone.querySelector("#serviceAvailed").textContent = upcomingAppointments[i].service;
        appointmentUpcoming.appendChild(mainTemplateClone);
      }
    } else {
      const clone = document.importNode(noappointment.content, true);
      clone.querySelector("#prompt").textContent = "No upcoming appointment";
      appointmentUpcoming.appendChild(clone);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

function endAppointment(event)
{
//eto pang set mo ng status 
var name = event.target.closest(".appointment").querySelector("#name").textContent;
 Swal.fire({
  title: "Appointment finished?",
  text: name,
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








