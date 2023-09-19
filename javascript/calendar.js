const monthToday = document.querySelector("#monthToday");
const days = document.querySelector(".days");
const calendarNav = document.querySelectorAll(".calendarNav i");

const search = document.querySelector("#search");

let date = new Date();
let currentYear = date.getFullYear();
let currentMonth = date.getMonth();
let firstDaysOfMonth;

const month = [
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

const renderCalendar = () => {
  firstDaysOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  let lastDaysOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  let firstDaysOfNextMonth = new Date(
    currentYear,
    currentMonth,
    lastDaysOfMonth
  ).getDay();
  let lastDaysOfLastMonth = new Date(currentYear, currentMonth, 0).getDate();
  let liTag = "";

  for (let i = firstDaysOfMonth; i > 0; i--) {
    liTag += `<li class="inactiveDay">${lastDaysOfLastMonth - i + 1}</li>`;
  }

  for (let i = 1; i <= lastDaysOfMonth; i++) {
    let today =
      i === date.getDate() &&
      currentMonth === new Date().getMonth() &&
      currentYear === new Date().getFullYear()
        ? "dateToday"
        : "";
    liTag += `<li class="${today}" onclick="toggleDateToday(this)">${i}</li>`;
  }

  for (let i = firstDaysOfNextMonth; i < 6; i++) {
    liTag += `<li class="inactiveDay">${i - firstDaysOfNextMonth + 1}</li>`;
  }

  monthToday.innerText = `${month[currentMonth]} ${currentYear}`;
  days.innerHTML = liTag;

  addClassesToDates();
};

function toggleDateToday(element) {
  const liElements = days.querySelectorAll("li");

  liElements.forEach((li) => {
    li.classList.remove("selectedCalendar");
  });

  element.classList.toggle("selectedCalendar");
  calendarContainer.classList.remove("showElement");

  const selectedDate = new Date(
    currentYear,
    currentMonth,
    parseInt(element.textContent)
  );
  const selectedYear = selectedDate.getFullYear();
  const selectedMonth = selectedDate.getMonth() + 1; // Months are zero-indexed
  const selectedDay = selectedDate.getDate();

  search.value = `${selectedYear}-${selectedMonth}-${selectedDay}`;
}

async function fetchDatesFromDatabase() {
  // Simulate fetching dates from the database
  return new Promise((resolve, reject) => {
    // Replace this with your actual code to fetch dates from the database
    setTimeout(() => {
      resolve([
        { date: "2023-07-10", className: "pendingCalendar" },
        { date: "2023-07-15", className: "acceptedCalendar" },
        { date: "2023-07-15", className: "pendingCalendar" },
        { date: "2023-07-15", className: "pendingCalendar" },
        { date: "2023-08-15", className: "acceptedCalendar" },
        { date: "2023-08-15", className: "pendingCalendar" },
        { date: "2023-08-20", className: "acceptedCalendar" },
      ]);
    }, 10);
  });
}

async function addClassesToDates() {
  try {
    const dates = await fetchDatesFromDatabase();

    const liElements = days.querySelectorAll("li");

    dates.forEach((item) => {
      const dateParts = item.date.split("-");
      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1;
      const day = parseInt(dateParts[2], 10);

      if (year === currentYear && month === currentMonth) {
        const liIndex = day + firstDaysOfMonth - 1;
        if (liIndex >= 0 && liIndex < liElements.length) {
          liElements[liIndex].classList.add(item.className);
        }
      }
    });
  } catch (error) {
    console.error("Error fetching dates:", error);
  }
}

renderCalendar();

calendarNav.forEach((icon) => {
  icon.addEventListener("click", () => {
    const id = icon.id;
    currentMonth = id === "nextMonth" ? currentMonth + 1 : currentMonth - 1;

    if (currentMonth < 0 || currentMonth > 11) {
      date = new Date(currentYear, currentMonth);
      currentYear = date.getFullYear();
      currentMonth = date.getMonth();
    } else {
      date = new Date();
    }
    renderCalendar();
  });
});
