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
  var monthly = (principal * x * interest) / (x - 1);

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
            "?amt=" + encodeURIComponent(amount)   +            "&apr=" + encodeURIComponent(apr)      +
            "&yrs=" + encodeURIComponent(years)    +
            "&zip=" + encodeURIComponent(zipcode);

  // Create XMLHttpRequest
  var req = new XMLHttpRequest(); // Start new request
  req.open("GET", url);           // GET req for the url
  req.send(null);                 // Send req with no body

  // Register event handler (incoming server side response)
  req.onreadystatechange = function() {

    // Check if HTTP response is complete
    if (req.readyState == 4 && req.status == 200) {

      // Fetch data from response
      var response = req.responseText;

      // Cast text to JSON
      var lender = JSON.parse(response);

      // Create a list of lenders
      var list = "";
      for (var i = 0; i < lender.length; i++) {

        list += "<li><a href='" + lender[i].url + "'>" +
                lender[i].name + "</a></li>";

      }

      // Display list
      ad.innerHTML = "<ul>" + list + "</ul>";

    }
  }

}

/**
 * Draws loan data into the canvas.
 */

function chart(principal, interest, monthly, payments) {

  // Get graph element
  var graph = document.getElementById("graph");

  // Some sort of magic that clears the canvas element
  graph.width = graph.width;

  // Check browser capability or chart cleaning
  if (arguments.length == 0 || !graph.getContext) return;

  // Get context (drawing object) and canvas size
  var g = graph.getContext("2d");
  var width = graph.width, var height = graph.height;

  // Convert some inputs to pixels
  function paymentToX(n) { return n * width/payments }
  function amountToY(n) { return height - (a * height / (monthly * payments * 1.05)) }

  // Draw payments in the graph
  g.moveTo(payments(0), amountToY(0)); // Start lower left
  g.lineTo(paymentToX(payments), amountToY(monthly * payments)); // Draw to upper light
  g.lineTo(paymentToX(payments), amountToY(0)); // Down to lower right
  g.closePath(); // Back to starting point (0,0)

  // Style payment graph
  g.fillStyle = "#f88";
  g.fill();
  g.font = "bold 12px sans-serif";
  g.fillText("Total Interest Payments", 20, 20);

}
