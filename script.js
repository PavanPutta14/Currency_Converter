let dropList = document.querySelectorAll("form select");
let fromCurrency = document.querySelector("#fromCurrency");
let toCurrency = document.querySelector("#toCurrency");
let icon = document.querySelector(".icon");
let exchangeTxt = document.querySelector("#exchangeRate");
let getBtn = document.querySelector("#convertButton");

// Adding options dynamically
for (let i = 0; i < dropList.length; i++) {
  for (let currency_code in country_list) {
    let selected =
      i == 0
        ? currency_code == "United States (USD)"
          ? "selected"
          : ""
        : currency_code == "India (INR)"
        ? "selected"
        : "";

    let optionTag = `<option value="${currency_code}" ${selected}>
    ${currency_code}</option>`;

    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }

  dropList[i].addEventListener("change", (e) => {
    loadFlag(e.target);
  });
}

function loadFlag(element) {
  for (let code in country_list) {
    if (code == element.value) {
      let imgTag = element.parentElement.querySelector("img");
      imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
    }
  }
}

getBtn.addEventListener("click", (e) => {
  e.preventDefault();
  getExchangeValue();
});

function getExchangeValue() {
  const amount = document.querySelector("#amountInput");
  let amountVal = amount.value.trim(); 

  
  if (isNaN(amountVal) || amountVal <= 0 || amountVal === "") {
    exchangeTxt.innerText = "Enter a valid amount"; 
    return;
  }

  exchangeTxt.innerText = "Converting Currency..."; 
  // Extract currency codes
  const fromCurrencyCode = fromCurrency.value.split("(")[1].split(")")[0]; 
  const toCurrencyCode = toCurrency.value.split("(")[1].split(")")[0]; 

  // version v6 of the ExchangeRate-API
  let url = `https://v6.exchangerate-api.com/v6/99fa25a97153e359b5b1a40a/latest/${fromCurrencyCode}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((result) => {
      console.log(result);  

     
      if (result.error) {
        exchangeTxt.innerText = result.error;
        return;
      }

      
      if (!result.conversion_rates || !result.conversion_rates[toCurrencyCode]) {
        exchangeTxt.innerText = `Conversion from ${fromCurrencyCode} to ${toCurrencyCode} is not available.`; 
        return; 
      }

      const conversionRate = result.conversion_rates[toCurrencyCode];
      const convertedAmount = (amountVal * conversionRate).toFixed(2);

      exchangeTxt.innerText = `${amountVal} ${fromCurrencyCode} = ${convertedAmount} ${toCurrencyCode}`;
    })
    .catch((error) => {
      console.error("Error:", error);
      exchangeTxt.innerText = "Conversion is not available.";
    });
}


icon.addEventListener("click", () => {
  let tempCode = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCode;
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeValue();
});

// Clear the conversion when the amount input is changed or removed
document.querySelector("#amountInput").addEventListener("input", (e) => {
  if (e.target.value.trim() === "") {
    exchangeTxt.innerText = ""; 
  }
});
