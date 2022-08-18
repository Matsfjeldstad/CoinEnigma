const form = document.querySelector('form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const adressInput = document.querySelector('#adress');
const subjectInput = document.querySelector('#subject');
const formButton = document.querySelector('#formButton');
const formSuccessNotification = document.querySelector('.form-success');

form.addEventListener('submit', validateForm);

function validateForm() {
  event.preventDefault();
  if (checkLegth(nameInput.value, 0) === true) {
    setSuccsess(nameInput);
  } else {
    setError(nameInput, 'The name field cannot be empty');
  }

  if (checkLegth(emailInput.value, 0) === true) {
    if (validateEmail(emailInput.value) === true) {
      setSuccsess(emailInput);
    } else {
      setError(emailInput, 'Please enter a valid email');
    }
  } else {
    setError(emailInput, 'The name field cannot be empty');
  }

  if (checkLegth(subjectInput.value, 10) === true) {
    setSuccsess(subjectInput);
  } else {
    setError(subjectInput, 'This field needs to contain 10 or more characters');
  }

  if (checkLegth(adressInput.value, 25) === true) {
    setSuccsess(adressInput);
  } else {
    setError(adressInput, 'This field needs to contain 25 or more characters');
  }

  if (
    checkLegth(adressInput.value, 25) === true &&
    checkLegth(subjectInput.value, 10) === true &&
    validateEmail(emailInput.value) === true &&
    checkLegth(nameInput.value, 0) === true
  ) {
    formSuccessNotification.classList.remove('hide');
  }
}

function checkLegth(value, len) {
  if (value.trim().length > len) {
    return true;
  } else {
    return false;
  }
}

function validateEmail(email) {
  const regEx = /\S+@\S+\.\S+/;
  const patternMatches = regEx.test(email.trim());
  return patternMatches;
}

function setError(element, message) {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector('.error');
  errorDisplay.innerText = message;
  inputControl.classList.add('error');
  inputControl.classList.remove('success');
}

function setSuccsess(element) {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector('.error');
  errorDisplay.innerText = '';
  inputControl.classList.add('success');
  inputControl.classList.remove('error');
}
