// Plain JavaScript Calculator with math.evaluate()
let expr = "";
const screen = document.getElementById("screen");

function show() {
  screen.textContent = expr || "0";
}

function addDigit(d) {
  // runs whenever a number button is pressed
  // after updating the internal expression, it calls the show() function 
  // which updates the visible calculator display
  expr += d;
  show();
}

function addOp(op) {
  // runs whenever the user presses an operator button (+, -, *, /)
  if (!expr) return; // disallow starting with an operator
  const last = expr.slice(-1);
  if (["+", "-", "*", "/"].includes(last)) {
    expr = expr.slice(0, -1) + op; // replace last operator
  } else {
    expr += op;
  }
  show();
}

function clearAll() {
  expr = "";
  show();
}

function evaluateExpr() {
  if (!expr) return;
  try {
    const result = math.evaluate(expr);
    expr = String(result);
  } catch (error) {
    expr = "Error";
  }
  show();
}

// Attach event listeners to buttons
document.querySelectorAll(".num").forEach((btn) => {
  btn.addEventListener("click", () => addDigit(btn.textContent));
});

document.querySelectorAll(".op").forEach((btn) => {
  btn.addEventListener("click", () => addOp(btn.textContent));
});

document.getElementById("clear").addEventListener("click", clearAll);
document.getElementById("equals").addEventListener("click", evaluateExpr);

// Keyboard input support
window.addEventListener("keydown", (e) => {
  const key = e.key;
  if (/^[0-9]$/.test(key)) addDigit(key);
  else if (["+", "-", "*", "/"].includes(key)) addOp(key);
  else if (key === "Enter" || key === "=") evaluateExpr();
  else if (key.toLowerCase() === "c") clearAll();
});

show();
