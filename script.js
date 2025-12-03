//--------------- Dark Mode toggle logic ---------------

const darkToggle = document.querySelector(".dark-mode-btn i");
const colorText = document.querySelectorAll(".color-text");
const boxElements = document.querySelectorAll(".box");
const lightImages = document.querySelectorAll('.light-img');
const darkImages = document.querySelectorAll('.dark-img');
const root = document.querySelector(":root");

// Default colors for light mode (CSS variables)
const defaultLightModeColors = [
  "#fff",       // --white
  "#000000",    // --text-color
  "#000",       // --primary-color
  "#272B2F",    // --secondary-color
  "#fff"        // --ui-bg
];

// Function to apply theme colors
function applyThemeColors(colors) {
  root.style.setProperty("--white", colors[0]);
  root.style.setProperty("--text-color", colors[1]);
  root.style.setProperty("--primary-color", colors[2]);
  root.style.setProperty("--secondary-color", colors[3]);
  root.style.setProperty("--ui-bg", colors[4]);
}

// Function to toggle dark mode classes
function toggleDarkMode(darkModeStyle) {
  const method = darkModeStyle ? "add" : "remove";
  colorText.forEach(el => el.classList[method]("darkMode"));
  boxElements.forEach(el => el.classList[method]("darkMode"));
}

// Handle dark mode toggle
darkToggle.addEventListener("click", () => {
  const isDarkMode = darkToggle.classList.contains("fa-moon");
  const colorData = darkToggle.getAttribute("data-color").split(" "); // Get color data from the button
  
  if (isDarkMode) {
    // Switch to dark mode
    darkToggle.classList.replace("fa-moon", "fa-sun");
    toggleDarkMode(true);
    applyThemeColors(colorData); // Apply the color theme when dark mode is activated
    darkToggle.parentElement.title = "Light Mode";

    // Show dark images, hide light images
    lightImages.forEach(img => img.classList.add('hidden'));
    darkImages.forEach(img => img.classList.remove('hidden'));
    
  } else {
    // Switch to light mode
    darkToggle.classList.replace("fa-sun", "fa-moon");
    toggleDarkMode(false);
    applyThemeColors(defaultLightModeColors); // Apply the default light mode colors
    darkToggle.parentElement.title = "Dark Mode";

    // Show light images, hide dark images
    lightImages.forEach(img => img.classList.remove('hidden'));
    darkImages.forEach(img => img.classList.add('hidden'));
  }
});


//--------------- Main Menu and toggle buttons logic ---------------

document.addEventListener('DOMContentLoaded', () => {
  // Get references
  const cipherBtn = document.getElementById('cipherBtn');
  const decipherBtn = document.getElementById('decipherBtn');
  const instructionBtn = document.getElementById('instructionBtn');

  const cipherMenuBackBtn = document.getElementById('cipherMenuBackBtn');
  const decipherMenuBackBtn = document.getElementById('decipherMenuBackBtn');
  const instructionMenuBackBtn = document.getElementById('instructionMenuBackBtn');

  const mainMenu = document.querySelector('.mainMenu');
  const cipherArea = document.querySelector('.cipherArea');
  const decipherArea = document.querySelector('.decipherArea');
  const instructionArea = document.querySelector('.instructionArea');

  // Show Cipher Area, hide Main Menu
  cipherBtn.addEventListener('click', () => {
    mainMenu.classList.add('hidden');
    cipherArea.classList.remove('hidden');
  });

  // Show Decipher Area, hide Main Menu
  decipherBtn.addEventListener('click', () => {
    mainMenu.classList.add('hidden');
    decipherArea.classList.remove('hidden');
  });

  // Show Instruction Area, hide Main Menu
  instructionBtn.addEventListener('click', () => {
    mainMenu.classList.add('hidden');
    instructionArea.classList.remove('hidden');
  });

  // Back from Cipher Area to Main Menu
  cipherMenuBackBtn.addEventListener('click', () => {
    cipherArea.classList.add('hidden');
    mainMenu.classList.remove('hidden');
  });

  // Back from Decipher Area to Main Menu
  decipherMenuBackBtn.addEventListener('click', () => {
    decipherArea.classList.add('hidden');
    mainMenu.classList.remove('hidden');
  });

  // Back from Instruction Area to Main Menu
  instructionMenuBackBtn.addEventListener('click', () => {
    instructionArea.classList.add('hidden');
    mainMenu.classList.remove('hidden');
  });
});




// ------------------------ Cipher Functions ---------------------------

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const cipherInput = document.getElementById('cipherInput');
  const cipherMethodSelect = document.getElementById('cipherMethodSelect');
  const caesarShiftSelect = document.getElementById('caesarShiftSelect');
  const cipherButton = document.getElementById('cipherButton');
  const cipherOutput = document.getElementById('cipherOutput');

  const layerPromptArea = document.getElementById('layerPromptArea');
  const layerCipherButton = document.getElementById('layerCipherButton');
  const layeredCaesarShiftSelect = document.getElementById('layeredCaesarShiftSelect');
  const layeredOutputArea = document.getElementById('layeredOutputArea');
  const layeredCipherOutput = document.getElementById('layeredCipherOutput');

  const resetCipherBtn = document.getElementById('resetCipherBtn');

  // Populate Caesar shift options (1-25)
  for (let i = 1; i <= 25; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    caesarShiftSelect.appendChild(option);

    const layeredOption = document.createElement('option');
    layeredOption.value = i;
    layeredOption.textContent = i;
    layeredCaesarShiftSelect.appendChild(layeredOption);
  }

  // Toggle Caesar shift dropdown on method select
  cipherMethodSelect.addEventListener('change', () => {
    if (cipherMethodSelect.value === 'caesar') {
      caesarShiftSelect.classList.remove('hidden');
    } else {
      caesarShiftSelect.classList.add('hidden');
    }
  });

  // Cipher button action
  cipherButton.addEventListener('click', () => {
    const method = cipherMethodSelect.value;
    const text = cipherInput.value;

    if (!method) {
      alert('Please select a cipher method.');
      return;
    }
    if (!text.trim()) {
      alert('Please enter text to cipher.');
      return;
    }

    let result = '';

    if (method === 'caesar') {
      const shift = parseInt(caesarShiftSelect.value);
      if (!shift) {
        alert('Please select a Caesar shift value.');
        return;
      }
      result = caesarCipher(text, shift);
      prepareLayerPrompt('atbash');
    } else if (method === 'atbash') {
      result = atbashCipher(text);
      prepareLayerPrompt('caesar');
    }

    cipherOutput.value = result;
    layerPromptArea.classList.remove('hidden');
  });

  // Layer Cipher Button action
  layerCipherButton.addEventListener('click', () => {
    const previousText = cipherOutput.value;
    let layeredResult = '';

    if (layerCipherButton.dataset.layerMethod === 'atbash') {
      layeredResult = atbashCipher(previousText);
    } else if (layerCipherButton.dataset.layerMethod === 'caesar') {
      const shift = parseInt(layeredCaesarShiftSelect.value);
      if (!shift) {
        alert('Please select a Caesar shift value for layering.');
        return;
      }
      layeredResult = caesarCipher(previousText, shift);
    }

    layeredCipherOutput.value = layeredResult;
    layeredOutputArea.classList.remove('hidden');
  });

  // Reset Button
  resetCipherBtn.addEventListener('click', () => {
    cipherInput.value = '';
    cipherMethodSelect.value = '';
    caesarShiftSelect.value = '';
    caesarShiftSelect.classList.add('hidden');
    cipherOutput.value = '';
    layerPromptArea.classList.add('hidden');
    layeredOutputArea.classList.add('hidden');
    layeredCipherOutput.value = '';
    layeredCaesarShiftSelect.value = '';
  });

  // Utility Functions
  function caesarCipher(text, shift) {
    return text.split('').map(char => {
      if (char >= 'a' && char <= 'z') {
        return String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97);
      } else if (char >= 'A' && char <= 'Z') {
        return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
      } else {
        return char; // preserve numbers, space, symbols
      }
    }).join('');
  }

  function atbashCipher(text) {
    return text.split('').map(char => {
      if (char >= 'a' && char <= 'z') {
        return String.fromCharCode(122 - (char.charCodeAt(0) - 97));
      } else if (char >= 'A' && char <= 'Z') {
        return String.fromCharCode(90 - (char.charCodeAt(0) - 65));
      } else {
        return char;
      }
    }).join('');
  }

  function prepareLayerPrompt(unusedCipher) {
    layerCipherButton.textContent = `${capitalize(unusedCipher)} Cipher`;
    layerCipherButton.dataset.layerMethod = unusedCipher;
    if (unusedCipher === 'caesar') {
      layeredCaesarShiftSelect.classList.remove('hidden');
    } else {
      layeredCaesarShiftSelect.classList.add('hidden');
    }
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
});

// ------------------------ Decipher Functions ---------------------------

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const decipherInput = document.getElementById('decipherInput');
  const decipherMethodSelect = document.getElementById('decipherMethodSelect');
  const decryptCaesarShiftSelect = document.getElementById('decryptCaesarShiftSelect');
  const decipherButton = document.getElementById('decipherButton');
  const decipherOutput = document.getElementById('decipherOutput');
  const resetDecipherBtn = document.getElementById('resetDecipherBtn');

  // Populate Caesar shift options (1-25)
  for (let i = 1; i <= 25; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    decryptCaesarShiftSelect.appendChild(option);
  }

  // Toggle Caesar shift dropdown on method select
  decipherMethodSelect.addEventListener('change', () => {
    if (decipherMethodSelect.value === 'decryptcaesar') {
      decryptCaesarShiftSelect.classList.remove('hidden');
    } else {
      decryptCaesarShiftSelect.classList.add('hidden');
    }
  });

  // Decipher Button Action
  decipherButton.addEventListener('click', () => {
    const method = decipherMethodSelect.value;
    const text = decipherInput.value.trim();

    if (!method) {
      alert('Please select a decipher method.');
      return;
    }
    if (!text) {
      alert('Please enter text to decipher.');
      return;
    }

    let result = '';

    if (method === 'decryptcaesar') {
      const shift = parseInt(decryptCaesarShiftSelect.value);
      if (!shift) {
        alert('Please select a Caesar shift value.');
        return;
      }
      result = caesarDecipher(text, shift);
    } else if (method === 'decryptatbash') {
      result = atbashCipher(text); // Atbash is its own inverse
    } else if (method === 'bruteforce') {
      result = bruteForceCaesar(text);
    }

    decipherOutput.value = result;
  });

  // Reset Button
  resetDecipherBtn.addEventListener('click', () => {
    decipherInput.value = '';
    decipherMethodSelect.value = '';
    decryptCaesarShiftSelect.value = '';
    decryptCaesarShiftSelect.classList.add('hidden');
    decipherOutput.value = '';
  });

  // Decipher Functions

  function caesarDecipher(text, shift) {
    return text.split('').map(char => {
      if (char >= 'a' && char <= 'z') {
        return String.fromCharCode(((char.charCodeAt(0) - 97 - shift + 26) % 26) + 97);
      } else if (char >= 'A' && char <= 'Z') {
        return String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
      } else {
        return char;
      }
    }).join('');
  }

  function atbashCipher(text) {
    return text.split('').map(char => {
      if (char >= 'a' && char <= 'z') {
        return String.fromCharCode(122 - (char.charCodeAt(0) - 97));
      } else if (char >= 'A' && char <= 'Z') {
        return String.fromCharCode(90 - (char.charCodeAt(0) - 65));
      } else {
        return char;
      }
    }).join('');
  }

    function bruteForceCaesar(text) {
  let results = '';

  results += '--- Solo Caesar (all 25 shifts) ---\n';
  for (let shift = 1; shift <= 25; shift++) {
    const deciphered = caesarDecipher(text, shift);
    results += `Shift ${shift}: ${deciphered}\n`;
  }

  results += '\n--- Solo Atbash ---\n';
  const atbashResult = atbashCipher(text);
  results += `${atbashResult}\n`;

  results += '\n--- Caesar → Atbash (all 25 shifts) ---\n';
  for (let shift = 1; shift <= 25; shift++) {
    const caesarFirst = caesarDecipher(text, shift);
    const atbashAfter = atbashCipher(caesarFirst);
    results += `Shift ${shift}: ${atbashAfter}\n`;
  }

  results += '\n--- Atbash → Caesar (all 25 shifts) ---\n';
  const atbashFirst = atbashCipher(text);
  for (let shift = 1; shift <= 25; shift++) {
    const caesarAfter = caesarDecipher(atbashFirst, shift);
    results += `Shift ${shift}: ${caesarAfter}\n`;
  }

  return results.trim();
}

});
