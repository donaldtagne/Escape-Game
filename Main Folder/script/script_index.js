
/**
 * Die Anzahl der Pixel die der Spieler zurücklegt, wenn er einen Schritt macht
 */
var stepSize = updateStepSize();

var urlSearchParams = new URLSearchParams(window.location.search); //https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
const params = Object.fromEntries(urlSearchParams.entries());	//Loads the search queries from the url

/**
 * Das Spieler Objekt
 * @type {GameObject}
 * @property {number} spieler.keyCollected Speichert ob der Spieler einen Schlüssel eingesammelt hat. 0=Kein Schlüssel, 1=Erster Schlüssel, 2=Zweiter Schlüssel
 */
var spieler = loadPlayerFromSearchQueries(params);

//Setzt die Position des Schlüssels und des Spielers
updateAllPositions();

//Events registrieren
document.addEventListener("keydown", onKeyPressed);
window.addEventListener("resize", onResize, true);
if(spieler!=null){
	document.getElementById("key_top").addEventListener("click", movePlayerUp);
	document.getElementById("key_left").addEventListener("click", movePlayerLeft);
	document.getElementById("key_right").addEventListener("click", movePlayerRight);
	document.getElementById("key_down").addEventListener("click", movePlayerDown);
}
function onKeyPressed(e) {
	if (e.code == 'KeyW') {
		movePlayerUp();
	} else if (e.code == 'KeyS') {
		movePlayerDown();
	} else if (e.code == 'KeyA') {
		movePlayerLeft();
	} else if (e.code == 'KeyD') {
		movePlayerRight();
	} else if (e.code == 'ArrowUp') {
		movePlayerUp();
	} else if (e.code == 'ArrowLeft') {
		movePlayerLeft();
	} else if (e.code == 'ArrowRight') {
		movePlayerRight();
	} else if (e.code == 'ArrowDown') {
		movePlayerDown();
	}
}

/**
 * Updated {@link stepSize} und die Position des Objektes
 * @param {event} e Resize Event
 */
function onResize(e) {
	var stepSize = updateStepSize();	// Updated die stepSize
	if(spieler!=null){
		spieler.offsetY = stepSize / 10;
	}
	updateAllPositions();
}

function updateStepSize(){
	return (document.getElementById("fakefield").clientWidth / 90) * 10;
}

function movePlayerUp() {
	if (spieler != null) {
		if (isMoveValid(spieler.gridRow - 1, spieler.gridColumn)) {
			spieler.gridRow -= 1;
			updatePlayer();
		}
	}
}

function movePlayerDown() {
	if (spieler != null) {
		if (isMoveValid(spieler.gridRow + 1, spieler.gridColumn)) {
			spieler.gridRow += 1;
			updatePlayer();
		}
	}
}

function movePlayerLeft() {
	if (spieler != null) {
		spieler.htmlelement.classList.add("flip");
		if (isMoveValid(spieler.gridRow, spieler.gridColumn - 1)) {
			spieler.gridColumn -= 1;
			updatePlayer();
		}
	}
}

function movePlayerRight() {
	if (spieler != null) {
		spieler.htmlelement.classList.remove("flip");
		if (isMoveValid(spieler.gridRow, spieler.gridColumn + 1)) {
			spieler.gridColumn += 1;
			updatePlayer();
		}
	}
}

/**
 * Prüft ob der Spieler sich auf das Feld bewegen darf
 * @param {number} row Die Zeile, die geprüft werden muss
 * @param {number} column Die Spalte, die geprüft werden muss
 * @returns {Boolean} Wenn die Position valide ist
 */
function isMoveValid(row, column) {
	// if (row < 0 || row > 9 || column < 0 || column > 8) return true;
	// if (spielfeldArray[row][column] != 1) {
	// 	return checkForDoor(row, column);
	// }
	return checkForDoor(row, column);
}

function nextMovePosition(spieler, row, column){
	var x=(column-spieler.gridColumn)*stepSize;
	var y=(row-spieler.gridRow)*stepSize;
	var spielerrect=spieler.htmlelement.getBoundingClientRect();
	x+=spielerrect.x;
	y+=spielerrect.y;
	var width=spielerrect.width;
	var height=spielerrect.height;
	return new DOMRect(x, y, width, height);
}

/**
 *  Die Hauptmethode die den Spieler updated
 */
function updatePlayer() {
	updateObjectPosition(spieler)		//Bewegt den Spieler
	// checkForKey(spieler, schluessel);	//Prüft, ob sich der SPieler auf einem Schlüssel befindet
	playerToSearchQueries(spieler)	//Schreibt die Parameter des Spielers in die Searchquery der URL
	playerOnButton(spieler.htmlelement.getBoundingClientRect(), "game", "game.html?"+urlSearchParams.toString());				//Prüft ob sich das Html elemnt des Spielers mit dem "Startseite" Knopf kollidiert
	playerOnButton(spieler.htmlelement.getBoundingClientRect(), "tutorial", "tutorial.html?"+urlSearchParams.toString());
	playerOnButton(spieler.htmlelement.getBoundingClientRect(), "impressum", "impressum.html?"+urlSearchParams.toString());
}

/**
 * Updatet die Position von Schlüssel und Spieler. Wird benutzt wenn das Spielfeld initialisiert wird und wenn die Größe des Browserfensters geändert wird
 */
function updateAllPositions() {
	updateObjectPosition(spieler);
	// updateObjectPosition(schluessel);
}

/**
 * Updatet die Position des Spielobjekts. (Entweder Schlüssel oder Spieler)
 * objectOffset+objectRow*{@link stepSize} in Pixel
 * @param {GameObject} object 
 */
function updateObjectPosition(object) {
	if (object != null) {
		object.htmlelement.style.left = (object.offsetX + (object.gridColumn * stepSize)) + "px";
		object.htmlelement.style.top = (object.offsetY + (object.gridRow * stepSize)) + "px";
	}
}

/**
 * Prüft ob der Spieler auf dem Schlüssel ist, wenn ja wird der Schlüssel gelöscht und keyCollected auf 1 gesetzt
 * @param {spieler} spieler 
 * @param {schluessel} schluessel 
 */
function checkForKey(spieler, schluessel) {
	if (schluessel == null || spieler == null) return;

	if (schluessel.gridColumn == spieler.gridColumn && schluessel.gridRow == spieler.gridRow) {
		spieler.keyCollected = 1;
		schluessel.htmlelement.remove();
		schluessel = null;
	}
}

/**
 * Prüft ob der Spieler eine Tür berührt.
 * @returns {Boolean} True, wenn der Spieler einen Schlüssel hat und vor ihm eine Tür ist
 */
function checkForDoor(row, column) {
	tuer=document.getElementById("tuerAufStartseite");
	if (intersect(nextMovePosition(spieler, row, column), tuer.getBoundingClientRect(), 0, 0)) {
		if (spieler.keyCollected == 2) {
			alert("Gewonnen!");
			return true;
		} else {
			alert("Verschlossen!");
			return false;
		}
	} else {
		return true;
	}
}

/**
 * Wird ausgeführt wenn der Spieler sich auf einem KNopf befindet. Öffnet die spezifizierte URL
 * @param {DOMRect} playerBB Die Bounding Box des Spielers
 * @param {String} id Die ID des HTML elements bei dem die Kollision überprüft werden soll
 * @param {String} url Die URL die bei Kollision geöffnet werden soll
 */
function playerOnButton(playerBB, id, url) {
	var element = document.getElementById(id);
	var rect = element.getBoundingClientRect();
	if (intersect(playerBB, rect, 5, 0))
		window.open(url, "_self");
}

/**
 * Überprüft, ob sich zwei Bounding Boxes überschneiden
 * Code template von https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection#aabb_vs._aabb
 * @param {DOMRect} a 
 * @param {DOMRect} b 
 * @param {number} threshholdA Schrumpft die Bounding Box für A
 * @param {number} threshholdB Schrumpft die Bounding Box für B
 * @returns {Boolean} True, wenn beide html elemente sich überschneiden
 */
function intersect(a, b, threshholdA, threshholdB) {
	return (a.left + threshholdA <= b.right - threshholdB && a.right - threshholdA >= b.left + threshholdB) &&
		(a.top + threshholdA <= b.bottom - threshholdB && a.bottom - threshholdA >= b.top + threshholdB)
}

/**
 * Lädt das Spieler Objekt abhängend der Search Queries in der URL
 * @param {{[k: string]: string;}} searchparams Die Suchparameter die geladen werden
 * @returns {GameObject} Das Spieler Objekt
 */
function loadPlayerFromSearchQueries(searchparams) {
	if (Object.keys(searchparams).length !== 0) {	//Prüft ob searchparams leer ist
		var img = document.createElement("img");
		img.src="grafik/spielfigur-marvin-the-martian.png";
		img.id="spieler";
		img.alt="Spieler";
		document.getElementById("fakefield").appendChild(img);
		addControls();
		return { htmlelement: document.getElementById("spieler"), gridRow: parseInt(searchparams.row), gridColumn: parseInt(searchparams.column), keyCollected: parseInt(searchparams.key), offsetX: 0, offsetY: stepSize / 10 };
	}
}

/**
 * Löscht oder lädt den Schlüssel wenn keyCollected 1 oder 0 ist.
 * @param {{[k: string]: string;}} searchparams  Die Suchparameter die geladen werden
 * @returns {GameObject} Das Schlüsselobjekt
 */
function loadKeyFromSearchQueries(searchparams) {
	if (parseInt(searchparams.key) == 0 || Object.keys(searchparams).length === 0) {
		return { htmlelement: document.getElementById("keyOnGamePage"), gridRow: 8, gridColumn: 5, color: "orange", offsetX: 0, offsetY: stepSize / 5 };
	} else {
		document.getElementById("keyOnGamePage").remove();
		return null;
	}
}

/**
 * Inspiriert von https://zgadzaj.com/development/javascript/how-to-change-url-query-parameter-with-javascript-only
 * 
 * Setzt die Spielervariablen in die SearchQueries
 * 
 * @param {GameObject} spieler 
 */
function playerToSearchQueries(spieler) {
	urlSearchParams = new URLSearchParams(window.location.search);

	urlSearchParams.set("row", spieler.gridRow);
	urlSearchParams.set("column", spieler.gridColumn);
	urlSearchParams.set("key", spieler.keyCollected)

	history.replaceState(null, null, "?" + urlSearchParams.toString());
}

/**
 * Fügt Steuertasten zum html hinzu
 */
function addControls(){
	var divFlex=document.createElement("div");
	divFlex.id="controls";
	document.body.appendChild(divFlex);
	
	var divGrid=document.createElement("div");
	divFlex.appendChild(divGrid);
	divGrid.appendChild(createImg("key_top", "grafik/ArrowUp.svg", "Controller Pfeil nach oben"));
	divGrid.appendChild(createImg("key_left", "grafik/ArrowLeft.svg", "Controller Pfeil nach links"));
	divGrid.appendChild(createImg("key_down", "grafik/ArrowDown.svg", "Controller Pfeil nach unten"));
	divGrid.appendChild(createImg("key_right", "grafik/ArrowRight.svg", "Controller Pfeil nach rechts"));
}

/**
 * Kreiert ein Bild mit den angegebenen parametern
 * @param {String} id 
 * @param {String} src 
 * @param {String} alt 
 * @returns {HTMLElement} image
 */
function createImg(id, src, alt){
	var img=document.createElement("img");
	img.id=id;
	img.src=src;
	img.alt=alt;
	return img;
}

//Anscheinend werden in JSDoc so Objekte und Variablen definiert... -Martin
/**
 * @typedef {Object} GameObject
 * @property {HTMLElement} htmlelement Das HTML Element des Objektes
 * @property {number} gridRow In welcher Zeile sich das Objekt befindet
 * @property {number} gridColumn In welcher Spalte sich das Objekt befindet
 * @property {number} offsetX Ein Versatz in Pixel um das Objekt an der X-Achse zu zentrieren.
 * @property {number} offsetY Ein Versatz in Pixel um das Objekt an der Y-Achse zu zentrieren.
 */