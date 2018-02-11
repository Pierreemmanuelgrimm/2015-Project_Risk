/* Initializing the countries */
//Image Dilation scale
scale = 2.5

//Creating the country array and setting the index to zero
countryList = [];
countryNumber = 0;

//Template for countries
function Country(theName, adjacentCountries, theContinent,xPos, yPos){
	this.div = document.createElement('div');
	this.div.id = countryNumber;

	this.div.name = theName;
	this.div.owner = -1;
	
	this.div.nearbyCountry = adjacentCountries;
	this.div.continent = theContinent;
	
	this.div.attackingArmy = 0;
	
	this.div.isAttacked = false;
	this.div.isAttacking = false;
	
	this.div.isMoving = false;
	this.div.isMovable = false;
	
	this.div.innerHTML = "X";
	this.div.style.border = "solid " + continentColour(theContinent);
	this.div.style.position = "absolute";
	this.div.style.top = yPos*scale + "px";
	this.div.style.left = xPos*scale + "px";
	this.div.style.backgroundColor = "white";
	
	document.getElementsByTagName('body')[0].appendChild(this.div);
	
	countryNumber++;
}
Country.prototype.getClicked = function(a){
	this.div.onclick = function(){
		
		country = countryList[a].div;
		d(country.id);
		
		//Where do I add troops?
		if (step == 0){
			if(countryList[a].div.owner.id == playerTurn){
				assignTroops(countryList[a].div);
				
			}
		}
		if (turn > 0)
			//Where to send troops?
			if (step == 5){
				if (country.isMoving == true && (country.armySize - country.attackingArmy) > 1){
					country.attackingArmy++;
					drawFightingArmy(country);
				}
				if (country.isMovable == true){
					for (var x = 0; x < 42; x++){
						country.armySize += countryList[x].div.attackingArmy;
						countryList[x].div.armySize -= countryList[x].div.attackingArmy;
						
						countryList[x].div.innerHTML = countryList[x].div.armySize;
						
						countryList[x].div.isMovable = 0;
						countryList[x].div.isMoving = 0;
						
						countryList[x].div.attackingArmy = 0;
						countryList[x].div.style.backgroundColor = "white";
					}
					country.innerHTML = country.armySize;
					nextStep();
					
				}
			}
			//Which troops to move?
			if (step == 4){
				if (country.owner.id == playerTurn && country.armySize > 1){
					country.isMoving = true;
					country.style.backgroundColor = "Green";
					country.attackingArmy++;
					drawFightingArmy(country);
					
					for (x = 0; x < country.nearbyCountry.length; x++){
						if (countryList[country.nearbyCountry[x]].div.owner.id == playerTurn){
							d(country.nearbyCountry[x]);
							countryList[country.nearbyCountry[x]].div.isMovable = true;
							countryList[country.nearbyCountry[x]].div.style.backgroundColor = "Blue";
						}
					}
					if (checkCompleteContinent(country.continent) == 1){
						for (var x = 0; x < 42; x++){
							if (countryList[x].div.owner.id == playerTurn && countryList[x].div.continent == country.continent && countryList[x].div.id != country.id){
								countryList[x].div.isMovable = true;
								countryList[x].div.style.backgroundColor = "Blue";
							}
						}
					}
				setStep(5);
				}
			}
				
			//Who is attacking?
			if (step == 2){
				if (country.isAttacked) startFight();
				if (country.isAttacking) raiseArmy(country);
			}
			//Who is attacked?
			if (step == 1){
				if(country.owner.id != playerTurn){
					var fight = 0;
					for (x = 0; x < country.nearbyCountry.length; x++){
						if(countryList[country.nearbyCountry[x]].div.owner.id == playerTurn && countryList[country.nearbyCountry[x]].div.armySize > 1){
							fight = 1;							
						}
					}
					if (fight == 1){
						targetAttack(country);
					}
				}	
			}
	}		
}
//Adding Continents
continents = [["NAmerica", 5],
			["SAmerica", 2],
			["Africa", 3],
			["Asia", 7],
			["Europe", 5],
			["Oceania", 2]];
			
//Adding Countries
dataArray = [["Alaska", [1,2,29], "NAmerica", 25,35],
			["Northwest Territory", [0,2,3,4], "NAmerica", 70,40],
			["Alberta", [0,1,3,4,6], "NAmerica", 70,60],
			["Ontario", [1,2,4,5,6,7], "NAmerica", 100,70],
			["Greenland", [1,3,5,22], "NAmerica", 160,25],
			["Quebec", [3,4,6], "NAmerica", 130,75],
			["Eastern United States", [3,5,7,8], "NAmerica", 110,110],
			["Western United States", [2,3,6,8], "NAmerica", 70,100],
			["Central America", [6,7,9], "NAmerica", 75,135],

			["Venezuela", [8,10,12], "SAmerica", 110,180],
			["Peru", [9,11,12], "SAmerica", 110,200],
			["Argentina", [10,12], "SAmerica", 125,260],
			["Brazil", [9,10,11,13], "SAmerica", 150,200],

			["Northern Africa", [12,14,18,19,20], "Africa", 220,190],
			["Congo", [13,15,17], "Africa", 270,230],
			["South Africa", [14,16,17], "Africa", 270,270],
			["Madagascar", [15,17], "Africa", 320,280],
			["East Africa", [13,14,15,16,18,35], "Africa", 290,210],
			["Egypt", [13,17,19,35], "Africa", 270,180],

			["Southern Europe", [13,18,20,23,25,35], "Europe", 250,130],
			["Western Europe", [13,19,21,23], "Europe", 210,140],
			["Great Britain", [20,22,23,24], "Europe", 210,100],
			["Iceland", [4,21,24], "Europe", 210,60],
			["Northern Europe", [19,20,21,24,25], "Europe", 250,100],
			["Scandinavia", [21,22,23,25], "Europe", 240,60],
			["Ukraine", [19,23,24,26,34,35], "Europe", 290,90],


			["Ural", [25,27,33,34], "Asia", 335,60],
			["Siberia", [26,28,30,32,33], "Asia", 360,30],
			["Yakutsk", [27,29,30], "Asia", 400,30],
			["Kamchatka", [0,28,30,31,32], "Asia", 440,30],
			["Irkutsk", [27,28,29,32], "Asia", 400,75],
			["Japan", [29,32], "Asia", 455,100],
			["Mongolia", [27,29,30,31,33], "Asia", 400,100],
			["China", [26,27,32,34,36,37], "Asia", 370,125],
			["Afghanistan", [25,26,33,35,36], "Asia", 330,110],
			["Middle East", [17,18,19,25,34,36], "Asia", 300,150],
			["India", [33,34,35,37], "Asia", 350,150],
			["Siam", [33,36,38], "Asia", 400,170],

			["Indonesia", [37,39], "Oceania", 410,225],
			["New Guinea", [38,40,41], "Oceania", 460,215],
			["Eastern Australia", [39,41], "Oceania", 460,260],
			["Western Australia", [39,40], "Oceania", 430,270]];

for (var z = 0; z < 42; z++){
	countryList[z] = new Country (dataArray[z][0],dataArray[z][1], dataArray[z][2], dataArray[z][3], dataArray[z][4]);
	countryList[z].getClicked(z);
}
//Function returning a colour depending on the continent
function continentColour(continent){
	if (continent == "NAmerica"){
		return "#FFFF00";
	}
	if (continent == "SAmerica"){
		return "#FFA500";
	}
	if (continent == "Africa"){
		return "#A52A2A";
	}
	if (continent == "Europe"){
		return "#0000FF";
	}	
	if (continent == "Asia"){
		return "#008000";
	}
	if (continent == "Oceania"){
		return "#808080";
	}
	
}

/* Initializing Start Up UI */
function confirmPlayers(){
	//Get number of players
	e = document.getElementById("playerNumber");
	playerNumber = e.options[e.selectedIndex].value;
	
	//Remove form
	document.getElementById("playerNumberSelect").style.visibility="hidden";
	//Add Name form
	nameForm = document.createElement('div');
	nameForm.id = "nameForm";
	
	for (var x = 0; x < playerNumber; x++){
		var y = x + 1;
		nameForm.innerHTML = nameForm.innerHTML + "<input type='text' id='name" + x +"' value='Player "+ y +"'><br>";
	}
	nameForm.innerHTML = nameForm.innerHTML + "<input type='submit' id='nameSubmit' onclick='initialize()'><br>";
	
	document.getElementsByTagName('body')[0].appendChild(nameForm);
}
function initialize(){
	/* Create Players */
	//Retrieve Info
	players = [];
	
	for (var x = 0; x < playerNumber; x++){
		players[x] = new Player(x, document.getElementById("name" + x).value);
	}
	
	//Remove form
	document.getElementById("nameForm").style.visibility="hidden";
	
	/*Distribute Countries */
	playerDistribution = Math.floor(playerNumber*Math.random());
	distributedCountries = 0;
	while(distributedCountries < 42){
		div = document.getElementById(Math.floor(42*Math.random()));
		if (div.owner == -1){
			setOwnership(div, players[playerDistribution]);
			setArmySize(1, div);
			
			distributedCountries++
			players[playerDistribution].countries++;
				
			playerDistribution++
			if (playerDistribution == playerNumber){
				playerDistribution = 0;
			}
		}
	}
	//Give extra units to those with less land
	maxCountries = 0;
	for(var x = 0; x < players.length; x++){
		if (players[x].countries > maxCountries){
			maxCountries = players[x].countries;
		}
	}
	for(var x = 0; x < players.length; x++){
		if (players[x].countries < maxCountries){
			players[x].reserves += Math.floor(maxCountries/5);
		}
	}
	
	//Initializing Turns and steps
	turn = 0;
	step = 0;
	

	
	//Creating Game Counter
	gameCounter = document.createElement('div');
	gameCounter.id = "gameCounter";
	
	gameCounter.style.position = "absolute";
	gameCounter.style.left = scale * 520 + "px";
	gameCounter.style.top = scale * 30 + "px";


	
	turnText = document.createTextNode("Turn: ");
	gameCounter.appendChild(turnText);
	
	turnCounter = document.createElement("div");
	turnCounter.id = "turnCounter";
	gameCounter.appendChild(turnCounter);
	
	br = document.createElement("br");
	gameCounter.appendChild(br);
	br2 = document.createElement("br");
	gameCounter.appendChild(br2);
	
	text = document.createTextNode("Reserves:");
	gameCounter.appendChild(text);
	
	table = document.createElement("TABLE");
	table.style.border = "2px solid black";
	
	for (var x = 0; x < playerNumber; x++){
		row = table.insertRow(x);
		cell = row.insertCell(0);
		cell.id = "aNameDisplay" + x;
		cell.name = "tableCell";
		cell.innerHTML = players[x].name;
		
		cell = row.insertCell(1);
		cell.id = "aReserveDisplay" + x;
		cell.innerHTML = players[x].reserves;
		cell.style.border = "3px solid" + players[x].colour;
	}	
	
	gameCounter.appendChild(table);
	reservesConfirm = document.createElement("input");
	reservesConfirm.id = "reservesConfirm";
	reservesConfirm.type = "submit";
	reservesConfirm.value = "Confirm Troops";
	reservesConfirm.onclick = function(){confirmTroops()};
	
	gameCounter.appendChild(reservesConfirm);
	
	br3 = document.createElement("br");
	gameCounter.appendChild(br3);
	
	oneDie = document.createElement("input");
	oneDie.id = "oneDie";
	oneDie.type = "submit";
	oneDie.value = "1";
	oneDie.onclick = function(){defendRoll("1")};
	
	gameCounter.appendChild(oneDie);
	
	twoDice = document.createElement("input");
	twoDice.id = "twoDice";
	twoDice.type = "submit";
	twoDice.value = "2";
	twoDice.onclick = function(){defendRoll("2")};
	
	gameCounter.appendChild(twoDice);
	
	br4 = document.createElement("br");
	gameCounter.appendChild(br4);
	
	diceResultTable = document.createElement("TABLE");
	diceResultTable.style.border = "1px solid black";
	
	row = diceResultTable.insertRow(0);
	cell = row.insertCell(0);
	cell.innerHTML = "Attack Roll: "
	
	for (var x = 0; x < 3; x++){
		cell = row.insertCell((x+1));
		cell.id = "aRoll" + x;
	}
	
	row = diceResultTable.insertRow(1);
	cell = row.insertCell(0);
	cell.innerHTML = "Defence Roll: "
	
	for (var x = 0; x < 2; x++){
		cell = row.insertCell((x+1));
		cell.id = "dRoll" + x;
	}
	
	gameCounter.appendChild(diceResultTable);
	
	br5 = document.createElement("br");
	gameCounter.appendChild(br5);
	
	endFightPhase = document.createElement("input");
	endFightPhase.id = "endFightPhase";
	endFightPhase.type = "submit";
	endFightPhase.value = "End Fighting Phase";
	endFightPhase.onclick = function(){setStep(4)};
	gameCounter.appendChild(endFightPhase);
	
	endMovePhase = document.createElement("input");
	endMovePhase.id = "endMovePhase";
	endMovePhase.type = "submit";
	endMovePhase.value = "End Moving Phase";
	endMovePhase.onclick = function(){nextPlayerTurn()};
	gameCounter.appendChild(endMovePhase);
	
	
	document.getElementsByTagName('body')[0].appendChild(gameCounter);
	
	
	//finished initialization, now starting first round
	firstRound();	
}
/* Initializing Player */
function Player(num, theName){
	this.id = num;
	this.name = theName;
	this.colour = getPlayerColour(num);
	this.reserves = 30;
	this.countries = 0;
}
function getPlayerColour(index){
	if (index == 0) return "#FFFF00";
	if (index == 1) return "#FFA500";
	if (index == 2) return "#A52A2A";
	if (index == 3) return "#0000FF";
	if (index == 4) return "#008000";
	if (index == 5) return "#808080";
}
/* Setting ownership and army size in countries */
function setOwnership(country, selectedPlayer){
	country.owner = selectedPlayer;
	country.style.border = "5px solid " + selectedPlayer.colour;
}
function setArmySize(num, country){
	country.armySize = num;
	country.innerHTML = num;
}

function d(arg){	
	console.log(arg);
}
