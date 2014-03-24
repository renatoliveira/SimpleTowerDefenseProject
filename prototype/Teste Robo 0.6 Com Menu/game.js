// variáveis que precisam de sprites (como botões, por exemplo) devem ser
// iniciadas depois dos sprites serem iniciados

// tiles e mapa
var tileSize = 64,
    linhas   = 10,
    colunas  = 10,
    objectsSelected = 0;

// arrays de objetos
	listaInimigos = new Array(),
	towers        = new Array(),
	lasers        = new Array(),
	buttons       = new Array();

// janela, mouse
	SCREEN_W = window.innerWidth,
	SCREEN_H = window.innerHeight,
	mx       = 0,
	my       = 0,

// game
	// availableEnergy = 100, // energia atual
	// totalEnergy     = 100, // energia máxima
	spawning        = true;
	waveNumber      = 5, // número da wave de inimigos
	enemyNumber     = undefined, // numero de inimigos da wave
	enemiesSpawned  = 0; // numero de inimigos que já foram criados (controle de wave)

// timing de spawn de inimigos
	steps        = 0, // contador
	spawnSeconds = 0.8, // tempo de spawn dos inimigos, em segundos
	spawnTimer   = spawnSeconds * 100; // converte pra ms

// console.log(SCREEN_W);

// mostra as infos dos objetos
var debugInfo = true;

var wasGameRenderCalled = false;

// 0    = nada   (1)
// 1-6  = mapas  (6)
// 7-10 = torres (4)
var map = new Array(0,2,0,0,0,9,0,0,0,0,
				    0,2,0,0,8,3,1,1,4,0,
				    0,2,0,0,0,2,0,0,2,0,
				    8,5,1,1,1,6,7,0,2,0,
				    0,10,0,0,0,0,0,0,2,0,
				    0,0,0,0,0,0,0,0,2,0,
				    8,3,1,1,1,4,7,0,2,0,
				    0,2,0,0,0,2,0,0,2,0,
				    0,2,0,0,8,5,1,1,6,0,
				    0,2,0,0,0,0,0,0,0,0);

/* os canvas vão aqui
 * o contexto (getContext) não funciona dentro da função, então ele fica
 * lá em baixo, depois da última função do script, e antes do 
 * window.onload, que vai iniciar o script.
 */
canvas = new function()
{
	this.enemies        = document.createElement('canvas');
	this.enemies.width  = 840;
	this.enemies.height = 640;
	
	this.paths          = document.createElement('canvas');
	this.paths.width    = 840;
	this.paths.height   = 640;
 
	this.towers         = document.createElement('canvas');
	this.towers.width   = 840;
	this.towers.height  = 640;
 
	this.lasers         = document.createElement('canvas');
	this.lasers.width   = 840;
	this.lasers.height  = 640;

	this.gameInterfaceCanvas        = document.createElement('canvas');
	this.gameInterfaceCanvas.width  = 840;
	this.gameInterfaceCanvas.height = 640;

	console.log('canvas created');
}

/* mesma coisa que o canvas, reunindo todas as imagens numa única variável
 * acessível como método. Para chamar uma imagem noutro script ou mesmo nesse,
 * basta usar, por exemplo, sprites.paths ou sprites.enemy.
*/

sprites = new function()
{
	this.paths         = new Image();
	this.enemy         = new Image();
	this.tower         = new Image();
	this.towerOff      = new Image();
	this.laser         = new Image();
	this.batteryCover  = new Image();
	this.introScreen   = new Image();
	this.botao         = new Image();
	this.gameButtons   = new Image();
	this.gameInterface = new Image();
	this.selector      = new Image();


	this.paths.src    = "imgs/caminhos.png";
	this.enemy.src    = "imgs/viruszin.png";
	this.tower.src    = "imgs/torre_canhao_v2.png";
	this.towerOff.src = "imgs/torre_canhao_v2OFF.png"
	this.laser.src    = "imgs/bullet.png";
	this.batteryCover.src = "imgs/batteryCover.png"
	this.introScreen.src  = "imgs/introScreen.png"
	this.gameButtons.src  = "imgs/botoes.png";
	this.botao.src        = "imgs/botao.png";
	this.gameInterface.src = "imgs/interface_v1.png";
	this.selector.src = "imgs/selector.png";
	console.log('images loaded');
}

// variáveis de interface
var gameStartButton = new Button('start', sprites.botao, 0, true, 840/2 - 126, 400, 252, 54);
var upgradeButton   = new Button('upgrade', sprites.gameButtons, 0, true, 18, 162, 64, 64);
var removeButton    = new Button('remove', sprites.gameButtons, 64, true, 18, 226, 64, 64);
var selector        = new Selector();
var energyBar       = new Bar(750, 500, 1000, sprites.batteryCover); // barra de energia principal
var selectedObject  = new SelectedObject();

function initInterface()
{	
	energyBar.visible = true;

	upgradeButton.context  = canvas.gameInterfaceContext;
	removeButton.context   = canvas.gameInterfaceContext;
	selector.context       = canvas.gameInterfaceContext;
	selectedObject.context = canvas.gameInterfaceContext;

	buttons.push(removeButton);
	buttons.push(upgradeButton);
	delete upgradeButton, removeButton;
}

// seta o número de inimigos com base no número da wave
function setWave()
{
	enemyNumber  = Math.floor(waveNumber + 10 * 0.5);
	spawnSeconds = 0.8 - waveNumber * 0.1
	console.log('SpawnSeconds: ' + spawnSeconds);
}

function spawnEnemy()
{
	// cria um inimigo com velocidade baseada
	// no valor da wave atual
	createNewRobot(waveNumber, Math.floor(waveNumber * 0.5 + 1));
}

// restaura a energia com o tempo
function restoreEnergy()
{
	if (energyBar.getCurrentEnergy() < energyBar.getTotalEnergy())
	{
		energyBar.increaseEnergy(50);
		console.log('restore');
	}
}


// testa o mouse over
function mouseOverHandler(event)
{
	mx = event.clientX - (SCREEN_W - 840)/2;
	my = event.clientY - 8; // -8 por causa da distância da barra do navegador até o topo do canvas
	// console.log('X: ' + mx + ', Y: ' + my);

	for (var i = 0; i < buttons.length; i++)
	{
		// console.log(buttons.length);
		if (!buttons.length == 0)
		{
			buttons[i].hoverIt(mx,my);
		}
	}

	selector.getMouseCoordinates(mx, my);
}

// mostra as coordenadas do mouse no console
// altera status da torre clicada
function mouseClickHandler(event)
{
	mx = event.clientX - (SCREEN_W - 840)/2;
	my = event.clientY - 8;

	// console.log('X: ' + mx + ', Y: ' + my);
	
	selector.setSelectedObjectPosition(mx, my);

	for (var i = 0; i < towers.length; i++)
	{
		if (mx >= towers[i].x &&
			mx <= towers[i].x+64 &&
			my >= towers[i].y &&
			my <= towers[i].y+64 &&
			wasGameRenderCalled == true)
		{
			towers[i].changeStatus();

			// seletor
			if (towers[i].isSelected)
			{
				towers[i].isSelected = false;
				console.log('torre '  + towers[i].towerNumber +  'false');
			}
			else {
				for (var x = 0; x < towers.length; x++)
				{
					if (towers[x].isSelected)
					{
						towers[x].isSelected = false;
						console.log('torre ' + towers[x].towerNumber + " is false");
					}
				}
				towers[i].isSelected = true;
				selectedObject.sprite = towers[i].sprite;
				console.log('torre ' + towers[i].towerNumber + ' true');
			}
			// fim seletor
		}
	}

	if (!wasGameRenderCalled)
	{
		// console.log('mouse render not called');

		if (gameStartButton.mouseIsOver(mx,my))
		{
			clearScreen();	
			gameRenderLoop = setInterval(GameRender, 30);
			wasGameRenderCalled = true;
			clearInterval(gameIntroLoop);
			buttons.splice(buttons.indexOf(gameStartButton),1);
		}

	}
}

// testa colisão entre
function testCollision()
{
	var n, m;
	for (n = 0; n < lasers.length; n++)
	{
		for (m = 0; m < listaInimigos.length; m++)
		{
			if (lasers[n].collider.isColliding(listaInimigos[m].collider))
			{
				audio.play('hit');
				if (listaInimigos[m].hp > 0)  
				{
					audio.hitSound.play();
					listaInimigos[m].hp -= lasers[n].dmg;
					lasers.splice(n,1);
					if (listaInimigos[m].hp <= 0)
					{
						listaInimigos.splice(m,1);
						audio.play('dead');
						break;
					}
					break;
				}
			}
		}
	}
}

function placeTowerAt(x,y,o)
{
	var id = towers.length;
	var t  = new Tower(x+100,y,o,id);
	t.context = canvas.towersContext;
	towers.push(t);
}

// desenha os tiles na tela, usando a drawMap
function drawTile(x,y,h,v)
{
	canvas.pathsContext.drawImage(sprites.paths, x, y, tileSize, tileSize, h*tileSize + 100, v*tileSize, tileSize, tileSize);
}

// lê o array, e manda a drawTile desenhar o mapa
// essa drawMap fica em loop
// OBS: não instanciar nada nela

function drawMap()
{
	var h = 0;
	var v = 0;
	for (i=0; i < linhas*colunas; i++)
	{
		// paths
		if (map[i] == 0)
		{
			drawTile(64,64,h,v);
		}
		else if (map[i] == 1)
		{
			drawTile(64,0,h,v);
		}
		else if (map[i] == 2)
		{
			drawTile(0,64,h,v);
		}
		else if (map[i] == 3)
		{
			drawTile(0,0,h,v);
		}
		else if (map[i] == 4)
		{
			drawTile(129,0,h,v);
		}
		else if (map[i] == 5)
		{
			drawTile(0,129,h,v);
		}
		else if (map[i] == 6)
		{
			drawTile(129,129,h,v);
		}
		// move a linha
		h += 1;
		if (h >= 10)
		{
			v += 1;
			h = 0;
		}
	}
}

// chamar essa draw só no Init.
// OBS: tudo que for instanciado uma só vez, instanciar aqui

function drawInitMap()
{
	var h = 0;
	var v = 0;
	for (i=0; i < linhas*colunas; i++)
	{
		// paths
		if (map[i] == 0)
		{
			drawTile(64,64,h,v);
		}
		if (map[i] == 1)
		{
			drawTile(64,0,h,v);
		}
		if (map[i] == 2)
		{
			drawTile(0,64,h,v);	
		}
		if (map[i] == 3)
		{
			drawTile(0,0,h,v);
		}
		if (map[i] == 4)
		{
			drawTile(129,0,h,v);
		}
		if (map[i] == 5)
		{
			drawTile(0,129,h,v);
		}
		if (map[i] == 6)
		{
			drawTile(129,129,h,v);
		}

		// torres
		if (map[i] == 7)
		{
			placeTowerAt(h*64, v*64, 'left');
		}
		if (map[i] == 8)
		{
			placeTowerAt(h*64, v*64, 'right');
			//console.log(towerID);
		}
		if (map[i] == 9)
		{
			placeTowerAt(h*64, v*64, 'down');
		}
		if (map[i] == 10)
		{
			placeTowerAt(h*64, v*64, 'up');
		}

		// move a linha
		h += 1;
		if (h >= 10)
		{
			v += 1;
			h = 0;
		}
	}
}

function createNewRobot(min, max){
	var newRobotSpeed = Math.floor(Math.random() * (max - min + 1)) + min;
	console.log(newRobotSpeed);
	var robot     = new Enemy(newRobotSpeed);
	robot.context = canvas.droidsContext;
	robot.insertRobot();
	listaInimigos.push(robot);
}


function drawIntro(){
	canvas.gameInterfaceContext.clearRect(0,0,840,640);
	canvas.gameInterfaceContext.strokeRect(0,0,canvas.gameInterfaceCanvas.width,canvas.gameInterfaceCanvas.height);
	if (document.readyState == 'complete')
	{
		canvas.pathsContext.drawImage(sprites.introScreen, 100,0);
		gameStartButton.render();
	}
}


// atualiza a posição dos enemies na tela
function GameRender(){

	SCREEN_W = window.innerWidth;
	SCREEN_H = window.innerHeight;

	var index;
	if (document.readyState == 'complete'){
		clearScreen();
		drawMap();
		interfaceRender();
		energyBar.render();
		selectedObject.render();

		// render inimigos
		for (index = listaInimigos.length-1; index >=0 ; index--)
		{
			listaInimigos[index].render();
			if (listaInimigos[index].isOutOfCanvas())
			{
				listaInimigos.splice(index,1);
			}
		}

		// render torres
		for (index = 0; index < towers.length; index++)
		{
			towers[index].render();
		}
		
		// render lasers
		for (index = 0; index < lasers.length; index++)
		{
			lasers[index].render();
			if (lasers[index].isOutOfCanvas())
			{
				lasers.splice(index,1);
			}
		}

		for (index = 0; index < buttons.length; index++)
		{
			buttons[index].render();
		}

		selector.render();

		// testa colisão
		testCollision();

		// borda branca e infos 
		if (debugInfo)
		{
			canvas.gameInterfaceContext.strokeRect(0,0,canvas.gameInterfaceCanvas.width,canvas.gameInterfaceCanvas.height);
			canvas.pathsContext.strokeRect(0,0,canvas.paths.width,canvas.paths.height);
			canvas.pathsContext.fillText('Droids: ' + listaInimigos.length, 20, 320);
			canvas.pathsContext.fillText('Towers: ' + towers.length, 20, 330);
			canvas.pathsContext.fillText('Lasers: ' + lasers.length, 20, 340);
			canvas.pathsContext.fillText('Energy: ' + energyBar.getCurrentEnergy(), 20, 310);
			canvas.pathsContext.fillText('Spawn: ' + spawning, 20, 300);
		}

		steps++;
		//console.log('Step ' + steps + ' de ' + spawnTimer);
		if (steps == spawnTimer && spawning == true)
		{
			spawnEnemy();
			enemiesSpawned++;
			console.log('Inimigo ' + enemiesSpawned + ' de ' + enemyNumber);
			if (enemiesSpawned == enemyNumber)
			{
				// se chegamos ao final da wave,
				// não vamos mais criar inimigos
				spawning = false;
			}
			steps = 0;
		}
	}
}

function clearScreen(){
	canvas.droidsContext.clearRect(0,0,SCREEN_W, SCREEN_H);
	canvas.pathsContext.clearRect(0,0,SCREEN_W, SCREEN_H);
	canvas.towersContext.clearRect(0,0,SCREEN_W, SCREEN_H);
	canvas.lasersContext.clearRect(0,0,SCREEN_W,SCREEN_H);
	canvas.gameInterfaceContext.clearRect(0,0,840,640);
}

function encerraGame(){
	clearInterval(gameIntroLoop);
	clearInterval(energyRestoreLoop);
	clearScreen();
}

function interfaceRender()
{
	canvas.gameInterfaceContext.drawImage(sprites.gameInterface, 0, 0, 840, 640, 0, 0, 840, 640);
}

var gameIntroLoop,
	energyRestoreLoop,
	gameRenderLoop;

function init()
{
	audio.initialize();
	drawInitMap();

	setWave();

	initInterface();

	gameStartButton.context = canvas.gameInterfaceContext;
	buttons.push(gameStartButton);
	delete gameStartButton; // apaga a referência do botão, que não será mais necessária (pois está no array agora)

	gameIntroLoop     = setInterval(drawIntro, 100);
	energyRestoreLoop = setInterval(restoreEnergy, 1000);
}

canvas.droidsContext        = canvas.enemies.getContext('2d');
canvas.pathsContext         = canvas.paths.getContext('2d');
canvas.towersContext        = canvas.towers.getContext('2d');
canvas.lasersContext        = canvas.lasers.getContext('2d');
canvas.gameInterfaceContext = canvas.gameInterfaceCanvas.getContext('2d');

canvas.pathsContext.fillStyle         = '#00ff13';
canvas.droidsContext.fillStyle        = '#00ff13';
canvas.lasersContext.fillStyle        = '#FF0000';
canvas.towersContext.fillStyle        = '#FFFFFF';
canvas.gameInterfaceContext.fillStyle = 'white';

canvas.pathsContext.strokeStyle         = 'white';
canvas.lasersContext.strokeStyle        = 'red';
canvas.droidsContext.strokeStyle        = 'blue';
canvas.towersContext.strokeStyle        = 'white';
canvas.gameInterfaceContext.strokeStyle = 'white';
canvas.gameInterfaceContext.font        = '15pt Calibri';

document.getElementById('container').appendChild(canvas.paths);
document.getElementById('container').appendChild(canvas.enemies);
document.getElementById('container').appendChild(canvas.towers);
document.getElementById('container').appendChild(canvas.lasers);
document.getElementById('container').appendChild(canvas.gameInterfaceCanvas);

window.onload = init();
