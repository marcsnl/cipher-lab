// Defining Character sets
const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numberChars = "0123456789";
const symbolChars = "!@#$%^&*()_+-=[]{}|;:',.<>?/`~";

// Entering Elements
const passLengthInput = document.getElementById("passLength");
const passLengthRange = document.getElementById("passLengthRange");
const output = document.getElementById("output");
const generateBtn = document.getElementById("generate-btn");

const lowercaseCheckbox = document.getElementById("lowercase");
const uppercaseCheckbox = document.getElementById("uppercase");
const numbersCheckbox = document.getElementById("numbers");
const symbolsCheckbox = document.getElementById("symbols");

// Sync slider and number input
passLengthInput.addEventListener("input", () => {
  passLengthRange.value = passLengthInput.value;
});
passLengthRange.addEventListener("input", () => {
  passLengthInput.value = passLengthRange.value;
});

// Generate button logic
generateBtn.addEventListener("click", () => {
  const length = parseInt(passLengthInput.value);
  
  // Catch for null and out of range inputs
    if (isNaN(length)) {
    output.textContent = "Please enter a length between 4 to 32.";
    return;
  }
  if (length < 4) {
    output.textContent = "Too short, Minimum length is 4.";
    return;
  }
  if (length > 32) {
    output.textContent = "Too long, Maximum length is 32.";
    return;
  }
  
  let charPool = "";

  if (lowercaseCheckbox.checked) charPool += lowercaseChars;
  if (uppercaseCheckbox.checked) charPool += uppercaseChars;
  if (numbersCheckbox.checked) charPool += numberChars;
  if (symbolsCheckbox.checked) charPool += symbolChars;

  if (charPool.length === 0) {
    output.textContent = "Please select at least one character type!";
    return;
  }

  let generatedPassword = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charPool.length);
    generatedPassword += charPool[randomIndex];
  }

  output.textContent = generatedPassword;
});
