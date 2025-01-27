// Code now gives real-time, live, inline validation, as well as submit time validation.
// Character ranges specified
// Password confirm now first checks that password is valid, before doing it's own validations

// Single error line still only displays the first encountered error, even when >1 exist
// User still doesn't know field requirements and constraints in advance

const form = document.getElementById("createAccountForm");
// the input elements themselves...
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");

// making an array of our input elements
const inputElements = [username, email, password, password2];

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const validUsernameCharsetRegex = "/([\u0030-\u0039\u0041-\u005A\u0061-\u007A\u00C0-\u00DE\u00E0-\u00FF])+/gu";

const validLatinBasic = /^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/;
const validLatinAll = /^[\u0041-\u005A\u0061-\u007A\u0030-\u0039\u0020\u00E0-\u00FF\u00C0-\u00DE\u0144\u01F9\u0300\u0301\u0323 _-]+$/;
/*
NUMERIC RANGES BY UNICODE STANDARD BLOCK
     \u0020 space character
     \u0030-\u0039 numeric 0 - 9
    BASIC LATIN RANGES
     \u0041-\u005A basic latin upper-case A-Z
     \u0061-\u007A basic latin lower-case a-z
    LATIN-1 SUPPLEMENT RANGES
     \u00C0-\u00DE  latin upper-case A-Z
     \u00E0-\u00FF  latin lower-case a-z
    LATIN EXTENDED-A RANGES
     \u0144
    LATIN EXTENDED-B RANGES
     \u01F9
    COMBINING CHARACTER RANGES 
    \u0300\u0301\u0323
          
*/

// =======================================================
// ADD EVENT LISTENERS TO FORM CONTROLS

// form (re)validation at submit time
form.addEventListener("submit", (event) => {
    event.preventDefault(); // which in the case of submit is an http request

    //checkInputs();
    doUsernameTests();
    doEmailTests();
    doPasswordTests();
    doPasswordConfirmTests();

    // reset the form
    // give focus to first input field

});

// form reset (clear all input content, icons, messages etc.)
form.addEventListener("reset", (event) => {
    
    inputElements.forEach( (elem) => {
        elem.parentElement.querySelector("small").innerText= "";
        elem.parentElement.className = "form-control";
    })
});

// =======================================================
// RESET (CLEAR) ERROR OR SUCCESS ICONS AND MESSAGING AT RESET TIME

// remove error, remove error class
const resetErrorAndSuccessFor = (input) => {
    const formControl = input.parentElement; //.form-control
    const small = formControl.querySelector("small");
    small.innerText = ""; 
    // reset error class
    formControl.className = "form-control";
};

username.addEventListener("input", (event) => {
    doUsernameTests();
});

email.addEventListener("input", (event) => {
    doEmailTests();
});

password.addEventListener("input", (event) => {
    doPasswordTests();
    // now let's just make sure the confirm password isn't caught out...
    // if confirm password has already been entered once and validated, it needs to be done again
    if (!isEmpty(password2)) {
        doPasswordConfirmTests();
    }
});

password2.addEventListener("input", (event) => {
    doPasswordConfirmTests();
});

//================================================================
// FUNCTIONS THAT CALL APPROPRIATE INPUT VALIDATIONS, THEN PASS ON THE OUTCOMES
// TODO: could encapsulation be better here by using synchronous callback functions?
const doUsernameTests = () => {
    //
    if (isEmpty(username)) {
        setErrorFor(username, "Username cannot be blank");
    }
    else if (isTooShort(username, username.minLength)) {
        let charDiffPlurality = (username.minLength - username.value.length) !== 1;
        setErrorFor(username, `Need at least ${username.minLength - username.value.length} more ${charDiffPlurality ? "characters" : "character"}.`);
    }
    else if (hasInvalidCharacters(username)) {
        setErrorFor(username, "Invalid character");
    }
    else if (hasWhitespaceTopOrTail(username)) {
        setErrorFor(username, "Username cannot start or end with a space character");
    }
    else {
        setSuccessFor(username);
    }
};

const doEmailTests = () => {
    //
    if (isEmpty(email)) {
        setErrorFor(email, "Email cannot be blank");
    }
    else if (!isEmail(email)) {
        setErrorFor(email, "Email is not valid");
    }
    else {
        setSuccessFor(email);
    }
};

const doPasswordTests = () => {
    // 
    if (isEmpty(password)) {
        setErrorFor(password, "Password cannot be blank");
    }
    else if (isTooShort(password, password.minLength)) {
        let charDiffPlurality = (password.minLength - password.value.length) !== 1;
        setErrorFor(password, `Need at least ${password.minLength - password.value.length} more ${charDiffPlurality ? "characters" : "character"}.`);
    }
    else if (hasWhitespaceTopOrTail(password)) {
        setErrorFor(password, "Password cannot start or end with a space character");
    }
    else {
        setSuccessFor(password);
    }
};

const doPasswordConfirmTests = () => {
    if (isEmpty(password2)) {
        setErrorFor(password2, "Password Confirm cannot be blank");
    }
    // before validating for equality, just check that password is valid
    else if (isNotValid(password)) {
        setErrorFor(password2, "Set a valid password first!");
    }
    else if (areNotEqual(password, password2)) {
        setErrorFor(password2, `Passwords do not match`);
    }
    else {
        setSuccessFor(password2);
    }
};

// =======================================================
// SHOW ERROR OR SUCCESS ICONS AND MESSAGING
// TODO: use try..catch to validate arguments and handle errors

// show error, add error class
const setErrorFor = (input, message) => {
    const formControl = input.parentElement; //.form-control
    const small = formControl.querySelector("small");
    const constraintsTip = "Only letters, numbers, space, dash(-) and underscore(_) are allowed here";

    // add error message into small
    if (message == "Invalid character") {
        small.innerHTML = `<abbr style="cursor:help;" title="${constraintsTip}">${message}</abbr>`;
    }
    else {
        small.innerText = message;
    }

    // add error class
    formControl.className = "form-control error"
};

// add success class
const setSuccessFor = (input) => {
    const formControl = input.parentElement; //.form-control
    formControl.className = "form-control success"
};


// =======================================================
// SPECIFIC CHECKS ON INPUTS AT INPUT TIME

// define a function for every validity check
//===========================================

// generalised function for checking...
const isEmpty = (input) => {
    let input_value = input.value;
    let isEmpty = false;
    if (input_value == "") {
        isEmpty = true;
    }
    return isEmpty;
};

// generalised function for checking...
const isTooShort = (input, minLen) => {
    let input_value = input.value;
    let isTooShort = false;
    if (input_value.length < minLen) {
        isTooShort = true;
    }
    return isTooShort;
};

// generalised function for checking...
const isEmail = (input) => {
    let input_value = input.value;
    if (input_value.match(emailRegex)) {
        return true;
    }
    else {
        return false;
    }
};

// generalised function for checking...
const hasInvalidCharacters = (input) => {
    let input_value = input.value;
    if (!input_value.match(validLatinAll)) {
        return true;
    }
    else {
        return false;
    }
};

// generalised function for checking...
const hasWhitespaceTopOrTail = (input) => {
    let input_value = input.value;
    if (input_value.trim().length < input_value.length) {
        return true;
    }
    else {
        return false;
    }
};

// generalised function for checking whether 2 inputs values are NOT strictly equal
const areNotEqual = (input1, input2) => {
    let input1_value = input1.value;
    let input2_value = input2.value;
    if (input1_value !== input2_value) {
        return true;
    }
    else {
        return false;
    }
};

// generalised function for checking whether another input is currently INVALID
const isNotValid = (input) => {
    if (input.parentElement.className === "form-control error") {
        return true;
    }
    else {
        return false;
    }
};