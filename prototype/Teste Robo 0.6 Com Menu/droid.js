// depende da game.js
function Enemy(speed){
	var xSpeed;
	var ySpeed;
	var speedValue = speed;
	var orientacao = 'down';
	var ultimoTipoTile = 2;
	
	this.indiceMatriz = 0;
	this.hp = 7;
	// variaveis de animação
	/*
	// cola

	context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
	img = imagem
	sx, sy = start clipping
	swidth, sheight = finish clipping
	x, y = where to place on the canvas
	width, height = altura/largura da imagem (esticar ou comprimir a imagem)
	*/

	var index = 1;
	var frameSize = 64;
	var _step = 0;
	var steps = 2;

	this.resetOnLimit = function(index, limit) // reseta o index se passar do limite especificado
	{
		if (index > limit)
		{
			return 1;
		}
		else return index;
	}

	this.render = function()
	{
		this.updateRobotPosition();
		if (orientacao == 'left')
		{
			this.context.drawImage(sprites.enemy, index*frameSize, 128, frameSize, frameSize, this.x, this.y, frameSize, frameSize);
		}
		if (orientacao == 'right')
		{
			this.context.drawImage(sprites.enemy, index*frameSize, 0, frameSize, frameSize, this.x, this.y, frameSize, frameSize);
		}
		if (orientacao == 'up')
		{
			this.context.drawImage(sprites.enemy, index*frameSize, 192, frameSize, frameSize, this.x, this.y, frameSize, frameSize);
		}
		if (orientacao == 'down')
		{
			this.context.drawImage(sprites.enemy, index*frameSize, frameSize, frameSize, frameSize, this.x, this.y, frameSize, frameSize);
			//console.log(index*64);
		}
		_step++;
		if (_step > 3)
		{
			_step = 0;
			index++;
			//console.log("Index: " + index);
		}
		index = this.resetOnLimit(index, 2);
		//console.log("X: " + this.x + " | X+20: " + this.x + 20);
	}

	this.drawInfo = function()
	{
		// this.context.fillText('(' + this.x + ', ' + this.y + ') (IM: ' + this.indiceMatriz +  ' SPD: ' + speedValue + ')', this.x, this.y);
		this.context.fillText('(IM: ' + this.indiceMatriz +  ' SPD: ' + speedValue + ')', this.x, this.y);
		this.context.fillText('(POS: ' + this.x + ', ' + this.y + ')', this.x, this.y - 10);;
		this.context.fillText('(HP: ' + this.hp + ')', this.x, this.y -20)
		
	}

	this.drawHpBar = function(){
		// HP BAR:
		this.context.fillStyle="#894949";
		this.context.fillRect(this.x+12,this.y+12,35,2) //retangulo fixo: hp bar background
		this.context.fillStyle="#FF0000";
		this.context.fillRect(this.x+12,this.y+12,this.hp*5,2) //retangulo dinâmico: diminui conforme o valor do hp
		this.context.fillStyle="00ff13";
	}

	this.isOutOfCanvas = function()
	{
		if (this.x > canvas.paths.width || this.y > canvas.paths.height)
		{
			//console.log("saiu");
			return true;
		}
	}

	this.updateRobotPosition = function ()
	{
		this.updateCollider();
		this.drawHpBar();

		if (debugInfo == true)
		{
			this.drawInfo();
			this.context.strokeRect(this.x + 20, this.y + 20, 26, 26);
		}
		//console.log('chama a drawDroid');

		var flag =0; //flag pra somente executar as checagens a partir da linha 41 se houver mudança de orientação
		if(orientacao == 'down' && this.y > ((Math.floor(this.indiceMatriz/10)+1)*64)) //checa se a posição do Inimigo é maior que o centro do Tile
		{
			this.indiceMatriz+=10;
			flag = 1;
		}
		else if(orientacao == 'up' && this.y < ((Math.floor(this.indiceMatriz/10)-1)*64))//checa se a posição do Inimigo é menor que o centro do Tile
		{
			this.indiceMatriz-=10;
			flag = 1;
		}
		else if(orientacao == 'right' &&  this.x > ((this.indiceMatriz % 10)+1)*64) //checa se a posição do Inimigo é maior que o centro do Tile
		{
			this.indiceMatriz+=1;
			flag = 1;
		}
		else if (orientacao == 'left' &&  this.x < ((this.indiceMatriz % 10)-1)*64)//checa se a posição do Inimigo é menor que o centro do Tile
		{
			this.indiceMatriz-=1;
			flag = 1;
		}
		if (flag==1){
			if (map[this.indiceMatriz]==6 && ultimoTipoTile!=6){
				ultimoTipoTile = 6;
				if(ySpeed==0){
					ySpeed 	  = -speedValue;
					xSpeed	  = 0;
					orientacao = 'up';
				}
				else{
					xSpeed= -speedValue;
					ySpeed= 0;
					orientacao='left';
				}
			}
			else if (map[this.indiceMatriz]==5 && ultimoTipoTile!=5){
				ultimoTipoTile = 5;
				if(ySpeed!=0){
					ySpeed = 0;
					xSpeed = speedValue;
					orientacao = 'right';
				}
				else{
					ySpeed=-speedValue;
					xSpeed=0;
					orientacao = 'up';
				}
			}
			else if (map[this.indiceMatriz]==4 && ultimoTipoTile!=4){
				ultimoTipoTile = 4;
				if(ySpeed!=0){
					ySpeed = 0;
					xSpeed = -speedValue;
					orientacao = 'left';				
				}
				else{
					ySpeed=speedValue;
					xSpeed=0;
					orientacao = 'down';
				}
			}
			else if (map[this.indiceMatriz]==3 && ultimoTipoTile!=3){
				ultimoTipoTile = 3;
				if(ySpeed != 0){
					ySpeed = 0;
					xSpeed = speedValue;
					orientacao = 'right';
				}
				else{
					ySpeed=speedValue;
					xSpeed =0;
					orientacao = 'down';
				}
			}
		}
	
	this.y+=ySpeed;
	this.x+=xSpeed;

	// desenha o box do enemy:
	// this.context.strokeRect(this.x, this.y, frameSize, frameSize);
	//c.drawImage(sprites.enemy, this.x, this.y);
	}


	this.insertRobot = function ()//Verifica a primeira Tile que não é 0 e insere o robô lá.
	{
		// init
		this.hp = 7;
		var h = 0;
		var v = 0;
		for (i=0; i < linhas*colunas; i++)
		{

			if (map[i] != 0)
			{
				
				this.x = h*tileSize;
				this.y = v*tileSize;
				this.indiceMatriz = i;
				if (map[this.indiceMatriz]==2){
					ySpeed 	  = speedValue;
					xSpeed	  = 0;
				}
				break;
			}
			h += 1;
			if (h >= 10)
			{
				v += 1;
				h = 0;
			}
		}

		this.collider = new Collider(this.x + 20, this.y + 20, this.x + 46, this.y + 46);
		//console.log("enemy created at " + (this.x + 26) +  ", " + (this.y + 26) + ".");
	}

	this.updateCollider = function()
	{
		this.collider.x1 = this.x + 20;
		this.collider.x2 = this.x + 46;
		this.collider.y1 = this.y + 20;
		this.collider.y2 = this.y + 46;
		//console.log("Collider info: " + this.collider.x1 + ", " + this.collider.y1 + " | " + this.collider.x2 + ", " + this.collider.y2);
	}
}