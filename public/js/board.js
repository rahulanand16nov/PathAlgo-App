function Node(id, status) {
    this.id = id;
    this.status = status;
    this.distance = Infinity;
    this.direction = 'UP';
    this.totalDistance = Infinity;
    this.manhattanDistance = 0;
    this.parent = null;
  }

// Required Global Data
var boardArray = [];
var height;
var width;
var openList = []; // listToExplore 
var closedList = []; // ExploredList

function initialize(h,w){
  height = h;
  width = w;
  window.startId = "0-0";
  window.endId = `${height-1}-${width-1}`;
  createGrid(height,width);
  eventListeners(height,width);
}

function clearPath(){
  for(let r =0;r<height;r++){
    for(let c =0;c<width;c++ ){
      if(boardArray[r][c].status ===  "shortestPath" || boardArray[r][c].status === "visited"){
        document.getElementById(boardArray[r][c].id).className = "unvisited";
        boardArray[r][c].status = "unvisited";
      }
    }
  }
}

function AStarSearch(){
  let startX = parseInt(startId.split('-')[1]);
  let startY = parseInt(startId.split('-')[0]);
  let endX = parseInt(endId.split('-')[1]);
  let endY = parseInt(endId.split('-')[0]);

  boardArray[startY][startX].distance = 0;
  let startDist = boardArray[startY][startX].distance;
  boardArray[startY][startX].manhattanDistance = manhattanDistance(boardArray[startY][startX].id,boardArray[endY][endX].id);
  let startManDist = boardArray[startY][startX].manhattanDistance;
  boardArray[startY][startX].totalDistance = startDist + startManDist;
  // pushing start node to openList
  openList.push(boardArray[startY][startX]);

  while(openList.length){
    // Improve this code
    openList = openList.sort(function(node1,node2){
      if(node1.totalDistance === node2.totalDistance){
				return node1.manhattanDistance - node2.manhattanDistance
			}
			return (node1.totalDistance) - (node2.totalDistance)
    })
    let activeNode = openList[0];
    
    // If active node is the end node... break loop
    if(activeNode.status === "end"){
      closedList.push(activeNode);
      break;
    }

    // If active node turns out to be a brick... leave it out
    if(activeNode.status === "brick"){
      openList = openList.slice(1);
    } else if (!closedList.includes(activeNode)){
      if(activeNode.status === "end"){break;}
      let neighbours = getNeighbours(activeNode,closedList,boardArray[endY][endX]);
      openList = openList.concat(neighbours);
      openList = openList.slice(1);
      closedList.push(activeNode);
    } else {
      openList = openList.slice(1);
    }
  }
  console.log(closedList)
  startAnimation(closedList);

}

function startAnimation(closedList){
  for(let i = 1;i<closedList.length-1;i++){
    closedList[i].status = "visited";
    document.getElementById(closedList[i].id).className="visited";
  }
  let shortestPathList = [];
  let endNode = closedList[closedList.length-1];
  while(endNode !== closedList[0]){
		shortestPathList.push(endNode)
		endNode = endNode.parent
  }
  shortestPathList = shortestPathList.reverse();
  for(let i = 0;i<shortestPathList.length-1;i++){
    shortestPathList[i].status = "shortestPath";
    document.getElementById(shortestPathList[i].id).className="shortestPath";
  }
}



// Function that generate the grid
createGrid = function(height,width){
    let tableHTML = "";
  for (let r = 0; r < height; r++) {
    let currentArrayRow = [];
    let currentHTMLRow = `<tr id="row ${r}">`;
    let nodes={};
    for (let c = 0; c < width; c++) {
      let newNodeId = `${r}-${c}`, newNodeClass, newNode;
      if(r===0 && c===0){
        newNodeClass = "start"
      } else if (r===height-1 && c === width-1){
        newNodeClass = "end";
      } else {
        newNodeClass = "unvisited";
      }
      newNode = new Node(newNodeId, newNodeClass);
      currentArrayRow.push(newNode);
      currentHTMLRow += `<td id="${newNodeId}" class="${newNodeClass}"></td>`;
      nodes[`${newNodeId}`] = newNode;
    }
    boardArray.push(currentArrayRow);
    tableHTML += `${currentHTMLRow}</tr>`;
  }
  let board = document.getElementById("grid");
  board.innerHTML = tableHTML;
}

// Functions adds event listeners to the nodes
eventListeners = function(height,width){
    for(let r=0;r<height;r++){
        for(let c=0;c<width;c++){
            let currentId = `${r}-${c}`;
            let currentElement = document.getElementById(currentId);

            let ctrldown = false;
            let sdown = false;
            let edown = false;

            currentElement.addEventListener('mousedown',(e)=>{

              // Changing position of start node
              if(currentElement.className === "unvisited" && sdown === true){
                document.getElementById(startId).className = "unvisited";
                startId = currentId;
                currentElement.className = "start";
                boardArray[r][c].status = "start";
              }

              // Changing position of end node
              if(currentElement.className === "unvisited" && edown === true){
                document.getElementById(endId).className = "unvisited";
                endId = currentId;
                currentElement.className = "end";
                boardArray[r][c].status = "end";
              } 

              // Adding bricks
              if(currentId!==startId && currentId !== endId && currentElement.className!=="brick" && e.which===1 && sdown===false){
                currentElement.className="brick";
                boardArray[r][c].status = "brick";
              }

              // Removing bricks 
              if(currentElement.className === "brick" && ctrldown === true){
                currentElement.className = "unvisited";
                boardArray[r][c].status = "unvisited";
              }

            });

            // Handling keystrokes
            $(document).on({
              keydown: (e)=>{
                e.preventDefault();
                if(e.which===17){
                  ctrldown=true;
                }
                if(e.which===83){
                  sdown = true;
                }

                if(e.which===69){
                  edown = true;
                }
              },
              keyup: (e)=>{
              if(e.which===17){
                ctrldown=false;
              }
              if(e.which===83){
                sdown = false;
              }

              if(e.which === 69){
                edown = false;
              }
            }
            });
        }
    }
}

getNeighbours = function(activeNode,closedList,endNode){
  let neighList = [];
  let activeX = parseInt(activeNode.id.split('-')[1]);
  let activeY = parseInt(activeNode.id.split('-')[0]);

  // UP
  if(activeY - 1 >=0 && boardArray[activeY-1][activeX].status !== "brick" && closedList.includes(boardArray[activeY-1][activeX]) === false){
    let numberofMoves = checkNumberOfMoves(activeNode.direction,"UP");
    boardArray[activeY-1][activeX].manhattanDistance = manhattanDistance(boardArray[activeY-1][activeX].id,endId);
    let newNeighbourDistance = activeNode.distance + numberofMoves + 1;
    if(newNeighbourDistance < boardArray[activeY-1][activeX].distance){
			boardArray[activeY-1][activeX].distance = newNeighbourDistance;
      boardArray[activeY-1][activeX].direction = 'UP';
      boardArray[activeY-1][activeX].totalDistance = boardArray[activeY-1][activeX].manhattanDistance + boardArray[activeY-1][activeX].distance;
			neighList.push(boardArray[activeY-1][activeX]);
			boardArray[activeY-1][activeX].parent = activeNode;
		}
  }
  // DOWN
  if((activeY + 1) < height && boardArray[(activeY+1)][activeX].status !== "brick" && closedList.includes(boardArray[activeY+1][activeX]) === false){
    let numberofMoves = checkNumberOfMoves(activeNode.direction,"DOWN");
    boardArray[activeY+1][activeX].manhattanDistance = manhattanDistance(boardArray[activeY+1][activeX].id,endId);
    let newNeighbourDistance = activeNode.distance + numberofMoves + 1;
    if(newNeighbourDistance < boardArray[activeY+1][activeX].distance){
			boardArray[activeY+1][activeX].distance = newNeighbourDistance;
      boardArray[activeY+1][activeX].direction = 'DOWN';
      boardArray[activeY+1][activeX].totalDistance = boardArray[activeY+1][activeX].manhattanDistance + boardArray[activeY+1][activeX].distance;
			neighList.push(boardArray[activeY+1][activeX]);
			boardArray[activeY+1][activeX].parent = activeNode;
		}
  }
  // LEFT
  if(activeX - 1 >=0 && boardArray[activeY][activeX-1].status !== "brick" && closedList.includes(boardArray[activeY][activeX-1]) === false){
    let numberofMoves = checkNumberOfMoves(activeNode.direction,"LEFT");
    boardArray[activeY][activeX-1].manhattanDistance = manhattanDistance(boardArray[activeY][activeX-1].id,endId);
    let newNeighbourDistance = activeNode.distance + numberofMoves + 1;
    if(newNeighbourDistance < boardArray[activeY][activeX-1].distance){
			boardArray[activeY][activeX-1].distance = newNeighbourDistance;
      boardArray[activeY][activeX-1].direction = 'LEFT';
      boardArray[activeY][activeX-1].totalDistance = boardArray[activeY][activeX-1].manhattanDistance + boardArray[activeY][activeX-1].distance;
			neighList.push(boardArray[activeY][activeX-1]);
			boardArray[activeY][activeX-1].parent = activeNode;
		}
  }
  // RIGHT
  if(activeX + 1 < width && boardArray[activeY][activeX+1].status !== "brick" && closedList.includes(boardArray[activeY][activeX+1]) === false){
    let numberofMoves = checkNumberOfMoves(activeNode.direction,"RIGHT");
    boardArray[activeY][activeX+1].manhattanDistance = manhattanDistance(boardArray[activeY][activeX+1].id,endId);
    let newNeighbourDistance = activeNode.distance + numberofMoves + 1;
    if(newNeighbourDistance < boardArray[activeY][activeX+1].distance){
			boardArray[activeY][activeX+1].distance = newNeighbourDistance;
      boardArray[activeY][activeX+1].direction = 'RIGHT';
      boardArray[activeY][activeX+1].totalDistance = boardArray[activeY][activeX+1].manhattanDistance + boardArray[activeY][activeX+1].distance;
			neighList.push(boardArray[activeY][activeX+1]);
			boardArray[activeY][activeX+1].parent = activeNode;
		}
  }
  return neighList;
}


// Pretty understandable... right ? 
checkNumberOfMoves = function(currentDirection,direction){
	if(currentDirection === direction){
		return 0
	}
	else if((currentDirection === 'UP' || currentDirection === 'DOWN') && (direction === 'LEFT' || direction === 'RIGHT')){
		return 1
	}
	else if((currentDirection === 'LEFT' || currentDirection === 'RIGHT') && (direction === 'UP' || direction === 'DOWN')){
		return 1
	}
	else if((currentDirection === 'LEFT' || currentDirection === 'RIGHT') && (direction === 'LEFT' || direction === 'RIGHT')){
		return 2
	}
	else if((currentDirection === 'UP' || currentDirection === 'DOWN') && (direction === 'UP' || direction === 'DOWN')){
		return 2
	}
}




// Calculates Manhattan distance between two given nodes
function manhattanDistance(node1Id,node2Id){
  let node1X = parseInt(node1Id.split('-')[1]);
  let node1Y = parseInt(node1Id.split('-')[0]);
  let node2X = parseInt(node2Id.split('-')[1]);
  let node2Y = parseInt(node2Id.split('-')[0]);
  var xDiff = Math.abs(node1X - node2X);
  var yDiff = Math.abs(node1Y - node2Y);
	// var distance = Math.sqrt(Math.pow(xDiff,2)+Math.pow(yDiff,2));
	var sum = xDiff + yDiff;
	return sum;
}

