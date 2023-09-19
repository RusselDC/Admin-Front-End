// Wait for the document to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get the #generatePDF button element
  const generatePDFButton = document.getElementById("generatePDF");

  // Add a click event listener to the button
  generatePDFButton.addEventListener("click", function () {
    // Get the element with class "form-body" that you want to save as PDF
    const formBodyElement = document.querySelector(".form-body");

    // Create an HTML2PDF instance
    const pdfOptions = {
      margin: 10,
      filename: "patient_health_history.pdf",
      image: {type: "jpeg", quality: 0.98},
      html2canvas: {scale: 2},
      jsPDF: {unit: "px", format: [1325, 790], orientation: "landscape"},
    };

    const pdfDoc = new window.html2pdf().from(formBodyElement).set(pdfOptions);

    // Save the PDF
    pdfDoc.save();
  });
});
