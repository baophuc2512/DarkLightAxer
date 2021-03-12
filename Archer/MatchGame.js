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
        this.load.spritesheet('character','PictureAnim/SkeletonWalk.png', {
            frameWidth: 22,
            frameHeight: 36,
        });
        this.load.spritesheet('characterAttack','PictureAnim/SkeletonAttack.png', {
            frameWidth: 43,
            frameHeight: 36,
        });
    }
    create() {
        //Background
        this.add.image(0, 0, 'background').setOrigin(0,0).setScale(3);

        //Map
        gameState.platform = this.physics.add.staticGroup();
        gameState.platform.create(150,600,'platform');
        gameState.platform.create(850,600,'platform');


        //Player 1
        gameState.character = this.physics.add.sprite(100,100,'character');
        gameState.character.setScale(3);
        this.physics.add.collider(gameState.character,gameState.platform);

        //Player 2
        gameState.character2 = this.physics.add.sprite(800,100,'player');
        this.physics.add.collider(gameState.character2,gameState.platform);

        
        //Arrow clone create. (Player 1);
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
            },

            update: function (time, delta) {
                if (this.type === 'R') {
                    let x = this.speed * delta;
                    this.x += x - 3;
                    this.y += -4*x;
                } 

                if (this.x > gameState.playerOldX + 2000 || this.x < gameState.playerOldX - 2000 || gameState.takeShootCharac == 1 || this.y > gameState.playerOldY + 2000 || this.y > gameState.playerOldY + 2000) {
                    this.setActive(false);
                    this.setVisible(false);
                    this.destroy(); // find function to delete
                    gameState.takeShootCharac = 0;
                }
                                
            }
        });

        //Arrow clone create. (Player 2);
        var Arrow2 = new Phaser.Class({

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
            },

            update: function (time, delta) {
                if (this.type === 'L') {
                    let x = this.speed * delta;
                    this.x -= x - 3;
                    this.y += -4*x;
                } 

                if (this.x > gameState.playerOldX + 2000 || this.x < gameState.playerOldX - 2000 || gameState.takeShootCharac2 == 1 || this.y > gameState.playerOldY + 2000 || this.y > gameState.playerOldY + 2000) {
                    this.setActive(false);
                    this.setVisible(false);
                    this.destroy(); // find function to delete
                    gameState.takeShootCharac2 = 0;
                }
                                
            }
        });

        //Create Arrow Clone Character 1.
        gameState.arrows = this.physics.add.group({
            classType: Arrow,
            maxsize: 5,
            runChildUpdate: true,
        });
        //Create Arrow Clone Character 2.
        gameState.arrows2 = this.physics.add.group({
            classType: Arrow2,
            maxsize: 5,
            runChildUpdate: true,
        });
        //gameState.arrow = gameState.arrows.get();
        //gameState.arrow.body.setAllowGravity(false);

        //Health
        gameState.healthText = this.add.text(50, 0, 'Health: 0',{font:'40px Times New Roman', fill: '#FFFFFF'});
        gameState.healthText2 = this.add.text(750, 0, '0 :Health',{font:'40px Times New Roman', fill: '#FFFFFF'});

        //Player touch Axe
        this.physics.add.overlap(gameState.character, gameState.arrows2, () => {
            gameState.healthCharacter += -100;
            gameState.takeShootCharac2 = 1;
        })
        this.physics.add.overlap(gameState.character2, gameState.arrows, () => {
            gameState.healthCharacter2 += -100;
            gameState.takeShootCharac = 1;
        })

        //Create Animation
        this.anims.create({
            key:'walk',
            frames: this.anims.generateFrameNumbers('character', {
                start: 0,
                end: 12,
            }),
            frameRate: 20,
            repeat: -1,
        });
        this.anims.create({
            key:'attack',
            frames: this.anims.generateFrameNumbers('characterAttack', {
                start: 0,
                end: 17,
            }),
            frameRate: 17.5,
            repeat: -1,
        })
    }
    update() {
        

        //Health
        gameState.healthText.setText(`Health: ${gameState.healthCharacter}`);
        gameState.healthText2.setText(`${gameState.healthCharacter2} :Health`);
        
        //Move player master
        gameState.cursors = this.input.keyboard.createCursorKeys();
        if (gameState.cursors.left.isDown) {
            gameState.character.setVelocityX(-gameState.speedCharacter);
            gameState.character.anims.play('walk', true);
            gameState.character.flipX = true;
            gameState.keyArrow = 0;
            clearTimeout(gameState.timeChargeFunction);

            // Send to client 
            Client.move(true);
            gameState.isStop = false;
        } else if (gameState.cursors.right.isDown) {
            gameState.character.setVelocityX(gameState.speedCharacter);
            gameState.character.anims.play('walk', true);
            gameState.character.flipX = false;
            gameState.keyArrow = 0;
            clearTimeout(gameState.timeChargeFunction);

            // Send to client 
           Client.move(false);
           gameState.isStop = false;
        } else {
            gameState.character.setVelocityX(0);
            gameState.character.anims.play('attack', true);
            gameState.character.flipX = false;

            // Send to client 
            if (!gameState.isStop)  {
                Client.stop();
                gameState.isStop = true;
            }

        }

        //Shoot Arrow (Player 1)
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

        //Shoot Arrow (Player 2)
    
        if (gameState.keyArrow2 == 2) {
            gameState.keyArrow2 = 0;
            gameState.arrow2 = gameState.arrows2.get();
            gameState.arrow2.setScale(0.05);
            gameState.arrow2.setVelocityY(1200);
            gameState.arrow2.setTint('0x55FF00');
            gameState.arrow2.body.angularVelocity = 360 * 2;
            // gameState.arrow.body.setAllowGravity(false);
            if (gameState.arrow2 !== null) {
                // gameState.arrow.body.setAllowGravity(false);

                if (gameState.arrow2) {
                    gameState.arrow2.fire(gameState.character2.x, gameState.character2.y, 'L');
                }
            };
        };
        //Charge Arrow (Take Arrow, Player 1)
        if (gameState.cursors.right.isUp && gameState.cursors.left.isUp && gameState.keyArrow == 0) {
            gameState.keyArrow = 1;
            gameState.timeChargeFunction = setTimeout(() => {
                if (gameState.cursors.right.isUp && gameState.cursors.left.isUp && gameState.keyArrow == 1) {
                    gameState.keyArrow = 2;  
                }      
            },gameState.chargeTime);
        }

        //Charge Arrow (Take Arrow, Player 2)
        if (gameState.keyArrow2 == 0) {
            gameState.keyArrow2 = 1;
            gameState.timeChargeFunction2 = setTimeout(() => {
                if (gameState.keyArrow2 == 1) {
                    gameState.keyArrow2 = 2;  
                }      
            },gameState.chargeTime2);
        }

        //Character die from falling
    }
}