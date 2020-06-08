// consult storage for latest background settings
let htmlElem = document.querySelector("html");
if (localStorage.getItem("bgColour")){
    htmlElem.style.backgroundColor = `${localStorage.getItem("bgColour")}`;    
}

//
// assign value of iframe src attribute, and get the resource AFTER page content has loaded
let yorubaVideoEmbed01 = document.getElementById("yorubaVideoEmbed01");
yorubaVideoEmbed01.src = "https://www.youtube.com/embed/9tXsxBzGJzw";
