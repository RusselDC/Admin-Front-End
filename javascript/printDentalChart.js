// Wait for the document to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get the #printDentalChart button element
  const printDentalChartButton = document.getElementById("printDentalChart");

  // Add a click event listener to the button
  printDentalChartButton.addEventListener("click", function () {
    // Get the .dentalChart element that you want to save as PDF
    const dentalChartElement = document.querySelector("#dental-condition");

    // Create an HTML2PDF instance
    const pdfOptions = {
      margin: 0,
      filename: "dental_chart.pdf",
      image: {type: "jpeg", quality: 1.0},
      html2canvas: {scale: 1, scrollY: 0},
      jsPDF: {unit: "px", format: [900, 1550], orientation: "portrait"},
    };

    const pdfDoc = new window.html2pdf()
      .from(dentalChartElement)
      .set(pdfOptions);

    // Save the PDF
    pdfDoc.save();
  });
});
