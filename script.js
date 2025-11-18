// =========================
// STANDARD CALCULATOR SETUP
// =========================
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

// Initialize by showing the standard calculator
// document.querySelector('.tab[data-panel="standard"]').click();

// ======================
// RPN CALCULATOR SETUP
// ======================
let rpnStack = [];
let rpnCurrent = ""; // typing buffer

const rpnScreen = document.getElementById("rpn-screen");

function updateRpnDisplay() {
  let value = "0";

  if (rpnCurrent !== "") {
    value = rpnCurrent;
  } else if (rpnStack.length > 0) {
    value = rpnStack[rpnStack.length - 1];
  } else {
    value = "0";
  }

  rpnScreen.textContent = value;
}

function rpnAddDigit(d) {
  rpnCurrent += d;
  updateRpnDisplay();
}

// Enter: push current value onto stack
function rpnEnter() {
  if (rpnCurrent !== "") {
    rpnStack.push(parseFloat(rpnCurrent));
    rpnCurrent = "";
  }
  updateRpnDisplay();
}

// Clear everything
function rpnClear() {
  rpnStack = [];
  rpnCurrent = "";
  updateRpnDisplay();
}

// Operators: apply to top 2 items
function rpnOperate(op) {
  //console.log("OPERATOR RECEIVED:", JSON.stringify(op));

  op = op.trim();

  // If user is typing, treat it as an implicit "Enter"
  if (rpnCurrent !== "") {
    rpnStack.push(parseFloat(rpnCurrent));
    rpnCurrent = "";
  }

  // Need at least 2 values now
  if (rpnStack.length < 2) {
    updateRpnDisplay();
    return;
  }

  const b = rpnStack.pop();
  const a = rpnStack.pop();

  let result = 0;

  if (op === "+") result = a + b;
  if (op === "-") result = a - b;
  if (op === "*") result = a * b;
  if (op === "/") result = a / b;

  rpnStack.push(result);
  updateRpnDisplay();
}

// Attach listeners
document.querySelectorAll(".rpn-num").forEach((btn) => {
  btn.addEventListener("click", () => rpnAddDigit(btn.textContent));
});

document.querySelectorAll(".rpn-op").forEach((btn) => {
  btn.addEventListener("click", () => rpnOperate(btn.textContent));
});

document.getElementById("rpn-enter").addEventListener("click", rpnEnter);
document.getElementById("rpn-clear").addEventListener("click", rpnClear);

updateRpnDisplay();

// ============================================
// Event listener to switch between calculators
// ============================================
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".calc-panel");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // Deactivate all tabs and panels
    tabs.forEach((t) => t.classList.remove("active"));
    panels.forEach((p) => p.classList.remove("active"));

    // Activate the clicked tab and corresponding panel
    tab.classList.add("active");
    const target = tab.dataset.target;
    document.getElementById(target).classList.add("active");
  });
});
