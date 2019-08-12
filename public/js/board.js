function Node(id, status) {
    this.id = id;
    this.status = status;
  }

// Required Global Data
var boardArray = [];
var height;
var width;

function initialize(h,w){
  height = h;
  width = w;
  window.startId = "row:0-col:0";
  window.endId = `row:${height-1}-col:${width-1}`;
  createGrid(height,width);
  eventListeners(height,width);
}

// Function that generate the grid
createGrid = function(height,width){
    let tableHTML = "";
  for (let r = 0; r < height; r++) {
    let currentArrayRow = [];
    let currentHTMLRow = `<tr id="row ${r}">`;
    this.nodes={};
    for (let c = 0; c < width; c++) {
      let newNodeId = `row:${r}-col:${c}`, newNodeClass, newNode;
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
      this.nodes[`${newNodeId}`] = newNode;
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
            let currentId = `row:${r}-col:${c}`;
            let currentElement = document.getElementById(currentId);



            let ctrldown = false;
            let sdown = false;
            let edown = false;

            currentElement.addEventListener('mousedown',(e)=>{

              if(currentElement.className === "unvisited" && sdown === true){
                document.getElementById(startId).className = "unvisited";
                startId = currentId;
                currentElement.className = "start";
              }

              if(currentElement.className === "unvisited" && edown === true){
                console.log(endId);
                document.getElementById(endId).className = "unvisited";
                endId = currentId;
                currentElement.className = "end";
              } 

              if(currentId!==startId && currentId !== endId && currentElement.className!=="brick" && e.which===1 && sdown===false){
                currentElement.className="brick";
                //console.log(`Added a brick to ${boardArray[r][c].id}`);
              }

              if(currentElement.className === "brick" && ctrldown === true){
                currentElement.className = "unvisited";
                //console.log(`Removed brick from ${boardArray[r][c].id}`)
              }

            });

            $(document).on({
              keydown: (e)=>{
                e.preventDefault();
                // If ctrl key is pressed
                if(e.which===17){
                  ctrldown=true;
                }
                //if 's'is pressed
                if(e.which===83){
                  sdown = true;
                }

                if(e.which===69){
                  edown = true;
                }
              },
              keyup: (e)=>{
              // If ctrl key is pressed
              if(e.which===17){
                ctrldown=false;
              }
              //if 's'is pressed
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