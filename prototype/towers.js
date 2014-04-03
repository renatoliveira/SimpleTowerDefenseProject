function Tower(x, y, o, identification)
{
	this.x             = x;
	this.y             = y;
	this.indiceMatriz  = 'undefined';
	this.orientation   = o;
	this.shootInterval = 30;
	this.towerNumber   = identification;
	this.shootCost     = 50;
	this.isSelected    = false;
	this.objectName    = 'torre ' + this.towerNumber;

	var currentFrame = 0;
	var numFrames    = 5;
	var _steps       = this.shootInterval;

	this.isOn       = false;
	this.isShooting = false;

	/*
	o = torre
	x = tile adjacente

	x x x
	x o x
	x x x

	supondo que a posição da torre seja 36 (indice matriz)
     0 ...  5   6   7 ...  9
               ...	
	20 ... 25  26  27 ... 29
	30 ... 35 [36] 37 ... 39
	40 ... 45  46  47 ... 49
               ...
	50 ... 55  56  57 ... 59

	Y aumenta 10.
	X aumenta  1.
	*/

	this.getSprite = function()
	{
		return sprites.tower, 0, 0;
	}

	this.returnImage = function(){
		if (this.isOn)
			return sprites.tower
		else
			return sprites.towerOff
	}

	this.init = function()
	{
		// console.log('floorX: ' + this.x/64);
		// console.log('floorY: ' + this.y/64);
		this.indiceMatriz = Math.floor(this.x/64) + Math.floor(this.y/64) * 10;
		//setInterval(this.getNearestTarget, 1000);
	}

	this.drawInfo = function()
	{
		if (this.orientation == 'left' || this.orientation == 'right')
		{
			this.context.fillText('POS: ' + this.x + ', ' + this.y, this.x, this.y-10);
			this.context.fillText('IM : ' + this.indiceMatriz,      this.x, this.y+0);
			this.context.fillText('Ori: ' + this.orientation,       this.x, this.y+10);
			this.context.fillText('ID: ' + this.towerNumber,        this.x, this.y+20);
			if(this.isOn == false)
				this.context.fillText('OFF',        this.x, this.y-20);
			else
				this.context.fillText('ON',        this.x, this.y-20);
		}
		if (this.orientation == 'up' || this.orientation == 'down')
		{
			this.context.fillText('POS: ' + this.x + ', ' + this.y, this.x + 60, this.y+20);
			this.context.fillText('IM : ' + this.indiceMatriz,      this.x + 60, this.y+30);
			this.context.fillText('Ori: ' + this.orientation,       this.x + 60, this.y+40);
			this.context.fillText('ID: ' + this.towerNumber,        this.x + 60, this.y+50);
			if(this.isOn == false)
				this.context.fillText('OFF',        this.x + 60, this.y+10);
			else
				this.context.fillText('ON',        this.x + 60, this.y+10);
		}
		
	}

	console.log('ID: ' + this.towerNumber + ': ' + Math.floor(this.y/64)*10);

	this.getNearestTarget = function()
	{
		//console.log(Math.floor(this.y/64)*10);
		if (this.orientation == 'left')
		{
			for (var i=0; i < listaInimigos.length; i++)
			{
				if (listaInimigos[i].indiceMatriz < this.indiceMatriz &&
					listaInimigos[i].indiceMatriz > Math.floor(this.y/64)*10)
				{
					// console.log(_steps);
					_steps++;
					if (_steps >= this.shootInterval)
					{
						this.shootLaser();
						_steps = 0;
					}
					break;
				}
			}
		}

		if (this.orientation == 'right')
		{
			for (var i=0; i < listaInimigos.length; i++)
			{
				if (listaInimigos[i].indiceMatriz >= this.indiceMatriz &&
					listaInimigos[i].indiceMatriz < Math.floor(this.y/64)*10+10)
				{
					_steps++;
					if (_steps >= this.shootInterval)
					{
						this.shootLaser();
						_steps = 0;
					}
					break;
				}
			}
		}

		if (this.orientation == 'up')
		{
			for (var i=0; i < listaInimigos.length; i++)
			{
				if (listaInimigos[i].indiceMatriz < this.indiceMatriz &&
					listaInimigos[i].x <= this.x + 10 &&
					listaInimigos[i].x >= this.x - 10)
				{
					_steps++;
					if (_steps >= this.shootInterval)
					{
						this.shootLaser();
						_steps = 0;
					}
					break;
				}
			}
		}

		if (this.orientation == 'down')
		{
			for (var i=0; i < listaInimigos.length; i++)
			{
				if (listaInimigos[i].indiceMatriz > this.indiceMatriz &&
					listaInimigos[i].x <= this.x + 10 &&
					listaInimigos[i].x >= this.x - 10)
				{
					_steps++;
					if (_steps >= this.shootInterval)
					{
						this.shootLaser();
						_steps = 0;
					}
					break;
				}
			}
		}
	}

	this.changeStatus = function()
	{
		if(this.isOn)
			this.isOn = false
		else
			this.isOn = true
	}

	this.render = function()
	{
		if (this.isOn) this.getNearestTarget();
		
		var image = this.returnImage();

		if (debugInfo == true)
		{
			this.drawInfo();
		}
		
		if (this.orientation == 'left')
		{
			this.context.drawImage(image, currentFrame*64, 0, 64, 64, this.x, this.y, 64, 64);
		}
		if (this.orientation == 'right')
		{
			this.context.drawImage(image, currentFrame*64, 64, 64, 64, this.x, this.y, 64, 64);
		}
		if (this.orientation == 'down')
		{
			this.context.drawImage(image, currentFrame*64, 128, 64, 64, this.x, this.y, 64, 64);
		}
		if (this.orientation == 'up')
		{
			this.context.drawImage(image, currentFrame*64, 192, 64, 64, this.x, this.y, 64, 64);
		}

		if (this.isShooting)
		{
			currentFrame++;
			if (currentFrame >= numFrames)
			{
				currentFrame = 1;
				this.isShooting = false;
			}
		}
		if (!this.isShooting) { currentFrame = 0; };
	}

	this.shootLaser = function()
	{
		if (energyBar.getCurrentEnergy() >= this.shootCost){
			this.isShooting = true;
			var l = new Laser(this.x+16, this.y+16, this.orientation);
			l.context = canvas.lasersContext;
			lasers.push(l);
			audio.play('laser');
			delete l;
			energyBar.increaseEnergy(-this.shootCost);
		}
	}

	this.init();
}