function priority(operation) {
    if (operation == '+' || operation == '-') {
        return 1;
    } else {
        return 2;
    }
}

function isNumeric(str) {
    return /^\d+(.\d+){0,1}$/.test(str);
}

function isDigit(str) {
    return /^\d{1}$/.test(str);
}

function isOperation(str) {
    return /^[\+\-\*\/]{1}$/.test(str);
}

function tokenize(str) {
    let tokens = [];
    let lastNumber = '';
    for (char of str) {
        if (isDigit(char) || char == '.') {
            lastNumber += char;
        } else {
            if (lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        }
        if (isOperation(char) || char == '(' || char == ')') {
            tokens.push(char);
        }
    }
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    return tokens;
}

function compile(str) {
    let out = [];
    let stack = [];
    for (token of tokenize(str)) {
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            while (stack.length > 0 &&
                isOperation(stack[stack.length - 1]) &&
                priority(stack[stack.length - 1]) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token);
        } else if (token == '(') {
            stack.push(token);
        } else if (token == ')') {
            while (stack.length > 0 && stack[stack.length - 1] != '(') {
                out.push(stack.pop());
            }
            stack.pop();
        }
    }
    while (stack.length > 0) {
        out.push(stack.pop());
    }
    console.log(out.join(' '));
    return out.join(' ');
}

function evaluate(str) {
    let expr = str.split(" ");
    let stack = [];
    if (expr === '') {
        return 0;
    }

    for (let i = 0; i < expr.length; i++) {
        if (!isNaN(expr[i]) && isFinite(expr[i])) {
            stack.push(parseFloat(expr[i]));

        } else {
            let a = stack.pop();
            let b = stack.pop();
            if (expr[i] === "+") {
                stack.push(a + b);
            } else if (expr[i] === "-") {
                stack.push(b - a);
            } else if (expr[i] === "*") {
                stack.push(a * b);
            } else if (expr[i] === "/") {
                stack.push(b / a);
            } else if (expr[i] === "^") {
                stack.push(Math.pow(b, a));
            }
        }
    }

    if (stack.length > 1) {
        return "ERROR";
    } else {
        return stack[0];
    }
}


let input = "";
const screen = document.getElementsByClassName("screen")[0];
function clickHandler(event) {
    const buttonText = event.target.textContent;
    if (!(event.target.classList.contains("key"))) return;
    if (buttonText == '=') {
        const res = evaluate(compile(input));
        console.log(res);
        screen.textContent = res;
        input = res;
    } else if (buttonText == 'C') {
        screen.textContent = input = "";
    } else {
        input += buttonText;
        screen.textContent += buttonText;
    }

}

window.onload = function () {
    document.getElementsByClassName('buttons')[0]
        .addEventListener('click', clickHandler);
};