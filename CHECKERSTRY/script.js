function createBoard() {
    let board = document.getElementById("board");
    for (let y = 0; y < 8; y++) {
        let row = document.createElement("div");
        row.className = "row";
        board.appendChild(row);
        for (let x = 0; x < 8; x++) {
            let square = document.createElement("div");
            square.id = x.toFixed() + y.toString();
            if ((x + y) % 2) {
                square.className = "bblack";
            }
            else {
                square.className = "bwhite";
            }

            if ((x + y) % 2 != 0 && y != 3 && y != 4) {
                let img = document.createElement("img");
                if (y < 3) {
                    img.id = "w" + square.id;
                    img.src = "whitePiece.png";
                }
                else {
                    img.id = "b" + square.id;
                    img.src = "blackPiece.png";
                }
                img.className = "piece";
                img.setAttribute("draggable", "true");
                square.appendChild(img);
            }

            square.setAttribute("draggable", "false");
            row.appendChild(square);
        }
    }
}

function allowDrop() {

    let squares = document.querySelectorAll('.bblack');
    let i = 0;
    while (i < squares.length) {
        let s = squares[i++];
        s.addEventListener('dragover', dragOver, false);
        s.addEventListener('drop', drop, false);
        s.addEventListener('dragenter', dragEnter, false);
        s.addEventListener('dragleave', dragLeave, false);
    }
    i = 0;
    let pieces = document.querySelectorAll('img');
    while (i < pieces.length) {
        let p = pieces[i++];
        p.addEventListener('dragstart', dragStart, false);
        p.addEventListener('dragend', dragEnd, false);
    }
}

function dragOver(e) {
    e.preventDefault();
    let dragID = e.dataTransfer.getData("text");
    let dragPiece = document.getElementById(dragID);
    if (dragPiece) {
        if (e.target.tagName === "DIV" &&
            isValidMove(dragPiece, e.target, false)) {
            e.dataTransfer.dropEffect = "move";
        }
        else {
            e.dataTransfer.dropEffect = "none";
        }
    }
}
function dragStart(e) {
    if (e.target.draggable) {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text", e.target.id);
        e.target.classList.add("selected");
        let dragIcon = document.createElement("img");
        dragIcon.src = "Images/smiley.jpg";
        e.dataTransfer.setDragImage(dragIcon, 0, 0);
    }
}
function dragEnd(e) {
    e.target.classList.remove("selected");
}

function dragEnter(e) {
    let dragID = e.dataTransfer.getData("text");
    let dragPiece = document.getElementById(dragID);
    if (dragPiece &&
        e.target.tagName === "DIV" &&
        isValidMove(dragPiece, e.target, false)) {
        e.target.classList.add('drop');
    }
}

function dragLeave(e) {
    e.target.classList.remove("drop");
}

function drop(e) {
    e.stopPropagation();
    e.preventDefault();
    let droppedID = e.dataTransfer.getData("text");
    let droppedPiece = document.getElementById(droppedID);
    if (droppedPiece &&
        e.target.tagName === "DIV" &&
        isValidMove(droppedPiece, e.target, true)) {
        let newPiece = document.createElement("img");
        newPiece.src = droppedPiece.src;
        newPiece.id = droppedPiece.id.substr(0, 1) + e.target.id;
        newPiece.draggable = droppedPiece.draggable;
        if (droppedPiece.draggable) {
            newPiece.classList.add("jumpOnly");
        }
        newPiece.classList.add("piece");
        newPiece.addEventListener("dragstart", dragStart, false);
        newPiece.addEventListener("dragend", dragEnd, false);
        e.target.appendChild(newPiece);
        droppedPiece.parentNode.removeChild(droppedPiece);
    }
    kingMe(newPiece);
}


function isValidMove(source, target, drop) {
    let startPos = source.id.substr(1, 2);
    let prefix = source.id.substr(0, 1);
    let endPos = target.id;
    if (endPos.length > 2) {
        endPos = endPos.substr(1, 2);
    }
    if (startPos === endPos) {
        return false;
    }
    if (target.childElementCount != 0) {
        return false;
    }
    let jumpOnly = false;
    if (source.classList.contains("jumpOnly")) {
        jumpOnly = true;
    }
    let xStart = parseInt(startPos.substr(0, 1));
    let yStart = parseInt(startPos.substr(1, 1));
    let xEnd = parseInt(endPos.substr(0, 1));
    let yEnd = parseInt(endPos.substr(1, 1));
    switch (prefix) {
        case "w":
            if (yEnd <= yStart)
                return false;
            break;
        case "b":
            if (yEnd >= yStart)
                return false;
            break;
    }
    if (yStart === yEnd || xStart === xEnd)
        return false;
    if (Math.abs(yEnd - yStart) > 2 || Math.abs(xEnd - xStart) > 2)
        return false;

    if (Math.abs(xEnd - xStart) === 1 && jumpOnly)
        return false;
    let jumped = false;
    if (Math.abs(xEnd - xStart) === 2) {
        let pos = ((xStart + xEnd) / 2).toString() +
            ((yStart + yEnd) / 2).toString();
        let div = document.getElementById(pos);
        if (div.childElementCount === 0)
            return false;
        let img = div.children[0];
        if (img.id.substr(0, 1).toLowerCase() === prefix.toLowerCase())
            return false;
        if (drop) {
            div.removeChild(img);
            jumped = true;
        }
    }
    if (drop) {
        enableNextPlayer(source);
        if (jumped) {
            source.draggable = true;
            source.classList.add("jumpOnly");
        }
    }
    return true;
}

function kingMe(piece) {

    if (piece.id.substr(0, 1) === "W" || piece.id.substr(0, 1) === "B")
        return;
    let newPiece;
    if (piece.id.substr(0, 1) === "w" && piece.id.substr(2, 1) === "7") {
        newPiece = document.createElement("img");
        newPiece.src = "WhiteKing.png";
        newPiece.id = "W" + piece.id.substr(1, 2);
    }

    if (piece.id.substr(0, 1) === "b" && piece.id.substr(2, 1) === "0") {
        let newPiece = document.createElement("img");
        newPiece.src = "BlackKing.png";
        newPiece.id = "B" + piece.id.substr(1, 2);
    }

    if (newPiece) {
        newPiece.draggable = true;
        newPiece.classList.add("piece");
        newPiece.addEventListener('dragstart', dragStart, false);
        newPiece.addEventListener('dragend', dragEnd, false);
        let parent = piece.parentNode;
        parent.removeChild(piece);
        parent.appendChild(newPiece);
    }
}

function enableNextPlayer(piece) {

    let pieces = document.querySelectorAll('img');
    let i = 0;
    while (i < pieces.length) {
        let p = pieces[i++];

        if (p.id.substr(0, 1).toUpperCase() ===
            piece.id.substr(0, 1).toUpperCase()) {
            p.draggable = false;
        }
        else {
            p.draggable = true;
        }
        p.classList.remove("jumpOnly");
    }
}
 
createBoard();
allowDrop();