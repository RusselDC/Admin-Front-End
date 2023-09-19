function onload() {
  listeners();
}
const formContainer = document.querySelector("#formContainer");
const addServicesForm = document.querySelector("#addServicesForm");
const editServicesForm = document.querySelector("#editServicesForm");

function listeners() {
  var search = document.querySelector("#search");
  //search on everytype
  search.addEventListener("input", function () {
    //your code
    console.log(this.value);
  });
  const containerBody = document.querySelector("#containerBody");
  const templateLoader = document.querySelector("#templateLoader");
  const nodatafound = document.querySelector("#no-data-found");
  const mainTemplate = document.querySelector("#mainTemplate");

  for (let i = 0; i < 9; i++) {
    const clone = document.importNode(templateLoader.content, true);
    containerBody.appendChild(clone);
  }
  fetch("https://run.mocky.io/v3/c8b2956e-24f2-4bc2-8a39-f3ff7229f4db")
    .then((response) => response.json())
    .then((data) => {
      containerBody.innerHTML = "";

      function filterData(data, searchTerm) {
        if (!searchTerm) {
          return data;
        }

        searchTerm = searchTerm.toLowerCase();
        return data.filter((obj) => {
          return (
            obj.serviceName.toLowerCase().includes(searchTerm) ||
            obj.serviceDescription.toLowerCase().includes(searchTerm) ||
            obj.id.toString().toLowerCase().includes(searchTerm)
          );
        });
      }
      function updateDisplay(searchTerm) {
        containerBody.innerHTML = "";
        const filteredData = filterData(data, searchTerm);
        if (Object.keys(filteredData).length === 0) {
          const clone = document.importNode(nodatafound.content, true);
          containerBody.appendChild(clone);
        }
        filteredData.forEach((obj) => {
          const clone = document.importNode(mainTemplate.content, true);
          clone.querySelector("#serviceName").innerHTML = highlightText(
            obj.serviceName,
            searchTerm
          );
          clone.querySelector("#serviceId").textContent = obj.id;
          var img = clone.querySelector("#imgHold");
          img.src = "../images/" + obj.imgSource;
          clone.querySelector("#serviceInfo").innerHTML = highlightText(
            obj.serviceDescription,
            searchTerm
          );
          containerBody.appendChild(clone);
        });
        function highlightText(text, searchTerm) {
          if (!searchTerm) {
            return `<span>${text}</span>`;
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
        const selectAction = document.querySelectorAll(".selectAction");
        selectAction.forEach((select) => {
          select.addEventListener("click", function () {
            var serviceOptions =
              this.closest(".service").querySelector("#serviceOptions");
            var list = select.classList;
            console.log(list);
            if (list.contains("fa-ellipsis-vertical")) {
              list.remove("fa-ellipsis-vertical");
              list.add("fa-xmark");
              serviceOptions.classList.remove("hidden");
            } else {
              list.remove("fa-xmark");
              list.add("fa-ellipsis-vertical");
              serviceOptions.classList.add("hidden");
            }
          });
        });
        // Edit Service
        var editService = document.querySelectorAll(".editService");
        editService.forEach((edit) => {
          edit.addEventListener("click", function () {
            formContainer.classList.remove("hidden");
            editServicesForm.classList.remove("hidden");
            const serviceId =
              this.closest(".service").querySelector("#serviceId").textContent;
            var serviceName =
              this.closest(".service").querySelector(
                "#serviceName"
              ).textContent;
            var imgHold =
              this.closest(".service").querySelector("#imgHold").src;
            var serviceInfo =
              this.closest(".service").querySelector(
                "#serviceInfo"
              ).textContent;

            var serviceNameEdit =
              editServicesForm.querySelector("#serviceNameEdit");
            var preview = editServicesForm.querySelector("#preview");
            var serviceDescriptionEdit = editServicesForm.querySelector(
              "#serviceDescriptionEdit"
            );

            serviceNameEdit.value = serviceName;
            serviceDescriptionEdit.value = serviceInfo;
            preview.src = imgHold;

            const checkboxesEdit =
              editServicesForm.querySelector("#checkboxesEdit");
            const templateCheckbox =
              document.querySelector("#templateCheckbox");
            const templateCheckboxLoader = document.querySelector(
              "#templateCheckboxLoader"
            );

            for (let i = 0; i < 15; i++) {
              const clone = document.importNode(
                templateCheckboxLoader.content,
                true
              );
              checkboxesEdit.appendChild(clone);
            }

            checkboxesEdit.innerHTML = "";
            createCheckboxes(data, serviceId, templateCheckbox);

            var sasveEdit = editServicesForm.querySelector("#saveEdit");
            sasveEdit.addEventListener("click", function () {
              var dropArea = editServicesForm.querySelector("#dropArea");
              var serviceDescriptionEdit = editServicesForm.querySelector(
                "#serviceDescriptionEdit"
              );
              var serviceNameEdit =
                editServicesForm.querySelector("#serviceNameEdit");

              if (serviceDescriptionEdit.value === "") {
                serviceDescriptionEdit.style.borderColor = "var(--red)";
                return;
              } else if (serviceDescriptionEdit.value !== "") {
                serviceDescriptionEdit.style.borderColor = "";
              }

              if (serviceNameEdit.value === "") {
                serviceNameEdit.style.borderColor = "var(--red)";
                return;
              } else if (serviceNameEdit.value !== "") {
                serviceNameEdit.style.borderColor = "";
              } else {
                dropArea.style.borderColor = "";
                serviceDescriptionEdit.style.borderColor = "";
                serviceNameEdit.style.borderColor = "";

                dropArea.value = "";
                serviceDescriptionEdit.value = "";
                serviceNameEdit.value = "";
              }

              Swal.fire({
                title: "Save this Service?",
                text: "You won't be able to revert this.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#73E977",
                cancelButtonColor: "#fa6363",
                confirmButtonText: "Confirm",
              }).then((result) => {
                if (result.isConfirmed) {
                  editServicesForm.classList.add("hidden");
                  Swal.fire({
                    title: "Service Added",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                  }).then(() => {
                    editServicesForm.submit();
                    formContainer.classList.add("hidden");
                  });
                }
              });
            });

            var cancelEdit = editServicesForm.querySelector("#cancelEdit");
            cancelEdit.addEventListener("click", function () {
              formContainer.classList.add("hidden");
              editServicesForm.classList.add("hidden");

              var serviceDescriptionEdit = editServicesForm.querySelector(
                "#serviceDescriptionEdit"
              );
              var serviceNameEdit =
                editServicesForm.querySelector("#serviceNameEdit");
              var dropArea = editServicesForm.querySelector("#dropArea");

              serviceDescriptionEdit.value = "";
              serviceNameEdit.value = "";

              dropArea.style.borderColor = "";
              serviceDescriptionEdit.style.borderColor = "";
              serviceNameEdit.style.borderColor = "";
            });
          });
        });
        // Delete Service
        var deleteService = document.querySelectorAll(".deleteService");
        deleteService.forEach((del) => {
          del.addEventListener("click", function () {
            var serviceName =
              this.closest(".service").querySelector(
                "#serviceName"
              ).textContent;

            Swal.fire({
              title: "Delete " + serviceName + "?",
              text: "You won't be able to revert this.",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#73E977",
              cancelButtonColor: "#fa6363",
              confirmButtonText: "Confirm",
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire({
                  title: "Service Deleted",
                  icon: "success",
                  timer: 1500,
                  showConfirmButton: false,
                });
              }
            });
          });
        });
        // unAvailable Service
        var unavailableService = document.querySelectorAll(
          ".unavailableService"
        );
        unavailableService.forEach((unavailable) => {
          unavailable.addEventListener("click", function () {
            var serviceName =
              this.closest(".service").querySelector(
                "#serviceName"
              ).textContent;
            Swal.fire({
              title: "Make " + serviceName + " Unavailable?",
              text: "You won't be able to revert this.",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#73E977",
              cancelButtonColor: "#fa6363",
              confirmButtonText: "Confirm",
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire({
                  title: "Service Unavailable",
                  icon: "success",
                  timer: 1500,
                  showConfirmButton: false,
                });
              }
            });
          });
        });
      }
      updateDisplay("");
      var search = document.querySelector("#search");
      // Search on every type
      search.addEventListener("input", function () {
        updateDisplay(this.value);
      });
    });
}

function previewImage(event) {
  var fileInput = event.target;
  var file = fileInput.files[0];

  if (file) {
    var reader = new FileReader();

    reader.onload = function (e) {
      var previewImage = document.getElementById("preview");
      previewImage.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }
}

function previewImage(event) {
  var fileInput = event.target;
  var file = fileInput.files[0];

  if (file) {
    if (validateFileType(file) && validateFileSize(file)) {
      var reader = new FileReader();

      reader.onload = function (e) {
        var previewImage = document.getElementById("preview");
        previewImage.src = e.target.result;
      };

      reader.readAsDataURL(file);
    } else {
      Swal.fire({
        text: "Select a JPEG, JPG, or PNG file under 5MB.",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  }
}

function handleDrop(event) {
  event.preventDefault();
  event.stopPropagation();

  var file = event.dataTransfer.files[0];
  if (validateFileType(file) && validateFileSize(file)) {
    previewFile(file);
  } else {
    Swal.fire({
      text: "Drop a JPEG, JPG, or PNG file under 5MB.",
      icon: "warning",
      timer: 2000,
      showConfirmButton: false,
    });
  }
}

function handleDragOver(event) {
  event.preventDefault();
  event.stopPropagation();
}

function previewFile(file) {
  var reader = new FileReader();

  reader.onload = function (e) {
    var previewImage = document.getElementById("preview");
    previewImage.src = e.target.result;
  };

  reader.readAsDataURL(file);
}

function validateFileType(file) {
  var allowedExtensions = /(\.jpeg|\.jpg|\.png)$/i;
  return allowedExtensions.exec(file.name);
}

function validateFileSize(file) {
  var maxSizeInBytes = 5 * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

function truncateText(element, limit) {
  var text = element.textContent;
  if (text.length > limit) {
    var truncated = text.substring(0, limit) + "...";
    element.textContent = truncated;
  }
}

function createCheckboxes(data, serviceId, templateCheckbox) {
  let subServiceValue = [];
  data.forEach((obj) => {
    if (obj.id == serviceId) {
      const subServices = obj.subServices;
      if (subServices) {
        subServiceValue = [...subServices];
        console.log(subServiceValue);
      }
      return;
    }
  });

  checkboxesEdit.innerHTML = "";

  data.forEach((obj) => {
    if (obj.id == serviceId) {
      return;
    }

    const clone = document.importNode(templateCheckbox.content, true);

    const label = clone.querySelector(".checkboxLabel");
    clone.querySelector("#serviceOriginalName").textContent = obj.serviceName;
    clone.querySelector("#serviceIdCheckBox").textContent = obj.id;
    label.querySelector("#serviceName").textContent = obj.serviceName;
    truncateText(clone.querySelector("#serviceName"), 15);
    label.setAttribute("for", obj.id);

    const input = clone.querySelector('input[type="checkbox"]');
    input.value = obj.id;
    input.id = obj.id;
    input.name = obj.serviceName.toLowerCase().replace(" ", "-");
    const isSubServiceChecked = subServiceValue.includes(obj.id);
    input.checked = isSubServiceChecked;

    checkboxesEdit.appendChild(clone);
  });
}
