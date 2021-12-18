var spieler = document.getElementById("spieler");
var spielerGridRow = 9; 
var spielerGridColumn = 4; 

var schluessel = document.getElementById("keyOnGamePage");
var keyCollected = false;

function onKeyPressed(e){
	if(e.code=='KeyW' || e.code=='ArrowUp'){
		movePlayerUp();
	}else if(e.code=='KeyS' || e.code=='ArrowDown'){
		movePlayerDown();
	}else if(e.code=='KeyA' || e.code=='ArrowLeft'){
		movePlayerLeft();
	}else if(e.code=='KeyD' || e.code=='ArrowRight'){
		movePlayerRight();
	}
}

// Register events
document.addEventListener("keydown", onKeyPressed);


//spielfeldArray[zeile][spalte] --> 0 = frei, 1 = wand, 2 = schluessel, 3 = tuer
var spielfeldArray=[
	[1,1,1,1,3,1,1,1,1],
	[1,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,1],
	[1,0,0,1,1,1,0,0,1],
	[1,0,0,0,1,0,0,0,1],
	[1,0,0,0,1,0,0,0,1],
	[1,0,0,0,1,0,0,0,1],
	[1,0,0,0,1,2,0,0,1],
	[1,1,1,1,1,1,1,1,1]
];

// var spielfeldArray = [9];
// for (let i = 0; i < 9; i++) {
// 	spielfeldArray[i] = [10];
// 	for (let j = 0; j < 10; j++) {
// 		switch(i) {
// 			case 0:
// 				spielfeldArray[j][i] = 1;
// 				break;
// 			case 1:	
// 			case 2:
// 				if (j == 0 || j == 9) {
// 					spielfeldArray[j][i] = 1;
// 				} else {
// 					spielfeldArray[j][i] = 0;
// 				}
// 				break;
// 			case 3:
// 				if (j == 0 || j == 4 || j == 8) {
// 					spielfeldArray[j][i] = 1;
// 				} else {
// 					spielfeldArray[j][i] = 0;
// 				}
// 				break;
// 			case 4:
// 				if (j == 0) {
// 					spielfeldArray[j][i] = 3;
// 					break;
// 				} 
// 				if (j == 1 || j == 2 || j == 3) {
// 					spielfeldArray[j][i] = 0;
// 				} else {
// 					spielfeldArray[j][i] = 1;
// 				}
// 				break;
// 			case 5:
// 				if (j == 8) {
// 					spielfeldArray[j][i] = 2;
// 					break;
// 				}
// 				if (j == 0 || j == 4 || j == 8) {
// 					spielfeldArray[j][i] = 1;
// 				} else {
// 					spielfeldArray[j][i] = 0;
// 				}
// 				break;
// 			case 6:
// 			case 7:
// 				if (j == 0 || j == 9) {
// 					spielfeldArray[j][i] = 1;
// 				} else {
// 					spielfeldArray[j][i] = 0;
// 				}
// 				break;
// 			case 8:
// 				spielfeldArray[j][i] = 1;
// 				break;
// 		}
// 	}
// }

function isMoveValid(direction) {
	switch(direction) {
		case "up":
			if (spielfeldArray[spielerGridRow - 1 - 1][spielerGridColumn - 1] == 3) {
				if(keyCollected){
					spieler.remove();
					return true;
				}
			}
			if (spielfeldArray[spielerGridRow - 1 - 1][spielerGridColumn - 1] == 0) {
				return true;
			}
			return false;
		case "down":
			if (spielfeldArray[spielerGridRow - 1 + 1][spielerGridColumn - 1] == 2) {
				keyCollected = true;
				schluessel.remove();
				return true;
			}
			if (spielfeldArray[spielerGridRow - 1 + 1][spielerGridColumn - 1] == 0) {
				return true;
			}
			return false;
		case "left":
			if (spielfeldArray[spielerGridRow - 1][spielerGridColumn - 1 - 1] == 2) {
				keyCollected = true;
				schluessel.remove();
				return true;
			}
			if (spielfeldArray[spielerGridRow - 1][spielerGridColumn - 1 - 1] == 0) {
				return true;
			}
			return false;
		case "right":
			if (spielfeldArray[spielerGridRow - 1][spielerGridColumn - 1 + 1] == 0) {
				return true;
			}
			return false;
	}
}

function movePlayerUp() {
	if (isMoveValid("up") == true) {
		spielerGridRow -= 1;
		spieler.setAttribute("style", "grid-row:" + spielerGridRow + "/" + (spielerGridRow + 1) + "; grid-column: " + spielerGridColumn + "/" + (spielerGridColumn + 1) + ";");
	} 
}

function movePlayerDown() {
	if (isMoveValid("down") == true) {
		spielerGridRow += 1;
		spieler.setAttribute("style", "grid-row:" + spielerGridRow + "/" + (spielerGridRow + 1) + "; grid-column: " + spielerGridColumn + "/" + (spielerGridColumn + 1) + ";");
	} 
}

function movePlayerLeft() {
	if (isMoveValid("left") == true) {	
		spielerGridColumn -= 1;
		spieler.setAttribute("style", "grid-column:" + spielerGridColumn + "/" + (spielerGridColumn + 1) + "; grid-row: " + spielerGridRow + "/" + (spielerGridRow + 1) + ";");
	} 
}

function movePlayerRight() {
	if (isMoveValid("right") == true) {
		spielerGridColumn += 1;
		spieler.setAttribute("style", "grid-column:" + spielerGridColumn + "/" + (spielerGridColumn + 1) + "; grid-row: " + spielerGridRow + "/" + (spielerGridRow + 1) + ";");
	}
}

