//Calling objects to be used
document.addEventListener("DOMContentLoaded", () => {
  const calculateBtn = document.getElementById("calculateBtn");
  const depositToggle = document.getElementById("depositToggle");
  const depositOptions = document.getElementById("depositOptions");
  const resetBtn = document.getElementById("resetBtn");
  const resultArea = document.getElementById("resultArea");

  depositToggle.addEventListener("change", () => {
    depositOptions.style.display = depositToggle.checked ? "block" : "none";
  });

//Calculate Button Logic
  calculateBtn.addEventListener("click", () => {
    
    //Converting strings to float
    const startMoney = parseFloat(document.getElementById("startingMoney").value) || 0;
    const depositAmount = parseFloat(document.getElementById("depositAmount").value) || 0;
    const depositFreq = document.getElementById("depositFrequency").value;
    const annualRate = parseFloat(document.getElementById("interestRate").value) || 0;
    const taxRate = parseFloat(document.getElementById("taxRate").value) || 0;
    const startDate = new Date(document.getElementById("startDate").value);
    const endDate = new Date(document.getElementById("endDate").value);

    // Validation for starting money, interest rate, and tax rate
    if (startMoney <= 0 || isNaN(startMoney)) {
      alert("Please enter a valid starting money amount greater than 0.");
      return;
    }

    if (annualRate <= 0 || isNaN(annualRate)) {
      alert("Please enter a valid annual interest rate greater than 0.");
      return;
    }

    // Validation for tax rate (including check for period '.' input)
    if (isNaN(taxRate) || taxRate < 0 || String(taxRate).includes(".")) {
      alert("Please enter a valid tax rate (it can be 0 or greater). A period ('.') is not allowed.");
      return;
    }

    // Updated validation for dates (checking getTime() for invalid dates)
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate <= startDate) {
      alert("Please enter a valid start and end date.");
      return;
    }
    
    //Computation logic
    const monthlyRate = annualRate / 12 / 100;
    resultArea.innerHTML = ""; // Clear previous result

    let balance = startMoney;
    let currentDate = new Date(startDate);
    let currentYear = currentDate.getFullYear();

    let table = createNewTable(currentYear, depositAmount);
    let tbody = table.querySelector("tbody");
    
    //Loop logic until end date is reached
    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();

      // New table logic for every end of a year
      if (year !== currentYear) {
        resultArea.appendChild(table); // Append the finished table
        currentYear = year;
        table = createNewTable(currentYear, depositAmount); // New year = new table
        tbody = table.querySelector("tbody");
      }

      const monthStr = currentDate.toLocaleString("default", { month: "long", year: "numeric" });
      const interest = balance * monthlyRate;
      const tax = interest * (taxRate / 100);
      balance += interest - tax;

      let depositThisMonth = 0;
      if (depositAmount > 0) {
        if (depositFreq === "monthly") {
          depositThisMonth = depositAmount;
        } else if (depositFreq === "yearly" && currentDate.getMonth() === 11) {
          depositThisMonth = depositAmount;
        }
        balance += depositThisMonth;
      }

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${monthStr}</td>
        <td>${interest.toFixed(2)}</td>
        <td>${tax.toFixed(2)}</td>
        ${depositAmount > 0 ? `<td>${depositThisMonth.toFixed(2)}</td>` : ""}
        <td>${balance.toFixed(2)}</td>
      `;
      tbody.appendChild(row);

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    resultArea.appendChild(table);
  });

  // Reset functionality
  resetBtn.addEventListener("click", () => {
    document.getElementById("startingMoney").value = '';
    document.getElementById("depositAmount").value = '';
    document.getElementById("depositFrequency").value = 'monthly';
    document.getElementById("interestRate").value = '';
    document.getElementById("taxRate").value = '';
    document.getElementById("startDate").value = '';
    document.getElementById("endDate").value = '';
    resultArea.innerHTML = '';
  });

  function createNewTable(year, depositAmount) {
    const table = document.createElement("table");
    const hasDeposit = depositAmount > 0;

    table.innerHTML = `
      <caption style="font-weight: bold; text-align: left; margin: 10px 0;">Year: ${year}</caption>
      <thead>
        <tr>
          <th>Month</th>
          <th>Interest</th>
          <th>Tax</th>
          ${hasDeposit ? "<th>Deposit</th>" : ""}
          <th>Balance</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    return table;
  }
});
