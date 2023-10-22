function onload(){
    listeners();
    fetchNotification();
}
    
    
function listeners(){
  const links = document.querySelectorAll(".links");
  links.forEach((link) => {
      const tooltipText = link.getAttribute("data-tooltip");

      const tooltip = document.createElement("div");
      tooltip.classList.add("tooltip");
      tooltip.textContent = tooltipText;

      link.appendChild(tooltip);
  });
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
    //search on everytype
    search.addEventListener('input', function(){
        //your code
        console.log(this.value)
    })
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