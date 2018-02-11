function firstRound(){
	playerTurn = playerDistribution;
	displayPlayerTurn();	
}
function confirmTroops(){
	if (step == 0){
		if (turn == 0){
			for (var o = 0; o < 42; o++){
				countryList[o].div.innerHTML = "1";
			}
		}
		nextStep();
	}
}
function assignTroops(country){
	if (players[playerTurn].reserves > 0){
		newSize = country.armySize + 1;
		setArmySize(newSize, country);
		addPlayerReserves(playerTurn, -1);	
	}
}
function addPlayerReserves(playerID, amount){
	players[playerID].reserves += amount;
	document.getElementById("aReserveDisplay" + playerID).innerHTML = players[playerID].reserves;
}
function targetAttack(country){
	d("Target Aquired");
	setCountryColour(country, "Red");
	country.isAttacked = true;
	for (var x = 0; x < country.nearbyCountry.length; x++){
		if (countryList[country.nearbyCountry[x]].div.owner.id == playerTurn && countryList[country.nearbyCountry[x]].div.armySize > 1){
			setCountryColour(countryList[country.nearbyCountry[x]].div, "Blue");
			countryList[country.nearbyCountry[x]].div.isAttacking = true;
		}
	}
	nextStep();
}
function setCountryColour(country, colour){
	country.style.backgroundColor = colour;
}
function displayPlayerTurn(){
	for (var w = 0; w < players.length; w++){
		if(w == playerTurn){
			e = document.getElementById("aNameDisplay" + playerTurn).style.border = "1px solid black";

		}else{
			e = document.getElementById("aNameDisplay" + w).style.border = "1px white";
		}
	}	
}
function setStep(a){
	step = a;
	stepAction();
}
function nextStep(){
	step++;
	stepAction();
}
function stepAction(){
	d(step);
	if (step == 0){
		//Shown?
		//document.getElementById("reservesConfirm").style.visibility="visible";
	}
	else{
		//document.getElementById("reservesConfirm").style.visibility="hidden";
	}
	//If player X is done placing his troops 
	if (turn == 0)nextPlayerTurn();
	if (turn > 0){
		//d(step);
		if (step > 5){
			nextPlayerTurn();
		}
	}
}
function nextPlayerTurn(){
	playerTurn++;
	step = 0;
	if(playerTurn == players.length){
		playerTurn = 0;
	}
	displayPlayerTurn();
	
	if (turn > 0 && step == 0){
		addTroops();
	}
	
	if(playerTurn == playerDistribution){
		nextTurn();
	}
	
}
function addTroops(){
	var countrCount = 0;
	for (var x = 0; x < 42; x++){
		if (countryList[x].div.owner.id == playerTurn) countrCount++;
	}
	countrCount = Math.floor(countrCount/3);
	if (countrCount < 3) countrCout = 3;
	
	addPlayerReserves(playerTurn, countrCount);
	
	for(var x = 0; x < continents.length; x++){
		if (checkCompleteContinent(continents[x][0]) == true) addPlayerReserves(playerTurn, continents[x][1]);
	}
}
function nextTurn(){
	turn++;
	step = 0;
	document.getElementById("turnCounter").innerHTML = turn;
	
	if (turn == 1){
		for (var o = 0; o < 42; o++){
			countryList[o].div.innerHTML = countryList[o].div.armySize;
		}
		step = 1;
	}
	
}
function checkCompleteContinent(continent){
	var conCounter = true;
	//North America
	if (continent == "NAmerica"){
		for (var x = 0; x < 9 ;x++){
			if (countryList[x].div.owner.id != playerTurn){
				conCounter = false;
			}
		}
	}
	//South America
	if (continent == "SAmerica"){
		for (var x = 9; x < 13 ;x++){
			if (countryList[x].div.owner.id != playerTurn){
				conCounter = false;
			}
		}
	}
	
	//Africa
	if (continent == "Africa"){
		for (var x = 13; x < 19 ;x++){
			if (countryList[x].div.owner.id != playerTurn){
				conCounter = false;
			}
		}
	}
	
	//Europe
	if (continent == "Europe"){
		for (var x = 19; x < 26 ;x++){
			if (countryList[x].div.owner.id != playerTurn){
				conCounter = false;
			}
		}
	}
	
	//Asia
	if (continent == "Asia"){
		for (var x = 26; x < 38 ;x++){
			if (countryList[x].div.owner.id != playerTurn){
				conCounter = false;
			}
		}
	}
	
		
	//Oceania
	if (continent == "Oceania"){
		for (var x = 38; x < 42 ;x++){
			if (countryList[x].div.owner.id != playerTurn){
				conCounter = false;
			}
		}
	}
	
	
	//Return Answer
	return conCounter;
}