var socket = io();
var code = document.getElementById('code');
var passcode = -1;
socket.on('pass', (room) => {
    code.innerText = room;
    passcode = room;
})
$('form').submit( (e) => {
    e.preventDefault();
    socket.emit('pass', $('#passcode').val());
    return false;
});

let setColor = document.querySelector('#input-color');
let setStroke = document.querySelector('#input-stroke');
let setBtnColor = document.querySelector('#set-color');
let setStrokeLineCapStyle = document.querySelector('#strokeStyleId');
let clearCanvas = document.querySelector('#clear-canvas');
let hueColor = document.querySelector('input[name=gradientColor]');

var resultColor = '#000';
var resultStrokeLineCap = "round";
var resultStroke = 10;
var hueColorChecker = false;
var eraser = false;

let hue = 0;

setColor.addEventListener('change', () => {
    resultColor = setColor.value;
});
setStroke.addEventListener('click', () => {
    resultStroke = setStroke.value;
});

strokeSizeCheckbox = document.getElementById('strokeSizeCheckbox');

strokeSizeCheckbox.addEventListener('click', () => {
    console.log('hi');
    erase = false;
});

if (document.querySelector('input[name="checking"]')) {
    document.querySelectorAll('input[name="checking"]').forEach((elem) => {
        elem.addEventListener("click", function(event) {
            var item = event.target.value;
            if (event.target.value == "eraser") {
                eraser = true;
            } else {
                eraser = false;
            }
        });
    });
}

hueColor.addEventListener('change', (e) => {
    if (hueColor.checked) {
        console.log("checked ");
        hueColorChecker = true;
    } else {
        console.log("not checked");
        hueColorChecker = false;
    }
})

window.addEventListener("load", () => {
    const canvas = document.querySelector("#canvas");
    const context = canvas.getContext("2d");

    //resizing
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    // context.beginPath();
    // context.moveTo(100, 100);
    // context.lineTo(200, 100);
    // context.stroke();

    //variables
    let painting = false;
    let lastX = -1;
    let lastY = -1;
    function startPosition(e) {
        painting = true;
        context.beginPath();
        draw(e)
    }

    function finishedPosition(e) {
        painting = false;
        lastX = lastY = -1;
        context.beginPath();
    }
    var oldColor;
    function draw(e) {
        if (!painting) return;

        if (hueColorChecker) {
            context.strokeStyle = `hsl(${hue}, 100%, 50%)`;
        }

        context.lineWidth = resultStroke;
        context.lineCap = resultStrokeLineCap;

        context.lineTo(e.clientX, e.clientY);
        
        if (!hueColorChecker) {
            context.strokeStyle = resultColor;
        }
        if (eraser) {
            context.strokeStyle = `hsl(0,0%,100%)`;
            console.log(context.strokeStyle);
        }

        context.stroke();

        context.beginPath();
        context.moveTo(e.clientX, e.clientY);

        if (lastX != -1 && lastY != -1) {
            socket.emit('move', {id: passcode, status: "draw", x1: lastX, y1: lastY, x2: e.clientX, y2: e.clientY, width: resultStroke, color: context.strokeStyle});
        }

        lastX = e.clientX;
        lastY = e.clientY;
        oldColor = context.strokeStyle;
        hue++;
        if (hue >= 360) {
            hue = 0;
        }
    }

    //eventListener
    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", finishedPosition);
    canvas.addEventListener("mousemove", draw);

    function special_draw(res) {
        context.lineWidth = res.width;
        context.lineCap = resultStrokeLineCap;
        console.log(res);
        context.beginPath();
        context.moveTo(res.x1, res.y1);
        context.lineTo(res.x2, res.y2);
        context.strokeStyle = res.color;
        context.stroke();
        context.moveTo(lastX, lastY);
        context.strokeStyle = oldColor;
    }
    socket.on('move', (res) => {
        if (res.status == "draw") {
            special_draw(res);
        }
    });
});

window.addEventListener("resize", () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
});

clearCanvas.addEventListener('click', () => {
    canvas.width = canvas.width;
});