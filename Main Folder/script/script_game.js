
var spieler = {htmlelement:document.getElementById("spieler"), gridRow:8, gridColumn:3, keyCollected:0, offsetX:0, offsetY:10};

var schluessel = {htmlelement:document.getElementById("keyOnGamePage"), gridRow:8, gridColumn:5, color:"orange", offsetX:0, offsetY:14};

// spielfeldArray[zeile][spalte] --> 0 = frei, 1 = wand, 2 = schluessel, 3 = tuer
var spielfeldArray=[
	[1,1,1,1,3,1,1,1,1],
	[1,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,1],
	[1,0,0,1,1,1,0,0,1],
	[1,0,0,0,1,0,0,0,1],
	[1,0,0,0,1,0,0,0,1],
	[1,0,0,0,1,0,0,0,1],
	[1,0,0,0,1,0,0,0,1],
	[1,1,1,1,1,1,1,1,1]
];

/**
 * The amount of pixels each step of the player should take calculated from the height of the game field.
 */
var stepSize = document.getElementById("gamedisplay").clientHeight/10;

updateAllPositions();

// Register events
document.addEventListener("keydown", onKeyPressed);
window.addEventListener("resize", onResize, true);

function onKeyPressed(e){
	if(e.code=='KeyW'){
		movePlayerUp();
	}else if(e.code=='KeyS'){
		movePlayerDown();
	}else if(e.code=='KeyA'){
		movePlayerLeft();
	}else if(e.code=='KeyD'){
		movePlayerRight();
	}
	checkForKey(spieler, schluessel);
	playerOnButton(spieler.htmlelement.getBoundingClientRect(), "index", "index.html");
	playerOnButton(spieler.htmlelement.getBoundingClientRect(), "tutorial", "tutorial.html");
	playerOnButton(spieler.htmlelement.getBoundingClientRect(), "impressum", "impressum.html");
}

/**
 * Updates the {@link stepSize} and the positions of Objects
 * @param {event} e 
 */
 function onResize(e){
	stepSize = document.getElementById("gamedisplay").clientHeight/10;
	updateAllPositions();
}

/**
 * 
 * @param {int} row The row of the move to check
 * @param {int} column The column of the move to check
 * @returns boolean, if the move is valid
 */
function isMoveValid(row, column) {
	if(row<0 || row>9 || column<0 || column>8) return true;
	if (spielfeldArray[row][column] != 1) {
		return checkForDoor(row, column);
	}
}

function movePlayerUp() {
	if (isMoveValid(spieler.gridRow - 1, spieler.gridColumn)) {
		spieler.gridRow -= 1;
		updateObjectPosition(spieler);
	}
}

function movePlayerDown() {
	if (isMoveValid(spieler.gridRow + 1, spieler.gridColumn)) {
		spieler.gridRow += 1;
		updateObjectPosition(spieler);
	}
}

function movePlayerLeft() {
	if (isMoveValid(spieler.gridRow, spieler.gridColumn - 1)) {
		spieler.gridColumn -= 1;
		updateObjectPosition(spieler);
	}
}

function movePlayerRight() {
	if (isMoveValid(spieler.gridRow, spieler.gridColumn + 1)) {
		spieler.gridColumn += 1;
		updateObjectPosition(spieler);
	}
}

function updateAllPositions() {
	updateObjectPosition(spieler);
	updateObjectPosition(schluessel);
}

/**
 * Updates the position of a game object relative to the 0 0 cell in the grid.
 * objectOffset+objectRow*{@link stepSize} in pixel
 * @param {gameObject} object 
 */
function updateObjectPosition(object) {
	object.htmlelement.style.left=(object.offsetX+(object.gridColumn*stepSize))+"px";
	object.htmlelement.style.top=(object.offsetY+(object.gridRow*stepSize))+"px";
}

/**
 * Checks if a key is collected and deletes the html element
 * @param {spieler} spieler 
 * @param {schluessel} schluessel 
 * @returns Nothing
 */
function checkForKey(spieler, schluessel){
	if(schluessel==null || spieler==null) return;
	if(schluessel.gridColumn==spieler.gridColumn && schluessel.gridRow==spieler.gridRow){
		spieler.keyCollected=1;
		schluessel.htmlelement.remove();
		schluessel=null;
	}
}

function checkForDoor(row, column){
	if(spielfeldArray[row][column]==3){
		if(spieler.keyCollected==1){
			return true;
		}else{
			return false;
		}
	}else{
		return true;
	}
}

/**
 * Executes if the id button intersects with the player
 * @param {DOMRect} playerBB The bounding box of the player
 * @param {String} id Id of the html element to check
 * @param {String} url The url to open when the player steps on the button
 */
function playerOnButton(playerBB, id, url){
	var element=document.getElementById(id);
	var rect = element.getBoundingClientRect();
	if(intersect(playerBB, rect, 5, 0))
		window.open(url, "_self");
}

/**
 * Checks if 2 html elements intersect
 * Code template from https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection#aabb_vs._aabb
 * @param {DOMRect} a 
 * @param {DOMRect} b 
 * @param {int} threshholdA Shrinks the bounding box for A to allow for a softer collision detection
 * @param {int} threshholdB Shrinks the bounding box for B to allow for a softer collision detection
 * @returns If both html elements intersect
 */
function intersect(a, b, threshholdA, threshholdB) {
	return (a.left+threshholdA <= b.right-threshholdB && a.right-threshholdA >= b.left+threshholdB) &&
		(a.top+threshholdA <= b.bottom-threshholdB && a.bottom-threshholdA >= b.top+threshholdB)
}