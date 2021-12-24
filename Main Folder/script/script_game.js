
/**
 * Die Anzahl der Pixel die der Spieler zurücklegt, wenn er einen Schritt macht
 */
var stepSize = document.getElementById("gamedisplay").clientHeight / 10;

var urlSearchParams = new URLSearchParams(window.location.search); //https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
const params = Object.fromEntries(urlSearchParams.entries());	//Loads the search queries from the url

/**
 * Das Spieler Objekt
 * @type {GameObject}
 * @property {number} spieler.keyCollected Speichert ob der Spieler einen Schlüssel eingesammelt hat. 0=Kein Schlüssel, 1=Erster Schlüssel, 2=Zweiter Schlüssel
 */
var spieler=loadPlayerFromSearchQueries(params);

/**
 * Das "Orangene" Schlüssel Object
 * @type {GameObject}
 * @property {String} schluessel.color The color of the key
 */
var schluessel=loadKeyFromSearchQueries(params);

/**
 * Kollision des Spielfeldes
 * spielfeldArray[zeile][spalte] --> 0 = frei, 1 = wand, 2 = schluessel, 3 = tuer
 */ 
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

//Setzt die Position des Schlüssels und des Spielers
updateAllPositions();

//Events registrieren
document.addEventListener("keydown", onKeyPressed);
window.addEventListener("resize", onResize, true);
document.getElementById("key_top").addEventListener("click", movePlayerUp);
document.getElementById("key_left").addEventListener("click", movePlayerLeft);
document.getElementById("key_right").addEventListener("click", movePlayerRight);
document.getElementById("key_down").addEventListener("click", movePlayerDown);

function onKeyPressed(e) {
	if (e.code == 'KeyW') {
		movePlayerUp();
	} else if (e.code == 'KeyS') {
		movePlayerDown();
	} else if (e.code == 'KeyA') {
		movePlayerLeft();
	} else if (e.code == 'KeyD') {
		movePlayerRight();
	}
}

/**
 * Updated {@link stepSize} und die Position des Objektes
 * @param {event} e Resize Event
 */
 function onResize(e) {
	stepSize = document.getElementById("gamedisplay").clientHeight / 10;	//Updating the step size
	if(spieler!=null){
		spieler.offsetY = stepSize / 10;
	}
	if(schluessel!=null){
		schluessel.offsetY = stepSize / 5;
	}
	updateAllPositions();
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
	if (row < 0 || row > 9 || column < 0 || column > 8) return true;
	if (spielfeldArray[row][column] != 1) {
		return checkForDoor(row, column);
	}
}

/**
 *  Die Hauptmethode die den Spieler updated
 */
function updatePlayer() {
	updateObjectPosition(spieler)		//Bewegt den Spieler
	checkForKey(spieler, schluessel);	//Prüft, ob sich der SPieler auf einem Schlüssel befindet
	playerToSearchQueries(spieler)	//Schreibt die Parameter des Spielers in die Searchquery der URL
	playerOnButton(spieler.htmlelement.getBoundingClientRect(), "index", "index.html?"+urlSearchParams.toString());				//Prüft ob sich das Html elemnt des Spielers mit dem "Startseite" Knopf kollidiert
	playerOnButton(spieler.htmlelement.getBoundingClientRect(), "tutorial", "tutorial.html?"+urlSearchParams.toString());
	playerOnButton(spieler.htmlelement.getBoundingClientRect(), "impressum", "impressum.html?"+urlSearchParams.toString());
}

/**
 * Updatet die Position von Schlüssel und Spieler. Wird benutzt wenn das Spielfeld initialisiert wird und wenn die Größe des Browserfensters geändert wird
 */
function updateAllPositions() {
	updateObjectPosition(spieler);
	updateObjectPosition(schluessel);
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
 * @returns
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
 * Prüft ob eine Tür bei [row][column] ist und ob der Spieler einen Schlüssel dafür hat.
 * @param {number} row 
 * @param {number} column 
 * @returns {Boolean} True, wenn der Spieler einen Schlüssel hat und vor ihm eine Tür ist
 */
function checkForDoor(row, column) {
	if (spielfeldArray[row][column] == 3) {
		if (spieler.keyCollected >= 1) {
			return true;
		} else {
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
 * @param {number} threshholdA Schrumpft die Bounding Boxe für A
 * @param {number} threshholdB Schrumpft die Bounding Boxe für B
 * @returns {Boolean} True, wenn beide html elemente sich überschneiden
 */
function intersect(a, b, threshholdA, threshholdB) {
	return (a.left + threshholdA <= b.right - threshholdB && a.right - threshholdA >= b.left + threshholdB) &&
		(a.top + threshholdA <= b.bottom - threshholdB && a.bottom - threshholdA >= b.top + threshholdB);
}

/**
 * Lädt das Spieler Objekt abhängend der Search Queries in der URL
 * @param {{[k: string]: string;}} searchparams Die Suchparameter die geladen werden
 * @returns {GameObject} Das Spieler Objekt
 */
function loadPlayerFromSearchQueries(searchparams) {
	if (Object.keys(searchparams).length !== 0) {	//Prüft ob searchparams leer ist
		return { htmlelement: document.getElementById("spieler"), gridRow: parseInt(searchparams.row), gridColumn: parseInt(searchparams.column), keyCollected: parseInt(searchparams.key), offsetX: 0, offsetY: stepSize / 10 };
	} else {
		return { htmlelement: document.getElementById("spieler"), gridRow: 8, gridColumn: 3, keyCollected: 0, offsetX: 0, offsetY: stepSize / 10 };
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
	urlSearchParams.set("key", spieler.keyCollected);

	history.replaceState(null, null, "?" + urlSearchParams.toString());
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
