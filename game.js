var canvas = document.getElementById('tetris');
var ctx = canvas.getContext('2d');
ctx.scale(20,20);

const tblock = [
    [0,0,0],
    [1,1,1],
    [0,1,0],
];

const iblock = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [2,2,2,2]
];

const oblock = [
    [3,3],
    [3,3]
];

const jblock = [
    [0,0,0],
    [4,0,0],
    [4,4,4]
];

const lblock = [
    [0,0,0],
    [0,0,5],
    [5,5,5]
];

const sblock = [
    [0,0,0],
    [0,6,6],
    [6,6,0]
];

const zblock = [
    [0,0,0],
    [7,7,0],
    [0,7,7]
];

const blocksfactory = [
    tblock,
    iblock,
    oblock,
    jblock,
    lblock,
    sblock,
    zblock
];

const colors = [
    "#9932CC",
    "#00FFFF",
    "#FFFF00",
    "#FF00FF",
    "#FFD700",
    "#7CFC00",
    "#DC143C"
];


function create() {
    //create block randomly
    var rand = Math.floor(Math.random() * blocksfactory.length);
    var block = blocksfactory[rand];
    var curr = {
        posn: {x:grid[0].length/2,
               y:0},
        block: block
    };
    if (collide(grid,curr)) {
        alert("Game Over");
        grid = init(12,20);
    }
    return curr;
}

function merge(grid,block) {
    //merge curr block to grid
    for (var i = 0; i < block.length; ++i) {
        for (var j = 0; j < block[i].length; ++j) {
            if (block[i][j] !== 0) {
                grid[i+curr.posn.y][j+curr.posn.x] = block[i][j];
            }
        }
    }
}

function collide(matrix,object) {
    const [block, posn] = [object.block,object.posn];
    for (var i = 0; i < block.length; ++i) {
        for (var j = 0; j < block[i].length; ++j) {
            if (block[i][j] !== 0 && (matrix[i+posn.y] && matrix[i+posn.y][j+posn.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

var score = 0;

function init(width,height) {
    score = 0;
    var matrix = [];
    for (var i = 0; i < height; ++i) {
        matrix.push(new Array(width).fill(0));
    }
    return matrix;
}

function collectRows() {
    var accum = 1;
    rowcheck: for (var i = grid.length - 1; i >= 0; --i) {
        for (var j = 0; j < grid[i].length; ++j) {
            if (grid[i][j] === 0) {
                continue rowcheck;
            }
        }
        shiftRows(i);
        ++i;
        score += accum * 100;
        accum *= 2;
    }
}

function shiftRows(start) {
    for (var i = start; i > 0; --i) {
        grid[i] = grid[i-1];
    }
    grid[0] = new Array(grid[0].length).fill(0);
}
var grid = init(12,20);
console.table(grid);
var curr = create();

function printGrid() {
    ctx.fillStyle = "#00008B";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    drawBlock(grid,{x:0,y:0});
    drawBlock(curr.block,curr.posn);
}

function updateScore() {
    document.getElementById('score').innerText = score;
}

function drawBlock(block,posn) {
    for (var i = 0; i < block.length; ++i) {
        for (var j = 0; j < block[i].length; ++j) {
            if (block[i][j] !== 0) {
                ctx.fillStyle = colors[block[i][j] - 1];
                ctx.fillRect(j + posn.x, i + posn.y, 1, 1);
            }
        }
    }
}

function move(direction) {
    curr.posn.x += direction;
    if (collide(grid,curr)) {
        curr.posn.x -= direction;
    }
}

function moveDown() {
    ++curr.posn.y;
    if (collide(grid,curr)) {
        --curr.posn.y;
        merge(grid,curr.block);
        collectRows();
        curr = create();
    }
    dropCountDown = dropInterval;
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
        moveDown();
    }
    printGrid();
    updateScore();
    requestAnimationFrame(update);
}

update();

function rotate(block) {
    const original = {block:block, x:curr.posn.x};
    var offset = 1;
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
    while (collide(grid,curr)) {
        curr.posn.x += offset;
        //move to opposite direction
        offset = -(offset + (offset > 0? 1 : -1));
        if (offset > block.length) {
            curr.block = original.block;
            curr.posn.x = original.x;
            break;
        }
    }
}

const LEFT = 37;
const RIGHT = 39;
const DOWN = 40;
const ROTATE = 82;

document.addEventListener('keydown', event => {
    if (event.keyCode === LEFT) move(-1);
    if (event.keyCode === RIGHT) move(1);
    if (event.keyCode === DOWN) {
        moveDown();
    }
    if (event.keyCode === ROTATE) rotate(curr.block);
});

