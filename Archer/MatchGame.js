class MatchGame extends Phaser.Scene {
    constructor(){
        super({ key: "MatchGame"});
    }

    preload() {
        this.load.image('player','https://content.codecademy.com/courses/learn-phaser/physics/codey.png');
        this.load.image('platform', 'https://content.codecademy.com/courses/learn-phaser/physics/platform.png');
        this.load.image('arrow','PictureAnim/Arrow.png');
        this.load.image('axe','PictureAnim/Axe.png');
        this.load.image('background','PictureAnim/Background.png');
    }
    create() {
        //Background
        this.add.image(0, 0, 'background').setOrigin(0,0).setScale(3);

        //Map
        gameState.platform = this.physics.add.staticGroup();
        gameState.platform.create(150,600,'platform');
        gameState.platform.create(850,600,'platform');


        //Player 1
        gameState.character = this.physics.add.sprite(100,100,'player');
        this.physics.add.collider(gameState.character,gameState.platform);

        //Player 2
        gameState.character2 = this.physics.add.sprite(800,100,'player');
        this.physics.add.collider(gameState.character2,gameState.platform);

        
        //Arrow clone create.
        var Arrow = new Phaser.Class({

            Extends: Phaser.Physics.Arcade.Image,

            initialize:

                function Bullet(scene) {
                    Phaser.Physics.Arcade.Image.call(this, scene, 0, 0, 'axe');
                    this.speed =  Phaser.Math.GetSpeed(400,1);
                },

            fire: function (x, y, type) {
                this.type = type;
                this.setPosition(x+30, y-4);
                gameState.playerOldX = x;
                gameState.playerOldY = y;
                this.setActive(true);
                this.setVisible(true);

                // Client.sendTest();
            },

            update: function (time, delta) {
                if (this.type === 'R') {
                    let x = this.speed * delta;
                    this.x += x - 3;
                    this.y += -4*x;
                } else if (this.type === 'L') {
                    // this.x -= this.speed * delta;
                    // this.y -= this.speed * delta;
                }

                if (this.x > gameState.playerOldX + 2000 || this.x < gameState.playerOldX - 2000 || gameState.takeShootCharac2 == 1) {
                    this.setActive(false);
                    this.setVisible(false);
                    this.destroy(); // find function to delete
                    gameState.takeShootCharac2 = 0;
                }
                                
            }
        });

        gameState.arrows = this.physics.add.group({
            classType: Arrow,
            maxsize: 1,
            runChildUpdate: true,
        });
        //gameState.arrow = gameState.arrows.get();
        //gameState.arrow.body.setAllowGravity(false);

        //Health
        gameState.healthText = this.add.text(50, 0, 'Health: 0',{font:'40px Times New Roman', fill: '#FFFFFF'});
        gameState.healthText2 = this.add.text(750, 0, '0 :Health',{font:'40px Times New Roman', fill: '#FFFFFF'});

        //Player touch Axe
        this.physics.add.overlap(gameState.character2, gameState.arrows, () => {
            gameState.healthCharacter2 += -100;
            gameState.takeShootCharac2 = 1;
        })
    }
    update() {
        //Health
        gameState.healthText.setText(`Health: ${gameState.healthCharacter}`);
        gameState.healthText2.setText(`${gameState.healthCharacter2} :Health`);
        
        //Move
        gameState.cursors = this.input.keyboard.createCursorKeys();
        if (gameState.cursors.left.isDown) {
            gameState.character.setVelocityX(-gameState.speedCharacter);
            gameState.keyArrow = 0;
            clearTimeout(gameState.timeChargeFunction);
        } else
        if (gameState.cursors.right.isDown) {
            gameState.character.setVelocityX(gameState.speedCharacter);
            gameState.keyArrow = 0;
            clearTimeout(gameState.timeChargeFunction);
        } else
        {
            gameState.character.setVelocityX(0);
        }

        //Shoot Arrow
        if (gameState.cursors.right.isUp && gameState.cursors.left.isUp && gameState.keyArrow == 2) {
            gameState.keyArrow = 0;
            gameState.arrow = gameState.arrows.get();
            gameState.arrow.setScale(0.05);
            gameState.arrow.setVelocityY(1200);
            gameState.arrow.setTint('0xFF0000')
            gameState.arrow.body.angularVelocity = 360 * 2;
            // gameState.arrow.body.setAllowGravity(false);
            if (gameState.arrow !== null) {
                // gameState.arrow.body.setAllowGravity(false);

                if (gameState.arrow) {
                    gameState.arrow.fire(gameState.character.x, gameState.character.y, 'R');
                }
            };
        };

        //Charge Arrow (Take Arrow)
        if (gameState.cursors.right.isUp && gameState.cursors.left.isUp && gameState.keyArrow == 0) {
            gameState.keyArrow = 1;
            gameState.timeChargeFunction = setTimeout(() => {
                if (gameState.cursors.right.isUp && gameState.cursors.left.isUp && gameState.keyArrow == 1) {
                    gameState.keyArrow = 2;  
                }      
            },gameState.chargeTime);
        }

        //Character die from falling
    }
}