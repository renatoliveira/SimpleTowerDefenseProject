/*
 * sprite = sprite a ser usado
 * hover  = o botão vai mudar com o hover?
 * x, y   = posição dele no canvas
 * sizex,
 * sizey  = tamanho do botão em X e em Y

 * obs: o sprite a ser utilizado deve conter o botão normal e o botão pressionado, lado a lado.
 *      o botão pressionado vem em primeiro lugar, e ele pressionado do lado.

	ex: gameStartButton
	 _______________ _______________
	| 252x54        |        252x54 |
	|_______________|_______________|
*/
function Button(name, sprite, posInSprite, hashover, x, y, sizex, sizey)
{
	this.name   = name;
	this.x      = x;
	this.y      = y;
	this.sprite = sprite;
	this.hovering = false;

	var hashover    = hashover;
	var spriteSizeX = sizex;
	var spriteSizeY = sizey;
	var posInSprite = posInSprite;

	this.render = function()
	{
		if (hashover && (this.mouseIsOver() || this.hovering))
		{
			// console.log('aa');
			this.context.drawImage(this.sprite, spriteSizeX, posInSprite, spriteSizeX, spriteSizeY, this.x, this.y, spriteSizeX, spriteSizeY);
		}
		else this.context.drawImage(this.sprite, 0, posInSprite, spriteSizeX, spriteSizeY, this.x, this.y, spriteSizeX, spriteSizeY);
	}

	this.mouseIsOver = function(mouseX, mouseY)
	{
		// this.drawInfo();
		if (mouseX >= this.x &&
			mouseX <= this.x + spriteSizeX &&
			mouseY >= this.y &&
			mouseY <= this.y + spriteSizeY)
		{
			// console.log('mouse em cima');
			// this.drawInfo(mouseX, mouseY);
			return true;
		}
		else return false;
	}

	this.hoverIt = function(param1, param2)
	{
		if (this.mouseIsOver(param1, param2))
		{
			this.hovering = true;
		}
		else this.hovering = false;
	}

	this.drawInfo = function(mouseX, mouseY)
	{
		this.context.strokeRect(this.x, this.y, spriteSizeX, spriteSizeY);
		// console.log("This: " + this.x + ", " + this.y);
		// console.log("Mouse: " + mouseX + ", " + mouseY);
	}
}

function Selector()
{
	this.x = 0;
	this.y = 0;

	var spriteSizeX = 64;
	var spriteSizeY = 64;
	var mouseX;
	var mouseY;

	var selectedObjectX,
		selectedObjectY = undefined;

	this.setSelectedObjectPosition = function(mx, my)
	{
		selectedObjectX = Math.floor((mx - 100) / 64) * 64 + 100;
		selectedObjectY = Math.floor(mouseY/64) * 64;
	}

	this.getMouseCoordinates = function(mx, my)
	{
		mouseX = mx;
		mouseY = my;
	}

	this.render = function()
	{
		// console.log(mouseX + ", " + mouseY);
		this.x = Math.floor((mouseX - 100) / 64) * 64 + 100;
		this.y = Math.floor(mouseY/64) * 64;
		//console.log(this.x);

		// para não invadir a interface
		if (this.x < 100)
		{
			this.x = 100;
		}
		else if (this.x > 676)
		{
			this.x = 676;
		}

		if (selectedObjectX != undefined && selectedObjectY != undefined && selectedObjectX >=100 && selectedObjectX <= 676)
		{
			this.context.drawImage(sprites.selector, 64, 0, spriteSizeX, spriteSizeY, selectedObjectX, selectedObjectY, spriteSizeX, spriteSizeY);
		}
		// console.log(this.x);
		this.context.drawImage(sprites.selector, 0, 0, spriteSizeX, spriteSizeY, this.x, this.y, spriteSizeX, spriteSizeY);
	}
}

function SelectedObject()
{
	this.x = 18;
	this.y = 28;
	this.sprite = undefined;

	var spriteSize = 64;
	var spriteX = spriteX;
	var spriteY = spriteY;

	this.render = function()
	{
		if (this.sprite != undefined)
		{
			console.log('sprite diferente de undefined');
			//this.context.drawImage(sprite, spriteX, spriteY, spriteSize, spriteSize, this.x, this.y, spriteSize, spriteSize);
		}
	}
}

// function Sprite(sprite, x1,y1, x2,y2, sx, sy)
// {
// 	this.sprite = sprite;
// 	this.x1 = x1;
// 	this.x2 = x2;
// 	this.y1 = y1;
// 	this.y2 = y2;
// 	this.spriteSizeX = sx;
// 	this.spriteSizeY = sy;

// 	this.render = function(context,x,y)
// 	{
// 		context.drawImage(this.sprite, this.x1, this.y1, this.x2, this.y2, x, y, this.spriteSizeX, this.spriteSizeY);
// 	}
// }
