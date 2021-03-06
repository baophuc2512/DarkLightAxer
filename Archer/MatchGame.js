class MatchGame extends Phaser.Scene {
    constructor(){
        super({ key: "MatchGame"});
    }

    preload() {
        this.load.image('player','https://content.codecademy.com/courses/learn-phaser/physics/codey.png');
        this.load.image('platform', 'https://content.codecademy.com/courses/learn-phaser/physics/platform.png');
    }
    create() {
        gameState.character = this.physics.add.sprite(100,100,'player');
        gameState.platform = this.physics.add.staticGroup();
        gameState.platform.create(225,600,'platform');
        gameState.platform.create(775,600,'platform');
        this.physics.add.collider(gameState.character,gameState.platform);
    }
    update() {
        gameState.speedCharacter = 100; //Setting

        //Move
        gameState.cursors = this.input.keyboard.createCursorKeys();
        if (gameState.cursors.left.isDown) {
            gameState.character.setVelocityX(-gameState.speedCharacter);
        } else
        if (gameState.cursors.right.isDown) {
            gameState.character.setVelocityX(gameState.speedCharacter);
        } else
        {
            gameState.character.setVelocityX(0);
        }
    }
}