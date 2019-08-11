function Node(id, status) {
    this.id = id;
    this.status = status;
  }

var boardArray = [];

// Function that generate the grid
createGrid = function(height,width){
    let tableHTML = "";
  for (let r = 0; r < height; r++) {
    let currentArrayRow = [];
    let currentHTMLRow = `<tr id="row ${r}">`;
    this.nodes={};
    for (let c = 0; c < width; c++) {
      let newNodeId = `row:${r}-col:${c}`, newNodeClass, newNode;
      newNodeClass = "unvisited";
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

eventListeners = function(height,width){
    for(let r=0;r<height;r++){
        for(let c=0;c<width;c++){
            let currentId = `row:${r}-col:${c}`;
            let currentElement = document.getElementById(currentId);
            currentElement.addEventListener('mousedown',()=>{
                currentElement.className="brick";
                // For debugging purposes:
                console.log(`Added a brick to ${boardArray[r][c].id}`)
            });
        }
    }
}