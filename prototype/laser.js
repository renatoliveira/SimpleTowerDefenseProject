//bullet.js
//o = orientation
function Laser(x,y,o)
{
	this.x = x;
	this.y = y;
	this.dmg = 2;
	this.orientation = o;
	this.speedX = 5;
	this.speedY = 5;

	//console.log(this.orientation);

	var frameSize = 32;
	var currentFrame = 0;
	var numFrames = 3;

	this.collider = new Collider(0,0,0,0);

	this.render = function()
	{
		this.updateCollider();
		this.move();

		if (this.orientation == 'left')
		{
			this.context.drawImage(sprites.laser, currentFrame*32, 0, 32, 32, this.x, this.y, 32, 32);
		}
		if (this.orientation == 'right')
		{
			this.context.drawImage(sprites.laser, currentFrame*32, 32, 32, 32, this.x, this.y, 32, 32);
		}
		if (this.orientation == 'down')
		{
			this.context.drawImage(sprites.laser, currentFrame*32, 64, 32, 32, this.x, this.y, 32, 32);
		}
		if (this.orientation == 'up')
		{
			this.context.drawImage(sprites.laser, currentFrame*32, 96, 32, 32, this.x, this.y, 32, 32);
		}

		currentFrame++;
		if (currentFrame >= numFrames)
		{
			currentFrame = 0;
		}

		// infos do objeto
		if (debugInfo == true)
		{
			this.drawInfo();
			// desenha o contorno do collider
			this.context.strokeRect(this.collider.x1, this.collider.y1, this.collider.x2 - this.collider.x1, this.collider.y2 - this.collider.y1);
		}
		// desenha o contorno da bala
		// this.context.strokeRect(this.x, this.y, frameSize, frameSize);
	}

	this.drawInfo = function()
	{
		// this.context.fillText('(' + this.x + ', ' + this.y + ') (IM: ' + indiceMatriz +  ' SPD: ' + speedValue + ')', this.x, this.y);
		this.context.fillText('(POS: ' + this.x + ', ' + this.y + ')', this.x, this.y - 10);
		this.context.fillText('(DMG: ' + this.dmg + ')', this.x, this.y -20);
		this.context.fillText('(ORI: ' + this.orientation + ')', this.x, this.y - 30);
	}

	this.move = function()
	{
		if (this.orientation == 'left')
		{
			this.x -= this.speedX;
		}
		if (this.orientation == 'right')
		{
			this.x += this.speedX;
		}
		if (this.orientation == 'up')
		{
			this.y -= this.speedY;
		}
		if (this.orientation == 'down')
		{
			this.y += this.speedY;
		}
		else if (this.orientation == 'undefined') { console.log('erro no MOVE do laser'); };
	}

	this.isOutOfCanvas = function()
	{
		if (this.x > canvas.lasers.width ||
			this.y > canvas.lasers.height ||
			this.x < -32 ||
			this.y < -32)
		{
			return true;
		}
	}

	this.updateCollider = function()
	{
		if (this.orientation == 'left')
		{
			this.collider.x1 = this.x + 3;
			this.collider.x2 = this.x + 22;
			this.collider.y1 = this.y + 14;
			this.collider.y2 = this.y + 15;
		}
		if (this.orientation == 'right')
		{
			this.collider.x1 = this.x + 13;
			this.collider.x2 = this.x + 32;
			this.collider.y1 = this.y + 16;
			this.collider.y2 = this.y + 17;
		}
		if (this.orientation == 'down')
		{
			this.collider.x1 = this.x + 14;
			this.collider.x2 = this.x + 15;
			this.collider.y1 = this.y +  9;
			this.collider.y2 = this.y + 10;
		}
		if (this.orientation == 'up')
		{
			this.collider.x1 = this.x + 16;
			this.collider.x2 = this.x + 17;
			this.collider.y1 = this.y + 7;
			this.collider.y2 = this.y + 26;
		}
	}
}