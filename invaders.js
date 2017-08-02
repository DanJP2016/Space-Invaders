var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', {preload:preload, create:create, update:update});


function preload() {
	game.scale.pageAlignHorizontally = true;
	game.scale.pageAlignVertically = true;
	game.load.spritesheet('elements', 'assets/images/elements.png', 16, 10);
	game.load.spritesheet('shields', 'assets/images/shields.png', 16, 10)
	game.load.image('background', 'assets/images/space2.png');
	game.load.image('particle', 'assets/images/particle2.png');
	game.load.image('particle1', 'assets/images/particle1.png');
	game.load.spritesheet('playerBoom', 'assets/images/playerParticles.png', 16, 10);
}//end preload

var player;
var playerX = 400;
var playerY = 550;
var invaders;
var invader1;
var invader2;
var invader3;
var invader4;
var invader5;
var invader6;
var saucer;
var saucerX;
var saucerY = 25;
var speed = 125;
var spawnChance = 0.2;
var shields;
var alienVelX = 50;
var starfield;
var cursors;
var playerWeapon;
var invaderWeapon;
var fireButton;
var emitter;
var saucerParticle;
var playerParticle;
var lives = 3;
var livesText;
var extraLife = 10000;
var score = 0;
var scoreText;
var livingEnemies = [];

function create() {
	//activate the physics engine
	game.physics.startSystem(Phaser.Physics.ARCADE);

	//create the background
	starfield = game.add.tileSprite(0, 0, game.width, game.height, 'background');

	//it's dangerous to go alone, take this! 
	playerWeapon = game.add.weapon(30, 'elements', 10);
	//kill bullet when it leaves world bounds
	playerWeapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	//rotate bullet
	playerWeapon.bulletAngleOffset = 90;
	//set bullet speed
	playerWeapon.bulletSpeed = 600;
	//set fire rate
	playerWeapon.fireRate = 500;

	//they got guns too!
	invaderWeapon = game.add.weapon(30, 'elements', 8);
	invaderWeapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    invaderWeapon.bulletAngleOffset = 90;
	invaderWeapon.bulletSpeed = -300;
	invaderWeapon.fireRate = 600;
	invaderWeapon.autofire = true;


	//setup the player
	player = game.add.sprite(playerX, playerY, 'elements');
	player.frame = 9;
	player.scale.setTo(4, 4);
	player.anchor.setTo(0.5, 0.5);
	game.physics.enable(player, Phaser.Physics.ARCADE);
	player.body.collideWorldBounds = true;

	//tell weapon to track the player 
	playerWeapon.trackSprite(player, 0, 0, false);

	//setup invaders
	invaders = game.add.group();
	invaders.x = 10;
	invaders.y = 45;
	
	createInvaders();

	invaders.setAll('body.collideWorldBounds', true);
	invaders.setAll('body.velocity.x', alienVelX);
	invaders.setAll('body.moves', true);
    
    //shields up!
    shields = game.add.group();
    shields.enableBody = true;
    shields.physicsBodyType = Phaser.Physics.ARCADE;
    shields.x = game.width / 5;
       
    createShields();

    //the ufo
    //setup loop that checks for the chance that the ufo will spawn
    game.time.events.loop(5000, spawnRate, this);

    //setup the emitter
    emitter = game.add.emitter(0, 0, 200);
    emitter.makeParticles('particle');
    emitter.minRotation = 0;
    emitter.maxRotation = 0;
    emitter.setAlpha(1, 0.1, 300);
    emitter.gravity = 100;

   //emitter for when saucer is killed
   saucerParticle = game.add.emitter(0, 0, 200);
   saucerParticle.makeParticles('particle1');
   saucerParticle.minRotation = 0;
   saucerParticle.maxRotation = 0;
   saucerParticle.setAlpha(1, 0.1, 300);
   saucerParticle.gravity = 200;

   playerParticle = game.add.emitter(0, 0, 200);
   playerParticle.makeParticles('playerBoom', [0, 1, 2]);
   playerParticle.minRotation = 0;
   playerParticle.maxRotation = 0;
   playerParticle.setAlpha(1, 0.1, 300);
   playerParticle.gravity = -200;

   //setup player lives
   livesText = game.add.text(game.world.width - 50, 5, 'lives: ' + lives, {font: '24px Monospace', fill: '#fff'});
   livesText.anchor.setTo(0.5, 0);

   //setup score board
   scoreString = 'Score: ';
   scoreText = game.add.text(10, 10, scoreString + score, {font: '24px Monospace', fill: '#fff' });
   scoreText.visible = true;

   //game state
   stateText = game.add.text(game.world.width / 2, game.world.height / 2, ' ', {font: '48px Monospace', fill: '#fff'});
   stateText.anchor.setTo(0.5, 0.5);
   stateText.visible = false;	
             
	//setup movement controls
	cursors = game.input.keyboard.createCursorKeys();
	fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

}//end create

//create the invaders
function createInvaders() {
	for(let y = 0; y < 1; y++) {
		for(let x = 0; x < 10; x++) {
			invader1 = invaders.create(x * 48, 180, 'elements');
			invader1.frame = 0;
			invader1.anchor.setTo(0.5, 0.5);
			invader1.scale.setTo(2, 2);
			game.physics.enable(invader1, Phaser.Physics.ARCADE);
			invader1.animations.add('move1', [0,1], 3, true);
			invader1.play('move1');

			invader2 = invaders.create(x * 48, 150, 'elements');
			invader2.frame = 1;
			invader2.anchor.setTo(0.5, 0.5);
			invader2.scale.setTo(2, 2);
			game.physics.enable(invader2, Phaser.Physics.ARCADE);
			invader2.animations.add('move2', [1,0], 3, true);
			invader2.play('move2');

			invader3 = invaders.create(x * 48, 120, 'elements');
			invader3.frame = 4;
			invader3.anchor.setTo(0.5, 0.5);
			invader3.scale.setTo(2, 2);
			game.physics.enable(invader3, Phaser.Physics.ARCADE);
			invader3.animations.add('move3', [4,5], 3, true);
			invader3.play('move3');
			
			invader4 = invaders.create(x * 48, 90, 'elements');
			invader4.frame = 5;
			invader4.anchor.setTo(0.5, 0.5);
			invader4.scale.setTo(2, 2);
			game.physics.enable(invader4, Phaser.Physics.ARCADE);
			invader4.animations.add('move4', [5,4], 3, true);
			invader4.play('move4');
			
			invader5 = invaders.create(x * 48, 60, 'elements');
			invader5.frame = 6;
			invader5.anchor.setTo(0.5, 0.5);
			invader5.scale.setTo(2, 2);
			game.physics.enable(invader5, Phaser.Physics.ARCADE);
			invader5.animations.add('move5', [6,7], 3, true);
			invader5.play('move5');

			invader6 = invaders.create(x * 48, 30, 'elements');
			invader6.frame = 2;
			invader6.anchor.setTo(0.5, 0.5);
			invader6.scale.setTo(2, 2);
			game.physics.enable(invader6, Phaser.Physics.ARCADE);
			invader6.animations.add('move6', [2,3], 3, true);
			invader6.play('move6');
			
		}
	}
}

function assignWeapon() {
  livingEnemies.length = 0;
    invaders.forEachAlive(invader => livingEnemies.push(invader));
    
    if(livingEnemies.length > 0) {
        var random = game.rnd.integerInRange(0, livingEnemies.length);
        var shooter = livingEnemies[random];
        invaderWeapon.trackSprite(shooter, 0, 0);
    }
}

function createShields() {
	for(let i = 0; i < 4; i++) {
		shield = shields.create(i * 150, 500, 'shields');
		shield.frame = 0;
		shield.scale.setTo(4, 4);
		shield.anchor.setTo(0.5, 0.5);
		shield.health = 100;
		shield.maxHealth = 100;
		shield.body.moves = false;
	}
}

function createUFO() {
	let position = [10, 750];
	saucerX = position[Math.floor(Math.random() * position.length)];

	saucer = game.add.sprite(saucerX, saucerY, 'elements');
	saucer.frame = 11;
	saucer.scale.setTo(2, 2);
	saucer.anchor.setTo(0.5, 0.5);
	game.physics.enable(saucer, Phaser.Physics.ARCADE);
	saucer.checkWorldBounds = true;
	saucer.outOfBoundsKill = true;

	if(saucerX === 750) {
		saucer.body.velocity.x = -speed;
	} else {
		saucer.body.velocity.x = speed;
	}
	
}

function spawnRate() {
	if(saucer === undefined || saucer.alive === false) {
		spawnChance *= 1.15;
		spawnNew();
	}
}

function spawnNew() {
	let random = Math.random();
	if(random < spawnChance) {
		createUFO();
		spawnChance = 0.2;
	}
}

function burst(invader) {
	//adding invader.x/y and invaders.x/y keeps the emitter where it should be when the invaders group descends
	emitter.emitX = invader.x + invaders.x;
	emitter.emitY = invader.y + invaders.y;
	emitter.start(true, 300, null, 10);
}

function saucerBurst(saucer) {
	saucerParticle.emitX = saucer.x;
	saucerParticle.emitY = saucer.y;
	saucerParticle.start(true, 300, null, 15);
}

function playerDie(player) {
	playerParticle.emitX = player.x;
	playerParticle.emitY = player.y;
	playerParticle.start(true, 300, null, 100);
}

function update() {

	//move the invaders back and forth across game zone
	moveInvaders();

		
	//move the player
	if(cursors.left.isDown) {
		player.body.velocity.x = -250;
	} else if(cursors.right.isDown) {
		player.body.velocity.x = 250;
	} else {
		player.body.velocity.x = 0;
	}

			
	if(player.alive === true && fireButton.isDown) {
		playerWeapon.fire();
	}
    
    //invader shoots
    assignWeapon();

 	//invaders move over player y position
 	if(invaders.y >= player.y) {
 		stateText.text = ' Game Over \n Click To Restart';
		stateText.visible = true;
		game.input.onTap.addOnce(restart, this);
 	}

 
    game.physics.arcade.overlap(invaders, playerWeapon.bullets, collisionHandler, null, this);
	game.physics.arcade.overlap(shields, invaderWeapon.bullets, shieldCollision, null, this);
	game.physics.arcade.overlap(saucer, playerWeapon.bullets, playerHitsSaucer, null, this);
	game.physics.arcade.overlap(player, invaderWeapon.bullets, enemyHitsPlayer, null, this);
	game.physics.arcade.overlap(invaders, player, invadersPassPlayer, null, this);
	game.physics.arcade.overlap(shields, invaders, invaderPassShields, null, this);
	game.physics.arcade.overlap(shields, playerWeapon.bullets, playerHitsShield, null, this);
	
}//end update

function collisionHandler(invader, bullet) {
	bullet.kill();
	invader.kill();

	burst(invader);
	 

	if(invaders.countLiving() == 0) {
       //invaderWeapon.autofire = false;
       nextWave();
    }

    //increase the score
    score += 10;
    scoreText.text = scoreString + score;

    if( score >= extraLife) {
    	lives++;
    	extraLife += 10000;
    	livesText.setText('lives: ' + lives);
    }

}

function shieldCollision(shield, bullet) {
	bullet.kill();
	shield.damage(10);
	shield.frame++;
}

function playerHitsSaucer(saucer, bullet) {
	bullet.kill();
	saucer.kill();
	saucerBurst(saucer);
	shieldPower();
}

function enemyHitsPlayer(player, bullet) {
	bullet.kill();
	
	playerDie(player);

	lives--;
	if(lives) {
		livesText.setText('lives: ' + lives);
		player.x = playerX;
		player.y = playerY;
	}

	if(lives <= 0) {
		player.kill();
		livesText.setText('lives: 0');
		stateText.text = ' Game Over \n Click To Restart';
		stateText.visible = true;
		game.input.onTap.addOnce(restart, this);
	}
}

function shieldPower() {
	let healChance = Math.floor(Math.random() * 5);
	let randomHeal = Math.floor(Math.random() * 5);
	if(healChance === randomHeal) {
		shields.forEach(shield => {
			shield.heal(100);
			shield.revive();
			shield.frame = 0;
		});
		
	}
}

function invadersPassPlayer(invader, player) {
	lives = 0;
	player.kill();
	stateText.text = ' Game Over \n Click To Restart';
	stateText.visible = true;
	game.input.onTap.addOnce(restart, this);
}

function invaderPassShields(shield, invader) {
	shield.damage(100);
	invader.kill();
	burst(invader);
}

function playerHitsShield(shield, bullet) {
	bullet.kill();
}


function moveInvaders() {
	for(let i = 0; i < livingEnemies.length; i++) {
		if(livingEnemies[i].position.x > 750) {
			invaders.y += 1;
			invaders.setAll('body.velocity.x', -alienVelX)
		}

		if(livingEnemies[i].position.x < 10) {
			//invaders.y += 1;
			invaders.setAll('body.velocity.x', alienVelX);
		}

	}
}

function nextWave() {
	invaders.removeAll();
	createInvaders();
	invaders.x = 10;
	invaders.y = 45;
}

//restart game
function restart() {

	//lives.callAll('revive');
	lives = 3;
	livesText.setText('lives: ' + lives);

	//reset score
	score = 0;
	scoreText.text = scoreString + score;

	//bring back the invaders
	invaders.removeAll();
	createInvaders();
	invaders.x = 10;
	invaders.y = 45;


	//bring back the player
	player.revive();

	//bring back the shields
	shields.removeAll();
	createShields();

	stateText.visible = false;
}
