var canvas = document.getElementById('tetris');
var ctx = canvas.getContext('2d');
ctx.scale(20,20);

var tblock = [
    [0,0,0],
    [1,1,1],
    [0,1,0],
];

var curr = {
    posn: {x:4, y:0},
    block: tblock,
}

function printGrid() {
    ctx.fillStyle = "#00008B";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    drawBlock(curr.block,curr.posn);
}

function drawBlock(block,posn) {
    for (var i = 0; i < block.length; ++i) {
        for (var j = 0; j < block[i].length; ++j) {
            if (block[i][j] == 1) {
                ctx.fillStyle = "yellow";
                ctx.fillRect(j + posn.x, i + posn.y, 1, 1);
            }
        }
    }
}

const dropInterval = 1000; //easy level
let dropCountDown = dropInterval;

let lastTime = 0;

function update(time = 0) {
    //console.log(time);
    const timeElapsed = time - lastTime;
    dropCountDown -= timeElapsed;
    lastTime = time;
    if (dropCountDown < 0) {
        ++curr.posn.y;
        dropCountDown = dropInterval;
    }
    printGrid();
    requestAnimationFrame(update);
}

update();

function rotate(block) {
    var len = block.length;
    for (var i = 0; i < len/2; ++i) {
        for (var j = i; j < len-i-1; ++j) {
            //keep top values
            var temp = block[i][j];
            //move values right to top
            block[i][j] = block[j][len-i-1];
            //move values bottom to right
            block[j][len-i-1] = block[len-i-1][len-j-1];
            //move values left to bottom
            block[len-i-1][len-j-1] = block[len-j-1][i];
            //assign left to original top
            block[len-j-1][i] = temp;
        }
    }
}

const LEFT = 37;
const RIGHT = 39;
const DOWN = 40;
const ROTATE = 82;

document.addEventListener('keydown', event => {
    if (event.keyCode === LEFT) --curr.posn.x;
    if (event.keyCode === RIGHT) ++curr.posn.x;
    if (event.keyCode === DOWN) {
        ++curr.posn.y;
        dropCountDown = dropInterval;
    }
    if (event.keyCode === ROTATE) rotate(curr.block);
});

