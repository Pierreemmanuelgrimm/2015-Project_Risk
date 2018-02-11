function attackRole(a){
	for (var x = 0; x < 3; x++){
		document.getElementById("aRoll" + x).innerHTML = "";
		if (x != 2){
			document.getElementById("dRoll" + x).innerHTML = "";
		}
	}
	if (a < 3){
		attackerRolls = attackingArmy;
	}else{
		attackerRolls = 3;
	}
	attackerResult = [];
	
	for (var x = 0; x < attackerRolls; x++){
		attackerResult[x] = 1 + Math.floor(6*Math.random());	
	}
	attackerResult.sort(numberAs);
	
	d(attackerResult);
	for (var x = 0; x < attackerRolls; x++){
		document.getElementById("aRoll" + x).innerHTML = attackerResult[x];
	}
	nextStep();
}
function defendRoll(a){
	defenderResult = [];
	if (countryIsAttacked().armySize < 2){
		defenderRolls = countryIsAttacked().armySize;
	}else{
		defenderRolls = a;
	}
	for (var x = 0; x < defenderRolls; x++){
		defenderResult[x] = 1 + Math.floor(6*Math.random());
	}
	defenderResult.sort(numberAs);
	d(defenderResult);
	
	for (var x = 0; x < defenderRolls; x++){
		document.getElementById("dRoll" + x).innerHTML = defenderResult[x];
	}	
	
	combatTurn();
	
}
function combatTurn(){
	var a = lowestRoll();
	for (var r = 0; r < a; r++){
		d(r);
		var finalRoll = a - 1;
		if (attackerResult[r] > defenderResult[r]){
			d("Defender Loses 1");
			defenderLostRoll();
		}else{
			d("Attacker Loses 1");
			attackerLostRoll();
		}
		if (r == finalRoll){
			d("Done this round");
			checkForEnd();
		}
	}		
}

function defenderLostRoll(){
	index = countryIsAttacked().id;
	newArmySize = countryList[index].div.armySize - 1;
	setArmySize(newArmySize, countryList[index].div);
}
function attackerLostRoll(){
	indexOfCountry = Math.floor(attackingCountries.length * Math.random());
	
	
	countryList[attackingCountries[indexOfCountry]].div.armySize--;
	countryList[attackingCountries[indexOfCountry]].div.attackingArmy--;
	attackingArmy--;
	
	drawFightingArmy(countryList[attackingCountries[indexOfCountry]].div);
		
	if (countryList[attackingCountries[indexOfCountry]].div.attackingArmy < 1){
		stopCountryFighting(countryList[attackingCountries[indexOfCountry]].div.id);
	}
}
function checkForEnd(){
	restartTurn = 1;
	if (countryIsAttacked().armySize < 1){
		var id2 = countryIsAttacked().id;
		setOwnership(countryIsAttacked(), players[playerTurn]);
		setArmySize(attackingArmy, countryIsAttacked());
		for (var x = 0; x < 42; x++){
			if (countryList[x].div.attackingArmy > 0){
				countryList[x].div.armySize -= countryList[x].div.attackingArmy;
			}
		}
		
		
		restartTurn = 0;
		endFight();
	}
	if(attackingArmy < 1){
		restartTurn = 0;
		endFight();
	}
	if (restartTurn == 1){
		setStep(2);
	}
}
function stopCountryFighting(a){
	countryList[a].div.attackingArmy = 0;
	countryList[a].div.isAttacked = 0;
	countryList[a].div.isAttacking = 0;
	
	setArmySize(countryList[a].div.armySize, countryList[a].div);
	countryList[a].div.style.backgroundColor = "white";
}
function lowestRoll(){
	if (defenderRolls < attackerRolls){
		return defenderRolls;
	}else{
		return attackerRolls;
	}
	
}
function numberAs(a,b){
	return b-a;
}
function startFight(){
	attackingArmy = 0;
	attackingCountries = [];
	index = 0;
	for (var x = 0; x < 42; x++){
		if (countryList[x].div.attackingArmy > 0){
			attackingCountries[index] = countryList[x].div.id;
			index++;
		}
		attackingArmy += countryList[x].div.attackingArmy;
	}
	if (attackingArmy == 0){
		endFight();
	}else{
		attackRole(attackingArmy);
	}
}
function countryIsAttacked(){
	for (var x = 0; x < 42; x++){
		if (countryList[x].div.isAttacked == true) return countryList[x].div;
	}
}

function raiseArmy(country){
	if ((country.armySize - country.attackingArmy) > 1){
		country.attackingArmy++;
		drawFightingArmy(country);
	}
}
function endFight(){
	for (x = 0; x < 42; x++){
		stopCountryFighting(x);
	}
	setStep(1);
}
function drawFightingArmy(country){
	country.innerHTML = (country.armySize - country.attackingArmy) + " | " + country.attackingArmy;
}
