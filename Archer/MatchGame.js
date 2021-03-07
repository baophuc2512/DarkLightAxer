class MatchGame extends Phaser.Scene {
    constructor(){
        super({ key: "MatchGame"});
    }

    preload() {
        this.load.image('player','https://content.codecademy.com/courses/learn-phaser/physics/codey.png');
        this.load.image('platform', 'https://content.codecademy.com/courses/learn-phaser/physics/platform.png');
        this.load.image('arrow','PictureAnim/Arrow.png');
    }
    create() {
        gameState.character = this.physics.add.sprite(100,100,'player');
        gameState.platform = this.physics.add.staticGroup();
        gameState.platform.create(150,600,'platform');
        gameState.platform.create(850,600,'platform');
        this.physics.add.collider(gameState.character,gameState.platform);


        //Arrow clone create.
        var Arrow = new Phaser.Class({

            Extends: Phaser.Physics.Arcade.Image,

            initialize:

                function Bullet(scene) {
                    Phaser.Physics.Arcade.Image.call(this, scene, 0, 0, 'arrow');
                    this.speed =  Phaser.Math.GetSpeed(400,1);
                },

            fire: function (x, y, type) {
                this.type = type;
                this.setPosition(x+75, y-5);
                gameState.playerOldX = x;
                this.setActive(true);
                this.setVisible(true);
            },

            update: function (time, delta) {
                if (this.type === 'R') {
                    this.x += this.speed * delta;
                    this.y += -this.speed * delta;
                } else if (this.type === 'L') {
                    this.x -= this.speed * delta;
                    this.y -= this.speed * delta;
                }

                if (this.x > gameState.playerOldX + 2000 || this.x < gameState.playerOldX - 2000) {
                    this.setActive(false);
                    this.setVisible(false);
                    this.x = 100000; // find function to delete
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
        gameState.healthText = this.add.text(0, 0, 'Health: 0',{font:'40px Times New Roman', fill: '#FFFFFF'});
        
    }
    update() {
        //Health
        gameState.healthText.setText(`Health: ${gameState.healthCharacter}`);

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
            gameState.arrow.setScale(0.08);
            gameState.arrow.body.setAllowGravity(true);
            if (gameState.arrow !== null) {
                gameState.arrow.body.setAllowGravity(true);

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