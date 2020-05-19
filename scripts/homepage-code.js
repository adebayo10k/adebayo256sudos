// 
let htmlElem = document.querySelector("html");
let bgColourParaElem = document.getElementById("colourPara");
let bgColourInputElem = document.getElementById("bgColourPicker");
let bgColourBtnElem = document.getElementById("bgColourBtn");

const defaultColour = "#6495ed"; //cornflower blue"#6495ed"; //cornflower blue

// prepare forgetMe section elements
let forgetMeSectionElem = document.getElementById("forgetMe");
let forgetMePara = document.createElement("p");
let forgetMeBtn = document.createElement("input");
let forgetMeBtnLabel = document.createElement("label");
let forgetMeText = document.createTextNode("...or forget your background colour choice forever.");

//<p id="forgetMePara">...or forget your background colour choice forever.</p>
forgetMePara.setAttribute("id", "forgetMePara");
forgetMePara.appendChild(forgetMeText);

//<label for="forgetMe">Take the red pill:</label>
forgetMeBtnLabel.setAttribute("for", "forgetMeBtn");
forgetMeBtnLabel.textContent = "Take the blue pill:"; // or innerHTML =

//<input type="button" class="" id="forgetBtn" value="forget me">
forgetMeBtn.setAttribute("type", "button");
forgetMeBtn.setAttribute("class", "");
forgetMeBtn.setAttribute("id", "forgetBtn");
forgetMeBtn.setAttribute("value", "forget me");





// find out what localeStorage currently looks like
const getSystemState = () => {

    let state = 
    !localStorage.getItem("bgColour") ? "UNSET"
    : localStorage.getItem("bgColour") && !localStorage.getItem("userChoiceDate") ? "SYSTEM_DEFAULT"
    : localStorage.getItem("bgColour") && localStorage.getItem("userChoiceDate") ? "USER_CONFIGURED"
    : console.log("pre try-catch failsafe");

    return state;
};

// populate local storage with properties based on requested state
const setSystemState = (requestedState) => {
    
    switch (requestedState){
        case "SYSTEM_DEFAULT" :
            console.log(`requestedState: ${requestedState}`);
            localStorage.setItem("bgColour", defaultColour);
            break;
        case "USER_CONFIGURED" :
            console.log(`requestedState: ${requestedState}`);           
            localStorage.setItem("bgColour", bgColourInputElem.value);
            localStorage.setItem("userChoiceDate", new Date());
            break;
        case "UNSET" : 
            console.log(`requestedState: ${requestedState}`);           
            localStorage.clear();
            break;
        default:
            console.log("Pre try-catch failsafe. setSystemState switch didn't match argument");
    };    
};

// eg. change text and add forget me button if now user configured
const updateAppearanceSectionsContent = (storedAppearanceSetting) => {
    const appearanceText1 = `
    Make yourself at home by changing the background colour of this page. Changes should persist between browser restarts.    
    `;
    const appearanceText2 = `
    Your preferred background colour was set to ${localStorage.getItem("bgColour")} on ${localStorage.getItem("userChoiceDate")}. Try another whenever you like.    
    `;

    switch (storedAppearanceSetting){
        case "UNSET" :
            console.log(`storedAppearanceSetting: ${storedAppearanceSetting}`);
            bgColourParaElem.innerHTML = appearanceText1;
            // explicitly use the hardcoded default
            bgColourInputElem.value = defaultColour;
            break;
        case "SYSTEM_DEFAULT" :
            console.log(`storedAppearanceSetting: ${storedAppearanceSetting}`);
            bgColourParaElem.innerHTML = appearanceText1;
            //bgColourInputElem.value = defaultColour;
            bgColourInputElem.value = localStorage.getItem("bgColour");
            break;
        case "USER_CONFIGURED" :
            console.log(`storedAppearanceSetting: ${storedAppearanceSetting}`);
            bgColourParaElem.innerHTML = appearanceText2;
            bgColourInputElem.value = localStorage.getItem("bgColour");
            // construct the new forgetMe section IF NOT ALREADY HERE
            if (!forgetMeSectionElem.hasChildNodes()){
                forgetMeSectionElem.appendChild(forgetMePara);
                forgetMeSectionElem.appendChild(forgetMeBtnLabel);
                forgetMeSectionElem.appendChild(forgetMeBtn); 
            }            
            break;
        default:
            console.log("Pre try-catch failsafe. updateAppearanceSectionsContent switch didn't match argument");
    }; 

};

const updateStyleAllPages = () => {

    htmlElem.style.backgroundColor = `${localStorage.getItem("bgColour")}`;

};


//---------------------------------------------------------------------------------------------------
// on page load...main...
localStorage.clear();

let storedAppearanceSetting = getSystemState();
console.log(storedAppearanceSetting);

// TODO: USE SWITCH HERE INSTEAD
if (storedAppearanceSetting == "UNSET"){
    setSystemState("SYSTEM_DEFAULT");
    storedAppearanceSetting = getSystemState();
    console.log(`State changed from UNSET to: ${getSystemState()} == ${storedAppearanceSetting}`);
    //updateAppearanceSectionsContent("SYSTEM_DEFAULT");// should be no change, but just for completeness
    updateAppearanceSectionsContent(storedAppearanceSetting);
}
else if (storedAppearanceSetting == "USER_CONFIGURED"){
    updateAppearanceSectionsContent(storedAppearanceSetting);
}
else{
    // system default state found, so nothing to do here
    updateAppearanceSectionsContent(storedAppearanceSetting);// should be no change, but just for completeness
}
// in all states... update page styles:
updateStyleAllPages();


//---------------------------------------------------------------------------------------------------

const userConfigurePage = () => {
    let currentConfig = getSystemState();
    // add a requiredConfig variable??? or not??
    console.log(`currentConfig: ${currentConfig}`);
    switch (currentConfig){
        case "UNSET" :
            console.log(`currentConfig: ${currentConfig}`);
            console.log("should NEVER be here at button press time! Investigate.")
            break;
        case "SYSTEM_DEFAULT" :
            console.log(`currentConfig: ${currentConfig}`);

            setSystemState("USER_CONFIGURED");
            updateAppearanceSectionsContent("USER_CONFIGURED");
            updateStyleAllPages(); //TODO: for ALL pages!

            
            break;
        case "USER_CONFIGURED" :
            console.log(`currentConfig: ${currentConfig}`);
            // TODO: what's point of finding out current config if you're just gonna call updateAppearanceSectionsContent("USER_CONFIGURED") in the same way. a more efficient way possible???

            // FIRST.... show confirm dialog
            setSystemState("USER_CONFIGURED");
            updateAppearanceSectionsContent("USER_CONFIGURED");
            updateStyleAllPages(); //TODO: for ALL pages!


            break;
        default:
            console.log("Pre try-catch failsafe. userConfigurePage switch didn't match argument");
    }; 

};

// on colour change button press
//bgColourBtnElem.onclick = userConfigurePage();

//
