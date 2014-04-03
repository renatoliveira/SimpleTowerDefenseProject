energyBar = new function(){

	var	totalEnergy = 1000;
	var currentEnergy= 1000;
	var	barSize= currentEnergy;
	var step = 10;


	this.getTotalEnergy = function(){
		return totalEnergy;
	}
	this.getCurrentEnergy = function(){
		return currentEnergy;
	}

	this.check = function(value)
	{
		if (value <= currentEnergy)
			return true;
		else return false;
	}

	this.increaseEnergy = function(value){
		if(currentEnergy+value<=totalEnergy)
		currentEnergy+=value;
		else currentEnergy=totalEnergy;
	}

	this.updateBar = function(){
		if(barSize < currentEnergy)
			barSize+=step;
		else if(barSize > currentEnergy)
			barSize-=step;
	}


	this.x = 750;
	this.render = function(){
		console.log('rendering');
		canvas.gameInterfaceContext.fillStyle = 'white';
		canvas.gameInterfaceContext.fillText('EnergyBar', this.x, 24);
		canvas.gameInterfaceContext.fillStyle = '#4f5565';	
		canvas.gameInterfaceContext.fillRect(this.x+20,246,35,-200);
		if (currentEnergy < 100){
			canvas.gameInterfaceContext.fillStyle = "#f04b0f";
		}
		else canvas.gameInterfaceContext.fillStyle = '#487eff';
		this.updateBar();
		canvas.gameInterfaceContext.fillRect(this.x+20,246,35,-200*(barSize/totalEnergy));
		canvas.gameInterfaceContext.drawImage(sprites.batteryCover,this.x+14, 41);
	}
}