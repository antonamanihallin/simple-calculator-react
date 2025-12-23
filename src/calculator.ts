// Calculator State Variables
let currentDisplay: string = '0';
let previousNumber: number | null = null;
let operation: string | null = null;
let waitingForNewNumber: boolean = false;

// Get the display element
const display: HTMLElement | null = document.getElementById('display');

// Function to update the display
function updateDisplay(): void {
    if (display) {
        display.textContent = currentDisplay;
    }
}

// Function to append a number to the display
function appendNumber(number: string): void {
    if (waitingForNewNumber) {
        currentDisplay = number;
        waitingForNewNumber = false;
    } else {
        // Prevent multiple leading zeros
        if (currentDisplay === '0') {
            currentDisplay = number;
        } else {
            currentDisplay += number;
        }
    }
    updateDisplay();
}

// Function to handle decimal point
function appendDecimal(): void {
    if (waitingForNewNumber) {
        currentDisplay = '0.';
        waitingForNewNumber = false;
    } else if (currentDisplay.indexOf('.') === -1) {
        // Only add decimal if one doesn't already exist
        currentDisplay += '.';
    }
    updateDisplay();
}

// Function to choose an operation
function chooseOperation(op: string): void {
    const inputValue: number = parseFloat(currentDisplay);
    
    if (previousNumber === null) {
        previousNumber = inputValue;
    } else if (operation) {
        // If there's already an operation, calculate the result first
        const result: number = calculate();
        previousNumber = result;
        currentDisplay = String(result);
        updateDisplay();
    }
    
    waitingForNewNumber = true;
    operation = op;
}

// Function to perform calculation
function calculate(): number {
    const inputValue: number = parseFloat(currentDisplay);
    
    if (previousNumber === null || operation === null) {
        return inputValue;
    }
    
    let result: number;
    
    switch (operation) {
        case '+':
            result = previousNumber + inputValue;
            break;
        case '-':
            result = previousNumber - inputValue;
            break;
        case '*':
            result = previousNumber * inputValue;
            break;
        case '/':
            // Error handling: division by zero
            if (inputValue === 0) {
                alert('Error: Division by zero is not allowed!');
                clear();
                return 0;
            }
            result = previousNumber / inputValue;
            break;
        default:
            return inputValue;
    }
    
    // Reset operation state
    operation = null;
    previousNumber = null;
    waitingForNewNumber = true;
    
    return result;
}

// Function to clear the calculator
function clear(): void {
    currentDisplay = '0';
    previousNumber = null;
    operation = null;
    waitingForNewNumber = false;
    updateDisplay();
}

// Event Listeners

// Number buttons (0-9)
const numberButtons: NodeListOf<Element> = document.querySelectorAll('.btn-number');
numberButtons.forEach((button: Element) => {
    button.addEventListener('click', () => {
        const number: string | null = button.getAttribute('data-number');
        if (number) {
            appendNumber(number);
        }
    });
});

// Decimal point button
const decimalButton: HTMLElement | null = document.getElementById('decimal');
if (decimalButton) {
    decimalButton.addEventListener('click', () => {
        appendDecimal();
    });
}

// Operation buttons (+, -, *, /)
const operationButtons: NodeListOf<Element> = document.querySelectorAll('.btn-operation');
operationButtons.forEach((button: Element) => {
    button.addEventListener('click', () => {
        const op: string | null = button.getAttribute('data-operation');
        if (op) {
            chooseOperation(op);
        }
    });
});

// Equals button
const equalsButton: HTMLElement | null = document.getElementById('equals');
if (equalsButton) {
    equalsButton.addEventListener('click', () => {
        const result: number = calculate();
        currentDisplay = String(result);
        updateDisplay();
    });
}

// Clear button
const clearButton: HTMLElement | null = document.getElementById('clear');
if (clearButton) {
    clearButton.addEventListener('click', () => {
        clear();
    });
}

// Initialize display
updateDisplay();