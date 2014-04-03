/*

	Para que haja overlapping dos sons (vários cliques rápidos consecutivos) criei uma lista circular de instâncias de cada som

*/
audio = new function()
{
	var index1 = 0;
	var index2 = 0;
	var index3 = 0;
	this.initialize = function()
	{
		this.hitSoundList = new Array();
		this.deadSoundList = new Array();
		this.laserSoundList = new Array();

		for(var n = 0; n < 5; n++) //cria 5 instâncias de cada tipo
		{
			this.hitSound       = new Audio();
			this.deadSound      = new Audio();
			this.laserSound     = new Audio();
			this.hitSound.src   = "audio/hit.wav";
			this.deadSound.src  = "audio/punch.wav";
			this.laserSound.src = "audio/laser.wav";

			this.hitSoundList.push(this.hitSound);
			this.deadSoundList.push(this.deadSound);
			this.laserSoundList.push(this.laserSound);
		}
	}

	this.play = function(audioID)
	{
		if(audioID == 'hit')
		{
			this.hitSoundList[index1].play(); //garante que a cada execução seja tocado o audio de uma instância distinta
			if(index1 == 4)
				index1 = 0;
			else index1++;
		}
		else if (audioID == 'dead')
		{
			this.deadSoundList[index2].play();
			if(index2 == 4)
				index2 = 0;
			else index2++;
		}
		else if (audioID == 'laser')
		{
			this.laserSoundList[index3].play();
			if(index3 == 4)
				index3 = 0;
			else index3++;
		}
	}

}
