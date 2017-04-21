"use strict";

/**
 * The function reads the user
 * input, computes the the loan
 * information, displays results
 * in the spans as well as stores
 * user's input information in the
 * local storage and displays the
 * chart.
 */
function calculate() {

  // Get user input
  var amount        = document.getElementById("amount");
  var apr           = document.getElementById("apr");
  var years         = document.getElementById("years");
  var zipcode       = document.getElementById("zipcode");
  var payment       = document.getElementById("payment");
  var total         = document.getElementById("total");
  var totalinterest = document.getElementById("totalinterest");

  // Cast inputs, Change unit
  var principal = parseFloat(amount.value);
  var interest  = parseFloat(apr) / 100 / 12;
  var payments  = parseFloat(years) * 12;

  // Compute monthly payments
  var x = Math.pow(1 + interest, payments);
  var monthly = (principa * x * interest) / (x - 1);

  // Check validity and display data
  if (isFinite(monthly)) {

    // Fill up DOM with data
    payment.innerHTML       = monthly.toFixed(2);
    total.innerHTML         = (monthly * payments).toFixed(2);
    totalinterest.innerHTML = ((monthly * payments) - principal).toFixed(2);

    // Save user's input
    save(amount.value, apr.value, years.value, zipcode.value);

    // Find lenders in the area
    try {
      getLenders(amount.value, apr.value, years.value, zipcode.value);
    }

    catch(e) {
      // Ignore errors
    }

    // Display chart
    chart(principal, interest, monthly, payments);

  }

  // Number not finite --> Clear inputs
  else {

    total.innerHTML         = "";
    payment.innerHTML       = "";
    totalinterest.innerHTML = "";

    chart(); // no args -> cleans the chart

  }

}

/**
 * Saves user's input in the
 * localStorage object. So that
 * those properties can be accessed
 * by the user (when he/she visits)
 * again.
 */
function save(amount, apr, years, zipcode) {

  // Checks for browser's support
  if (window.localStorage) {

    localStorage.loan_amount  = amount;
    localStorage.loan_apr     = apr;
    localStorage.loan_years   = years;
    localStorage.loan_zipcode = zipcode;

  }

}

/**
 * Automatically tries to restore
 * fields when DOM is loaded.
 */
window.onload = function() {

  // Checks for browser support and data
  if (window.localStorage && localStorage.loan_amount) {

    document.getElementById("amount").value  = localStorage.loan_amount;
    document.getElementById("apr").value     = localStorage.loan_apr;
    document.getElementById("years").value   = localStorage.loan_years;
    document.getElementById("zipcode").value = localStorage.loan_zipcode;

  }

};

/**
 * Server side lenders search
 * missing. However, the function
 * once the hypotetical server returns
 * the list of lenders displays them.
 */
 function getLenders(amount, apr, years, zipcode) {

   // Check XMLHttpRequest browser comp.
   if (!window.XMLHttpRequest) return;

   // Find element to display lenders
   var ad = document.getElementById("lenders");
   if (!ad) return;

   // Encode user's input as url query
   var url = "getLenders.php"                       +
             "?amt=" + encodeURIComponent(amount)   +
             "&apr=" + encodeURIComponent(apr)      +
             "&yrs=" + encodeURIComponent(years)    +
             "&zip=" + encodeURIComponent(zipcode);

    // Create XMLHttpRequest
    var req = new XMLHttpRequest(); // Start new request
    req.open("GET", url);           // GET req for the url
    req.send(null);                 // Send req with no body
    


 }
