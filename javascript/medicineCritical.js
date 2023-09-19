function onload() {
  listeners();
}

function listeners() {
  // loader
  const containerBody = document.querySelector("#containerBody");
  const medicineTypeTemplate = document.querySelector("#medicineTypeTemplate");
  const medicineOnlyTemplate = document.querySelector("#medicineOnlyTemplate");
  const nodatafound = document.querySelector("#no-data-found");
  const templateMedicineType = document.querySelector("#templateMedicineType");
  const medsInfo = document.querySelector("#medsInfo");

  for (let i = 0; i < 20; i++) {
    const clone = document.importNode(templateMedicineType.content, true);
    containerBody.appendChild(clone);
  }
  fetch("https://run.mocky.io/v3/a5d2635c-5ccb-49c0-b572-abae2fb795df")
    .then((response) => response.json())
    .then((data) => {
      updateDisplay("", data);
      var search = document.querySelector("#search");
      search.addEventListener("input", function () {
        updateDisplay(this.value, data);
      });
    });
  function filterData(data, searchTerm) {
    searchTerm = searchTerm ? searchTerm.toLowerCase() : "";
    const filteredData = {};
    for (const category in data) {
      if (data.hasOwnProperty(category)) {
        const subCategories = data[category];
        const filteredSubCategories = {};
        for (const subCategory in subCategories) {
          if (subCategories.hasOwnProperty(subCategory)) {
            const medicines = subCategories[subCategory];
            const filteredMedicines = medicines.filter((medicine) => {
              return (
                medicine.medicineName.toLowerCase().includes(searchTerm) ||
                medicine.medicineBrand.toLowerCase().includes(searchTerm) ||
                medicine.medicineType.toLowerCase().includes(searchTerm) ||
                medicine.medicineCount.toString().includes(searchTerm) ||
                medicine.medicineId
                  .toString()
                  .toLowerCase()
                  .includes(searchTerm) ||
                medicine.expirationDate.toLowerCase().includes(searchTerm)
              );
            });
            if (filteredMedicines.length > 0) {
              filteredSubCategories[subCategory] = filteredMedicines;
            }
          }
        }

        // Include the entire category if the search term matches its name
        const categoryLC = category.toLowerCase();
        if (
          categoryLC.includes(searchTerm) &&
          Object.keys(filteredSubCategories).length === 0
        ) {
          filteredData[category] = subCategories;
        } else if (Object.keys(filteredSubCategories).length > 0) {
          filteredData[category] = filteredSubCategories;
        }
      }
    }

    return filteredData;
  }
  function updateDisplay(searchTerm, data) {
    console.log(searchTerm);
    const containerBody = document.querySelector("#containerBody");
    containerBody.innerHTML = "";
    const filteredData = filterData(data, searchTerm);
    if (Object.keys(filteredData).length === 0) {
      const clone = document.importNode(nodatafound.content, true);
      containerBody.appendChild(clone);
    }
    for (var category in filteredData) {
      if (filteredData.hasOwnProperty(category)) {
        const clonemedicineTypeTemplate = document.importNode(
          medicineTypeTemplate.content,
          true
        );
        clonemedicineTypeTemplate.querySelector("#medicineType").innerHTML =
          highlightText(category, searchTerm);
        const medicineContainer =
          clonemedicineTypeTemplate.querySelector("#medicineContainer");
        containerBody.appendChild(clonemedicineTypeTemplate);
        var subCategories = filteredData[category];
        let showCategory = false;

        for (var subCategory in subCategories) {
          if (subCategories.hasOwnProperty(subCategory)) {
            const clonemedicineOnlyTemplate = document.importNode(
              medicineOnlyTemplate.content,
              true
            );
            clonemedicineOnlyTemplate.querySelector("#medicineName").innerHTML =
              highlightText(subCategory, searchTerm);
            const medicineCountAndExpiration =
              clonemedicineOnlyTemplate.querySelector(
                "#medicineCountAndExpiration"
              );
            medicineContainer.appendChild(clonemedicineOnlyTemplate);
            var medicines = subCategories[subCategory];
            let showSubCategory = false;

            for (var i = 0; i < medicines.length; i++) {
              const clonemedsInfo = document.importNode(medsInfo.content, true);
              var medicine = medicines[i];
              const medicineType = medicine.medicineType;
              const medicineBrand = medicine.medicineBrand;
              const medicineId = medicine.medicineId;
              const medicineTotal = medicine.medicineCount;
              const lowStockValue = medicine.lowStockValue;
              const medicineDosage = medicine.medicineDosage;
              const mgMlType = medicine.mgOrml;
              const description = medicine.description;
              const medicineManufacturedDate = medicine.manufacturedDate;
              const medicineExpirationDate = medicine.expirationDate;

              clonemedsInfo.querySelector("#medicineTypes").innerHTML =
                highlightText(medicineType, searchTerm);
              clonemedsInfo.querySelector("#medicineBrand").innerHTML =
                highlightText(medicineBrand, searchTerm);
              clonemedsInfo.querySelector(
                "#medicineBrandOriginal"
              ).textContent = medicineBrand;
              truncateText(clonemedsInfo.querySelector("#medicineBrand"), 15);
              clonemedsInfo.querySelector("#medicineID").innerHTML =
                highlightText(medicineId, searchTerm);
              clonemedsInfo.querySelector("#medicineIDOriginal").textContent =
                medicineId;
              truncateText(clonemedsInfo.querySelector("#medicineID"), 15);
              clonemedsInfo.querySelector("#medicineTotal").innerHTML =
                highlightText(medicineTotal.toString(), searchTerm);
              clonemedsInfo.querySelector("#lowStockValue").textContent =
                lowStockValue;
              clonemedsInfo.querySelector("#medicineDosage").innerHTML =
                highlightText(medicineDosage.toString(), searchTerm);
              clonemedsInfo.querySelector("#mgML").innerHTML = highlightText(
                mgMlType,
                searchTerm
              );
              clonemedsInfo.querySelector("#medicineDescription").innerHTML =
                highlightText(description, searchTerm);
              clonemedsInfo.querySelector("#manufacturedDate").innerHTML =
                highlightText(medicineManufacturedDate, searchTerm);
              clonemedsInfo.querySelector("#medicineExpirationDate").innerHTML =
                highlightText(medicineExpirationDate, searchTerm);

              medicineCountAndExpiration.appendChild(clonemedsInfo);
              if (
                !showSubCategory &&
                (medicine.medicineName.toLowerCase().includes(searchTerm) ||
                  medicine.medicineBrand.toLowerCase().includes(searchTerm) ||
                  medicine.medicineType.toLowerCase().includes(searchTerm) ||
                  medicine.medicineCount.toString().includes(searchTerm) ||
                  medicine.medicineId
                    .toString()
                    .toLowerCase()
                    .includes(searchTerm) ||
                  medicine.expirationDate.toLowerCase().includes(searchTerm))
              ) {
                medicineCountAndExpiration.classList.add("showMedicines");
              }
            }
            if (!showSubCategory && searchTerm !== "") {
              medicineContainer.classList.add("showMedicines");
              medicineCountAndExpiration.classList.add("showMedicines");
              showSubCategory = false;
            } else {
              medicineCountAndExpiration.classList.remove("showMedicines");
              medicineContainer.classList.remove("showMedicines");
              showSubCategory = true;
            }
          }
        }
        if (!showCategory && searchTerm !== "") {
          medicineContainer.classList.add("showMedicines");
          showCategory = false;
        } else {
          medicineContainer.classList.remove("showMedicines");
          showCategory = true;
        }
      }
    }
    //edit Medicine Form
    var editMedicineForm = document.querySelector("#editMedicineForm");
    var editMedicine = document.querySelectorAll(".editMedicine");

    editMedicine.forEach((edit) => {
      edit.addEventListener("click", function () {
        var medicineClassification =
          this.closest(".accordion").querySelector("#medicineType").innerText;
        var medicineName =
          this.closest(".medicines").querySelector("#medicineName").innerText;
        var medicineType = this.closest(".medicineInformations").querySelector(
          "#medicineTypes"
        ).innerText;
        var medicineID = this.closest(".medicineInformations").querySelector(
          "#medicineIDOriginal"
        ).innerText;
        var medicineBrand = this.closest(".medicineInformations").querySelector(
          "#medicineBrandOriginal"
        ).innerText;
        var lowStockValue = this.closest(".medicineInformations").querySelector(
          "#lowStockValue"
        ).innerText;
        var medicineDosage = this.closest(
          ".medicineInformations"
        ).querySelector("#medicineDosage").innerText;
        var mgML = this.closest(".medicineInformations").querySelector(
          "#mgML"
        ).innerText;
        var medicineDescription = this.closest(
          ".medicineInformations"
        ).querySelector("#medicineDescription").innerText;
        var manufacturedDate = this.closest(
          ".medicineInformations"
        ).querySelector("#manufacturedDate").innerText;
        var medicineExpirationDate = this.closest(
          ".medicineInformations"
        ).querySelector("#medicineExpirationDate").innerText;

        editMedicineForm.querySelector("#medicineClassificationEdit").value =
          medicineClassification;
        editMedicineForm.querySelector("#medicineNameEdit").value =
          medicineName;
        editMedicineForm.querySelector("#medicineIDEdit").value = medicineID;
        editMedicineForm.querySelector("#medicineBrandNameEdit").value =
          medicineBrand;
        editMedicineForm.querySelector("#dosageTypeEdit").innerText = mgML;
        editMedicineForm.querySelector("#medicineDosageEdit").value =
          medicineDosage;
        editMedicineForm.querySelector("#medicineTypeNameEdit").innerText =
          medicineType;
        editMedicineForm.querySelector("#medicineLowStockEdit").value =
          lowStockValue;
        editMedicineForm.querySelector("#medicineDescriptionEdit").value =
          medicineDescription;
        editMedicineForm.querySelector("#medicineManufacturedDateEdit").value =
          manufacturedDate;
        editMedicineForm.querySelector("#expirationDateEdit").value =
          medicineExpirationDate;

        editMedicineForm.classList.add("showElement1");
        var cancelButton = editMedicineForm.querySelector(
          "#editMedicineFormCancel"
        );
        cancelButton.addEventListener("click", function () {
          editMedicineForm.classList.remove("showElement1");
        });

        //submit restock Form
        var editMedicineFormSubmit = editMedicineForm.querySelector(
          "#editMedicineFormSubmit"
        );
        editMedicineFormSubmit.addEventListener("click", function () {
          var editMedicineFormContainer = editMedicineForm.querySelector(
            "#editMedicineFormContainer"
          );

          var medicineClassificationEdit = editMedicineForm.querySelector(
            "#medicineClassificationEdit"
          );
          var medicineNameAdd =
            editMedicineForm.querySelector("#medicineNameEdit");
          var medicineIDEdit =
            editMedicineForm.querySelector("#medicineIDEdit");
          var medicineBrandName = editMedicineForm.querySelector(
            "#medicineBrandNameEdit"
          );
          var medicineDosage =
            editMedicineForm.querySelector("#dosageValueEdit");
          var dosageValue = editMedicineForm.querySelector(
            "#medicineDosageEdit"
          );
          var medicineTypeValue = editMedicineForm.querySelector(
            "#medicineTypeValueEdit"
          );
          var medicineStock =
            editMedicineForm.querySelector("#medicineStockEdit");
          var medicineLowStock = editMedicineForm.querySelector(
            "#medicineLowStockEdit"
          );
          var medicineDescription = editMedicineForm.querySelector(
            "#medicineDescriptionEdit"
          );
          var medicineManufacturedDate = editMedicineForm.querySelector(
            "#medicineManufacturedDateEdit"
          );
          var expirationDate = editMedicineForm.querySelector(
            "#expirationDateEdit"
          );

          medicineClassificationEdit.addEventListener(
            "input",
            removeBorderColor
          );
          medicineNameAdd.addEventListener("input", removeBorderColor);
          medicineIDEdit.addEventListener("input", removeBorderColor);
          medicineBrandName.addEventListener("input", removeBorderColor);
          medicineDosage.addEventListener("input", removeBorderColor);
          medicineStock.addEventListener("input", removeBorderColor);
          medicineLowStock.addEventListener("input", removeBorderColor);
          medicineDescription.addEventListener("input", removeBorderColor);
          medicineManufacturedDate.addEventListener("input", removeBorderColor);
          expirationDate.addEventListener("input", removeBorderColor);

          var classification = medicineClassificationEdit.value.trim();
          var name = medicineNameAdd.value.trim();
          var id = medicineIDEdit.value.trim();
          var brand = medicineBrandName.value.trim();
          var dosage = dosageValue.value.trim();
          var dosageType = medicineDosage.value.trim();
          var meidicineType = medicineTypeValue.value.trim();
          var stock = medicineStock.value.trim();
          var lowStock = medicineLowStock.value.trim();
          var description = medicineDescription.value.trim();
          var manufacturedDate = medicineManufacturedDate.value.trim();
          var expiration = expirationDate.value.trim();

          if (classification === "") {
            medicineClassificationEdit.style.borderColor = "var(--red)";
          } else if (name === "") {
            medicineNameAdd.style.borderColor = "var(--red)";
          } else if (id === "") {
            medicineIDEdit.style.borderColor = "var(--red)";
          } else if (brand === "") {
            medicineBrandName.style.borderColor = "var(--red)";
          } else if (Number(dosage) <= 0) {
            medicineDosage.style.borderColor = "var(--red)";
          } else if (Number(stock) <= 0) {
            medicineStock.style.borderColor = "var(--red)";
          } else if (Number(lowStock) <= 0) {
            medicineLowStock.style.borderColor = "var(--red)";
          } else if (description === "") {
            medicineDescription.style.borderColor = "var(--red)";
          } else if (manufacturedDate <= 0) {
            medicineManufacturedDate.style.borderColor = "var(--red)";
          } else if (expiration <= 0) {
            expirationDate.style.borderColor = "var(--red)";
          } else {
            medicineClassificationEdit.value = "";
            medicineNameAdd.value = "";
            medicineIDEdit.value = "";
            medicineBrandName.value = "";
            medicineDosage.value = "";
            medicineStock.value = "";
            medicineLowStock.value = "";
            medicineDescription.value = "";
            medicineManufacturedDate.value = "";
            expirationDate.value = "";

            medicineClassificationEdit.style.borderColor = "";
            medicineNameAdd.style.borderColor = "";
            medicineIDEdit.style.borderColor = "";
            medicineBrandName.style.borderColor = "";
            medicineDosage.style.borderColor = "";
            medicineStock.style.borderColor = "";
            medicineLowStock.style.borderColor = "";
            medicineDescription.style.borderColor = "";
            medicineManufacturedDate.style.borderColor = "";
            expirationDate.style.borderColor = "";

            Swal.fire({
              title: "Medicine Edited",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            }).then(() => {
              editMedicineForm.classList.remove("showElement1");
              //submitForm
              editMedicineFormContainer.submit();
            });

            console.log(
              classification,
              name,
              id,
              brand,
              dosage,
              dosageType,
              meidicineType,
              stock,
              lowStock,
              description,
              manufacturedDate,
              expiration
            );
          }
        });
      });
    });

    //view Medicine Form
    var viewMedicineForm = document.querySelector("#viewMedicineForm");
    var viewMedicine = document.querySelectorAll(".viewMedicine");

    viewMedicine.forEach((edit) => {
      edit.addEventListener("click", function () {
        var medicineClassification =
          this.closest(".accordion").querySelector("#medicineType").innerText;
        var medicineName =
          this.closest(".medicines").querySelector("#medicineName").innerText;
        var medicineType = this.closest(".medicineInformations").querySelector(
          "#medicineTypes"
        ).innerText;
        var medicineID = this.closest(".medicineInformations").querySelector(
          "#medicineIDOriginal"
        ).innerText;
        var medicineBrand = this.closest(".medicineInformations").querySelector(
          "#medicineBrandOriginal"
        ).innerText;
        var medicineTotal = this.closest(".medicineInformations").querySelector(
          "#medicineTotal"
        ).innerText;
        var lowStockValue = this.closest(".medicineInformations").querySelector(
          "#lowStockValue"
        ).innerText;
        var medicineDosage = this.closest(
          ".medicineInformations"
        ).querySelector("#medicineDosage").innerText;
        var mgML = this.closest(".medicineInformations").querySelector(
          "#mgML"
        ).innerText;
        var medicineDescription = this.closest(
          ".medicineInformations"
        ).querySelector("#medicineDescription").innerText;
        var manufacturedDate = this.closest(
          ".medicineInformations"
        ).querySelector("#manufacturedDate").innerText;
        var medicineExpirationDate = this.closest(
          ".medicineInformations"
        ).querySelector("#medicineExpirationDate").innerText;

        viewMedicineForm.querySelector(
          "#medicineClassificationPrescribe"
        ).value = medicineClassification;
        viewMedicineForm.querySelector("#medicineNameView").value =
          medicineName;
        viewMedicineForm.querySelector("#medicineIDView").value = medicineID;
        viewMedicineForm.querySelector("#medicineBrandNameView").value =
          medicineBrand;
        viewMedicineForm.querySelector("#dosageTypeView").innerText = mgML;
        viewMedicineForm.querySelector("#medicineDosageView").value =
          medicineDosage;
        viewMedicineForm.querySelector("#medicineTypeNameView").innerText =
          medicineType;
        viewMedicineForm.querySelector("#medicineStockView").value =
          medicineTotal;
        viewMedicineForm.querySelector("#medicineLowStockView").value =
          lowStockValue;
        viewMedicineForm.querySelector("#medicineDescriptionView").value =
          medicineDescription;
        viewMedicineForm.querySelector("#medicineManufacturedDateView").value =
          manufacturedDate;
        viewMedicineForm.querySelector("#expirationDateView").value =
          medicineExpirationDate;
        console.log(medicineName);
        viewMedicineForm.classList.add("showElement1");

        var cancelButton = viewMedicineForm.querySelector(
          "#viewMedicineFormCancel"
        );
        cancelButton.addEventListener("click", function () {
          viewMedicineForm.classList.remove("showElement1");
        });
      });
    });

    var accordion = document.querySelectorAll(".accordion");
    var medicines = document.querySelectorAll(".medicines");
    accordion.forEach((meds) => {
      var accordionHeader = meds.querySelector(".accordionHeader");

      accordionHeader.addEventListener("click", function () {
        var accordionBody = meds
          .closest("div")
          .querySelector(".medicineContainer");
        accordionBody.classList.toggle("showMedicines");
        var openMedicines = meds.querySelector(".openMedicines");

        if (accordionBody.classList.contains("showMedicines")) {
          openMedicines.style.transform = "rotate(180deg)";
        } else {
          openMedicines.style.transform = "";
        }
      });
    });
    medicines.forEach((meds) => {
      var medicinesHeader = meds.querySelector(".medicineName");

      medicinesHeader.addEventListener("click", function () {
        var medicineCountAndExpiration = meds
          .closest("div")
          .querySelector(".medicineCountAndExpiration");
        medicineCountAndExpiration.classList.toggle("showMedicines");
        var openDescriptions = meds.querySelector(".openDescriptions");

        if (medicineCountAndExpiration.classList.contains("showMedicines")) {
          openDescriptions.style.transform = "rotate(180deg)";
        } else {
          openDescriptions.style.transform = "";
        }
      });
    });
  }
  function highlightText(text, searchTerm) {
    if (!searchTerm) {
      return text;
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

  //add Medicine button
  var addMedicine = document.querySelector("#addMedicine");
  var addMedicineForm = document.querySelector("#addMedicineForm");

  addMedicine.addEventListener("click", function () {
    addMedicineForm.classList.add("showElement1");

    var sortCarretDosage = addMedicineForm.querySelector("#sortCarretDosage");
    var dosageOptions = addMedicineForm.querySelector("#dosageOptions");
    var dosageType = addMedicineForm.querySelector("#dosageType");
    var medicineTypeName = addMedicineForm.querySelector("#medicineTypeName");

    var medicineTypeHolder = addMedicineForm.querySelector(
      "#medicineTypeHolder"
    );

    sortCarretDosage.addEventListener("click", function () {
      var dosageOptionsType = addMedicineForm.querySelectorAll(
        ".dosageOptions span"
      );
      dosageOptions.classList.toggle("showElement");
      var sortCarretDosageTypeCaret = addMedicineForm.querySelectorAll(
        ".sortCarretDosageTypeCaret"
      );

      sortCarretDosageTypeCaret.forEach((icon) => {
        const currentTransform = icon.style.transform;
        if (currentTransform === "") {
          icon.style.transform = "rotate(180deg)";
        } else {
          icon.style.transform = "";
        }
      });

      dosageOptionsType.forEach((element) => {
        element.addEventListener("click", function () {
          var mgMl = this.textContent;
          dosageType.textContent = mgMl;
          var dosageValue = addMedicineForm.querySelector("#dosageValue");
          dosageValue.value = mgMl;

          dosageOptions.classList.remove("showElement");

          sortCarretDosageTypeCaret.forEach((icon) => {
            const currentTransform = icon.style.transform;
            if (currentTransform === "") {
              icon.style.transform = "rotate(180deg)";
            } else {
              icon.style.transform = "";
            }
          });
        });
      });
    });

    medicineTypeHolder.addEventListener("click", function () {
      var opt = addMedicineForm.querySelectorAll(".medicineTypeOptions span");
      var medicineTypeOptions = addMedicineForm.querySelector(
        "#medicineTypeOptions"
      );
      medicineTypeOptions.classList.toggle("showElement");
      var sortCarretTypeCaret = document.querySelectorAll(
        ".sortCarretTypeCaret"
      );

      sortCarretTypeCaret.forEach((icon) => {
        const currentTransform = icon.style.transform;
        if (currentTransform === "") {
          icon.style.transform = "rotate(180deg)";
        } else {
          icon.style.transform = "";
        }
      });

      opt.forEach((element) => {
        element.addEventListener("click", function () {
          var mgMl = this.textContent;
          medicineTypeName.textContent = mgMl;
          medicineTypeOptions.classList.remove("showElement");
          var medicineTypeValue =
            addMedicineForm.querySelector("#medicineTypeValue");
          medicineTypeValue.value = mgMl;
          console.log(medicineTypeValue.value);
          sortCarretTypeCaret.forEach((icon) => {
            const currentTransform = icon.style.transform;
            if (currentTransform === "") {
              icon.style.transform = "rotate(180deg)";
            } else {
              icon.style.transform = "";
            }
          });
        });
      });
    });

    var cancelButton = addMedicineForm.querySelector("#addMedicineFormCancel");
    cancelButton.addEventListener("click", function () {
      addMedicineForm.classList.remove("showElement1");
    });

    //submit addMedicineForm
    var addMedicineFormFormSubmit = addMedicineForm.querySelector(
      "#addMedicineFormFormSubmit"
    );
    addMedicineFormFormSubmit.addEventListener("click", function () {
      var addMedicineFormContainer = addMedicineForm.querySelector(
        "#addMedicineFormContainer"
      );

      var medicineClassification = addMedicineForm.querySelector(
        "#medicineClassification"
      );
      var medicineNameAdd = addMedicineForm.querySelector("#medicineNameAdd");
      var medicineIDAdd = addMedicineForm.querySelector("#medicineIDAdd");
      var medicineBrandName =
        addMedicineForm.querySelector("#medicineBrandName");
      var dosageValue = addMedicineForm.querySelector("#dosageValue");
      var medicineDosage = addMedicineForm.querySelector("#medicineDosage");
      var medicineTypeValue =
        addMedicineForm.querySelector("#medicineTypeValue");
      var medicineStock = addMedicineForm.querySelector("#medicineStock");
      var medicineLowStock = addMedicineForm.querySelector("#medicineLowStock");
      var medicineDescription = addMedicineForm.querySelector(
        "#medicineDescription"
      );
      var medicineManufacturedDate = addMedicineForm.querySelector(
        "#medicineManufacturedDate"
      );
      var expirationDate = addMedicineForm.querySelector("#expirationDate");

      medicineClassification.addEventListener("input", removeBorderColor);
      medicineNameAdd.addEventListener("input", removeBorderColor);
      medicineIDAdd.addEventListener("input", removeBorderColor);
      medicineBrandName.addEventListener("input", removeBorderColor);
      medicineDosage.addEventListener("input", removeBorderColor);
      medicineStock.addEventListener("input", removeBorderColor);
      medicineLowStock.addEventListener("input", removeBorderColor);
      medicineDescription.addEventListener("input", removeBorderColor);
      medicineManufacturedDate.addEventListener("input", removeBorderColor);
      expirationDate.addEventListener("input", removeBorderColor);

      var classification = medicineClassification.value.trim();
      var name = medicineNameAdd.value.trim();
      var id = medicineIDAdd.value.trim();
      var brand = medicineBrandName.value.trim();
      var dosage = dosageValue.value.trim();
      var dosageType = medicineDosage.value.trim();
      var meidicineType = medicineTypeValue.value.trim();
      var stock = medicineStock.value.trim();
      var lowStock = medicineLowStock.value.trim();
      var description = medicineDescription.value.trim();
      var manufacturedDate = medicineManufacturedDate.value.trim();
      var expiration = expirationDate.value.trim();

      if (classification === "") {
        medicineClassification.style.borderColor = "var(--red)";
      } else if (name === "") {
        medicineNameAdd.style.borderColor = "var(--red)";
      } else if (id === "") {
        medicineIDAdd.style.borderColor = "var(--red)";
      } else if (brand === "") {
        medicineBrandName.style.borderColor = "var(--red)";
      } else if (Number(dosage) <= 0) {
        medicineDosage.style.borderColor = "var(--red)";
      } else if (Number(stock) <= 0) {
        medicineStock.style.borderColor = "var(--red)";
      } else if (Number(lowStock) <= 0) {
        medicineLowStock.style.borderColor = "var(--red)";
      } else if (description === "") {
        medicineDescription.style.borderColor = "var(--red)";
      } else if (manufacturedDate <= 0) {
        medicineManufacturedDate.style.borderColor = "var(--red)";
      } else if (expiration <= 0) {
        expirationDate.style.borderColor = "var(--red)";
      } else {
        medicineClassification.value = "";
        medicineNameAdd.value = "";
        medicineIDAdd.value = "";
        medicineBrandName.value = "";
        medicineDosage.value = "";
        medicineStock.value = "";
        medicineLowStock.value = "";
        medicineDescription.value = "";
        medicineManufacturedDate.value = "";
        expirationDate.value = "";

        medicineClassification.style.borderColor = "";
        medicineNameAdd.style.borderColor = "";
        medicineIDAdd.style.borderColor = "";
        medicineBrandName.style.borderColor = "";
        medicineDosage.style.borderColor = "";
        medicineStock.style.borderColor = "";
        medicineLowStock.style.borderColor = "";
        medicineDescription.style.borderColor = "";
        medicineManufacturedDate.style.borderColor = "";
        expirationDate.style.borderColor = "";

        Swal.fire({
          title: "Medicine Added",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          addMedicineForm.classList.remove("showElement1");
          //submitForm
          addMedicineFormContainer.submit();
        });

        console.log(
          classification,
          name,
          id,
          brand,
          dosage,
          dosageType,
          meidicineType,
          stock,
          lowStock,
          description,
          manufacturedDate,
          expiration
        );
      }
    });
  });
}

function removeBorderColor(event) {
  if (event.target.value.trim() === "") {
    event.target.style.borderColor = "var(--red)";
  } else {
    event.target.style.borderColor = "var(--green)";
  }
}

var cloneCount = 1;

function cloneDiv() {
  var originalDiv = document.getElementById("medicinePrescribeClone");
  var cloneDiv = originalDiv.cloneNode(true);

  cloneDiv.classList.remove("hidden");

  cloneDiv.querySelector("#addPresciption").value = "";
  cloneDiv.querySelector("#addPresciptionBrand").value = "";
  cloneDiv.querySelector("#addPresciptionCount").value = "0";
  cloneDiv.querySelector("#medicineDosagePrescribe").value = "0";
  cloneDiv.querySelector("#addPresciption").style.borderColor = "";
  cloneDiv.querySelector("#addPresciptionBrand").style.borderColor = "";
  cloneDiv.querySelector("#addPresciptionCount").style.borderColor = "";
  cloneDiv.querySelector("#medicineDosagePrescribe").style.borderColor = "";
  cloneDiv.querySelector("#dosageValuePrescribe").value = "ML";
  cloneDiv.querySelector("#dosageTypePrescribe").textContent = "ML";
  cloneCount++; // Increment clone count

  // Add the cloned div to the form
  document.getElementById("addedMedicinePrescription").appendChild(cloneDiv);
}

function toggleDosageOptions(spanElement) {
  var dosageOptions = spanElement.parentNode.querySelector(".dosageOptions1");
  var sortCarretDosagePrescribe = spanElement.parentNode.querySelector(
    ".sortCarretDosagePrescribe"
  );

  dosageOptions.classList.toggle("showElement");

  var options = dosageOptions.querySelectorAll("span");
  options.forEach(function (element) {
    element.addEventListener("click", function () {
      var mgMl = this.textContent;
      spanElement.querySelector("#dosageTypePrescribe").textContent = mgMl;
      dosageOptions.classList.remove("showElement");
      var dosageValue = spanElement.parentNode.querySelector(
        'input[name="addDosage[]"]'
      );
      dosageValue.value = mgMl;

      var currentTransform = sortCarretDosagePrescribe.style.transform;
      if (currentTransform === "rotate(180deg)") {
        sortCarretDosagePrescribe.style.transform = "";
      } else {
        sortCarretDosagePrescribe.style.transform = "rotate(180deg)";
      }
    });
  });

  var currentTransform = sortCarretDosagePrescribe.style.transform;
  if (currentTransform === "") {
    sortCarretDosagePrescribe.style.transform = "rotate(180deg)";
  } else {
    sortCarretDosagePrescribe.style.transform = "";
  }
}

function removeDiv(divToRemove) {
  divToRemove.parentNode.removeChild(divToRemove);
}

const classifications = ["Analgesic", "Antiseptic"];
const medicineClassification = document.querySelector(
  "#medicineClassification"
);
const medicineClassificationHolder = document.querySelector(
  "#medicineClassificationHolder"
);

function filterClassifications(searchInputValue) {
  const searchTerm = searchInputValue.toLowerCase();
  const filteredNames = classifications.filter((classification) =>
    classification.toLowerCase().includes(searchTerm)
  );

  return filteredNames;
}

function displayClassifications(filteredNames) {
  medicineClassificationHolder.innerHTML = "";

  const searchInputValue = medicineClassification.value.toLowerCase();

  filteredNames.forEach((name) => {
    const suggestion = document.createElement("span");
    suggestion.className = "medicineClassificationName";
    let highlightedName = "";
    let currentIndex = 0;
    for (let i = 0; i < name.length; i++) {
      const char = name[i].toLowerCase();

      if (
        currentIndex < searchInputValue.length &&
        char === searchInputValue[currentIndex]
      ) {
        highlightedName += `<span class="highlight">${name[i]}</span>`;
        currentIndex++;
      } else {
        highlightedName += name[i];
      }
    }

    suggestion.innerHTML = highlightedName;
    suggestion.addEventListener("click", () => {
      medicineClassification.value = name;
      medicineClassificationHolder.innerHTML = "";
    });
    medicineClassificationHolder.appendChild(suggestion);
  });
}

medicineClassification.addEventListener("input", (event) => {
  const searchInputValue = event.target.value.trim();
  if (searchInputValue === "") {
    medicineClassificationHolder.innerHTML = "";
    return;
  }
  const filteredNames = filterClassifications(searchInputValue);
  displayClassifications(filteredNames);
});

function truncateText(element, limit) {
  var text = element.textContent;
  if (text.length > limit) {
    var truncated = text.substring(0, limit) + "...";
    element.textContent = truncated;
  }
}
