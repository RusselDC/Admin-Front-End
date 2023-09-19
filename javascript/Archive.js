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
    //search on everytype
    search.addEventListener('input', function(){
        //your code
        console.log(this.value)
    })
}