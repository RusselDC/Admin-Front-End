function onload(){
    listeners();
}
    
    
function listeners(){
    var sortButton = document.querySelector('#sortButton');
    var sortOptions = document.querySelector('#sortOptions');
    var sorts = document.querySelectorAll('.sortOptions1 span');
    var sortText = document.querySelector('#sortText');
    var search = document.querySelector('#search');

    //show sort Options
    sortButton.addEventListener('click', ()=>{
        sortOptions.classList.toggle('showElement');
        const caretIcons = document.querySelectorAll(".fa-caret-down");
        caretIcons.forEach((icon) => {
            const currentTransform = icon.style.transform;
            if (currentTransform === '') {
              icon.style.transform = "rotate(180deg)";
            } else {
              icon.style.transform = '';
            }
          });
    })
    //change text content of sort button
    sorts.forEach(function(sort){
        sort.addEventListener('click', function(){
            var  textSpan = this.innerText;
            sortText.innerText = textSpan;
            sortOptions.classList.remove('showElement');
            const caretIcons = document.querySelectorAll(".fa-caret-down");
            caretIcons.forEach((icon) => {
                const currentTransform = icon.style.transform;
                if (currentTransform === '') {
                  icon.style.transform = "rotate(180deg)";
                } else {
                  icon.style.transform = '';
                }
              });
        })
    })

    const tableBody = document.querySelector("#tableBody");
    const staffTemplateLoader = document.querySelector("#staffTemplateLoader");
    const staffTemplate = document.querySelector("#staffTemplate");
  
    for (let i = 0; i < 7; i++) {
      tableBody.append(staffTemplateLoader.content.cloneNode(true));
    }
    fetch("https://run.mocky.io/v3/c1c87771-c5c3-42e2-a29b-630ce0f37640")
    .then((response) => response.json())
    .then((data) => {
      updateDisplay("", data);
      var search = document.querySelector("#search");
      search.addEventListener("input", function () {
        updateDisplay(this.value, data);
      });
    })
    function filterData(data, searchTerm) {
      const employees = data.employees;
    
      if (!searchTerm) {
        return employees;
      }
    
      searchTerm = searchTerm.toLowerCase();
      return employees.filter((obj) => {
        return (
          obj.staffName.toLowerCase().includes(searchTerm) ||
          obj.position.toLowerCase().includes(searchTerm) ||
          obj.email.toLowerCase().includes(searchTerm) ||
          obj.status.toLowerCase().includes(searchTerm) ||
          obj.contactNumber.toString().toLowerCase().includes(searchTerm)
        );
      });
    }
    
    
    function updateDisplay(searchTerm,data) {
      tableBody.innerHTML = "";
      const filteredData = filterData(data, searchTerm);
      filteredData.forEach((obj) => {
        const clone = document.importNode(staffTemplate.content, true);
        clone.querySelector("#staffName").innerHTML = highlightText(
          obj.staffName,
          searchTerm
        );
        clone.querySelector("#position").innerHTML = highlightText(
          obj.position,
          searchTerm
        );
        clone.querySelector("#contactNumber").innerHTML = highlightText(
          obj.contactNumber.toString(),
          searchTerm
        );
        clone.querySelector("#emailAddresss").innerHTML = highlightText(
          obj.email,
          searchTerm
        );
        var status = clone.querySelector("#status");
        status.innerHTML = highlightText(obj.status.toUpperCase(),searchTerm);
        if(obj.status === "active"){
          status.style.backgroundColor = "var(--green)"
        }
        else{
          status.style.backgroundColor = "var(--orange)"
        }
        var img = clone.querySelector("#imgStaff");
        img.src = "../images/" + obj.imgSource;
        tableBody.appendChild(clone);
      });

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
    }
}   