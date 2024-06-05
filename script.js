const mazeElement = document.getElementById('maze');
var timeing = 50;

var startCell = [0, 0]
var endCell = [15, 15]

var backtrackingSteps = 0;
var recursiveDescent = 0;

var canBuild = false;
var buildType = 1



const maze = [
    [1, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 1, 1, 1]
];

var maze_save = []

function updateCell(type, row, colume) {
    const cell = document.createElement('div');
    cell.classList.add('cell', type, "bg-transition");
    if (type != "wall-cell") {
        cell.classList.add('cell', "normal-cell");
    }
    cell.setAttribute("row", row)
    cell.setAttribute("colume", colume)

    mazeElement.appendChild(cell);
}

function updateMaze(maze) {
    mazeElement.innerHTML = '';
    for (let row = 0; row < maze.length; row++) {
        for (let colume = 0; colume < maze[row].length; colume++) {

            if (maze[row][colume] == 0) { // unvisited cell
                updateCell("normal-cell", row, colume);
            } else if (maze[row][colume] == 1) { // wall cell
                updateCell("wall-cell", row, colume);
            } else if (maze[row][colume] == 3) { // line cell
                updateCell("line-cell", row, colume);
            } else if (maze[row][colume] == 4) { // wrong way cell
                updateCell("wrong-cell", row, colume);
            } else if (maze[row][colume] == 6) { // start cell
                updateCell("start-cell", row, colume);
            } else if (maze[row][colume] == 7) { // goal cell
                updateCell("goal-cell", row, colume);
            }

        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function solveMaze(maze, row, colume, toa) {
    recursiveDescent++;
    document.getElementById("recursiveDescent").innerHTML = recursiveDescent
    // console.log(`Exploring row ${row}, colume ${colume}`);

    // if (toa) console.log(toa)

    if (maze[row][colume] === 7) {
        console.log('Exit found!');
        await sleep(timeing * 2)
        return true;
    } else if (maze[row][colume] === 0 || maze[row][colume] === 6) {
        maze[row][colume] = 3; // Mark current cell as part of the path (magenta)
        updateMaze(maze);
        await sleep(timeing); // Add delay to visualize the process

        // check if avalible cell is nearby
        if (row < maze.length - 1 && await solveMaze(maze, row + 1, colume, "down")) {
            maze[row][colume] = 7
            updateMaze(maze)
            await sleep(timeing / 2)
            return true;
        }
        if (row > 0 && await solveMaze(maze, row - 1, colume, "up")) {
            maze[row][colume] = 7
            updateMaze(maze)
            await sleep(timeing / 2)
            return true;
        }
        if (colume < maze[row].length - 1 && await solveMaze(maze, row, colume + 1, "right")) {
            maze[row][colume] = 7
            updateMaze(maze)
            await sleep(timeing / 2)
            return true;
        }
        if (colume > 0 && await solveMaze(maze, row, colume - 1, "left")) {
            maze[row][colume] = 7
            updateMaze(maze)
            await sleep(timeing / 2)
            return true;
        }

        // Backtrack:
        maze[row][colume] = 4; // Mark as visited but not the correct path
        backtrackingSteps++;
        document.getElementById("backtrackingSteps").innerHTML = backtrackingSteps
        updateMaze(maze);
        await sleep(timeing);
    }

    return false;
}

// Initialize and draw the maze
async function init() {
    await updateMaze(maze); // first maze draw
    await sleep(1000)

    // for easy change of maze
    Array.from(mazeElement.children).forEach((e, i) => {
        e.addEventListener("click", () => {
            if (buildType == 0) {
                e.classList.remove("wall-cell", "goal-cell", "start-cell")
                e.classList.add("normal-cell")
            } else if (buildType == 1) {
                e.classList.remove("normal-cell", "goal-cell", "start-cell")
                e.classList.add("wall-cell")
            } else if (buildType == 6) {
                e.classList.remove("normal-cell", "wall-cell", "goal-cell")
                e.classList.add("start-cell")
            } else if (buildType == 7) {
                e.classList.remove("normal-cell", "wall-cell", "start-cell")
                e.classList.add("goal-cell")
            }
            maze[e.getAttribute("row")][e.getAttribute("colume")] = buildType



        })
    })

    // enable button -- init finished
    document.getElementById("start_button").disabled = false

    document.getElementById("builder_wall_button").disabled = true // selected by default
    document.getElementById("builder_tile_button").disabled = false
    document.getElementById("builder_start_button").disabled = false
    document.getElementById("builder_finish_button").disabled = false
    canBuild = true
}

init()



async function start() {

    for (let row = 0; row < maze.length; row++) {
        for (let colume = 0; colume < maze[row].length; colume++) {
            if (maze[row][colume] == 6) {
                startCell = [row, colume]
            }
            if (maze[row][colume] == 7) {
                endCell = [row, colume]
            }
        }
    }

    document.getElementById("start_button").disabled = true
    const solved = await solveMaze(maze, startCell[0], startCell[1]);
    if (solved) {
        console.log("Maze Solved");
        document.getElementById("reset_button").disabled = false
    } else {
        console.log("Cannot Solve Maze");
        document.getElementById("reset_button").disabled = false
    }
}

async function reset() {
    document.getElementById("reset_button").disabled = true
    for (let row = 0; row < maze.length; row++) {
        for (let colume = 0; colume < maze[row].length; colume++) {
            if (maze[row][colume] == 3) {
                maze[row][colume] = 0
            } else if (maze[row][colume] == 4) {
                maze[row][colume] = 0
            } else if (maze[row][colume] == 6) {
                maze[row][colume] = 0
            } else if (maze[row][colume] == 7) {
                maze[row][colume] = 0
            }

            maze[startCell[0]][startCell[1]] = 6
            maze[endCell[0]][endCell[1]] = 7
        }
    }

    backtrackingSteps = 0;
    document.getElementById("backtrackingSteps").innerHTML = backtrackingSteps
    recursiveDescent = 0;
    document.getElementById("recursiveDescent").innerHTML = recursiveDescent

    init()
}

function changeTheme() {
    const root = document.documentElement;
    root.classList.toggle('theme-light');
    root.classList.toggle('theme-dark');
}
changeTheme()


function builder(e, type) {

    if (canBuild) {
        buildType = type

        document.getElementById("builder_wall_button").disabled = false
        document.getElementById("builder_tile_button").disabled = false
        document.getElementById("builder_start_button").disabled = false
        document.getElementById("builder_finish_button").disabled = false
        e.disabled = true
    }
}