let currentPage = 1;
const pageSize = 5;

function displayTableRows() {
  const tableBody = document.getElementById("tableBody");
  const rows = tableBody.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    if (i >= (currentPage - 1) * pageSize && i < currentPage * pageSize) {
      rows[i].style.display = "table";
    } else {
      rows[i].style.display = "none";
    }
  }
  document.getElementById(
    "page-count"
  ).textContent = `Page ${currentPage} of ${Math.ceil(rows.length / pageSize)}`;
}

document.getElementById("next-page").addEventListener("click", () => {
  const rows = document.getElementById("tableBody").getElementsByTagName("tr");
  if (currentPage < Math.ceil(rows.length / pageSize)) {
    currentPage++;
    displayTableRows();
  }
});

document.getElementById("prev-page").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayTableRows();
  }
});

displayTableRows();
