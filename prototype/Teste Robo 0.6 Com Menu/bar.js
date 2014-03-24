function Bar(x,y,barEnergy,sprite)
{
//energyBar = new function(){
	this.x = x;
	this.y = y;

	this.barName       = 'EnergyBar';
	this.textColor     = 'white';
	this.barColor      = '#487eff';
	this.BgColor       = '#4f5565';
	this.lowValueColor = '#f04b0f';


	if (sprite != undefined)
	{
		console.log('sprite diferente de undefined');
		this.sprite = sprite;
	}
	
	//this.sprite = sprite;

	var	totalEnergy   = barEnergy;
	var currentEnergy = barEnergy;
	var	barSize       = currentEnergy;
	var step          = 10;


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
		if (currentEnergy + value <= totalEnergy)
			currentEnergy += value;
		else currentEnergy = totalEnergy;
	}

	this.updateBar = function(){
		if (barSize < currentEnergy)
			barSize += step;
		else if (barSize > currentEnergy)
			barSize -= step;
	}

	// this.x = 750;
	
	this.render = function(){
		canvas.gameInterfaceContext.fillStyle = this.textColor;
		canvas.gameInterfaceContext.fillText(this.barName, this.x, this.y - 210);
		canvas.gameInterfaceContext.fillStyle = this.BgColor;	
		canvas.gameInterfaceContext.fillRect(this.x+20,this.y,35,-200);
		if (currentEnergy < 100){
			canvas.gameInterfaceContext.fillStyle = this.lowValueColor;
		}
		else canvas.gameInterfaceContext.fillStyle = this.barColor;
		this.updateBar(); // 246
		canvas.gameInterfaceContext.fillRect(this.x+20,this.y,35,-200*(barSize/totalEnergy));
		canvas.gameInterfaceContext.drawImage(this.sprite, this.x+14, this.y - 205); //41
	}
}