function changeColor(question) {
  const yesElement = document.getElementById(`${question}Yes`);
  const noElement = document.getElementById(`${question}No`);

  if (document.getElementsByName(question)[0].checked) {
    yesElement.style.color = "#7264f4";
    noElement.style.color = "black";
  } else if (document.getElementsByName(question)[1].checked) {
    noElement.style.color = "#f48164";
    yesElement.style.color = "black";
  }
}
