class StartGame extends Phaser.Scene {
    constructor(){
        super({ key: 'StartGame'});
    }

    preload() {

    }

    create() {
        gameState.colorPlayText = '#FF0000';
        gameState.playbutton = this.add.rectangle(gameState.widthScreen / 2,gameState.heightScreen / 2,100,50, 0xFFFB00);
        gameState.playbutton.setInteractive();
    
        gameState.playbutton.on('pointerover', function() {
            this.fillColor=0xFFFD8F;
            gameState.colorPlayText = '#FF8F8F';
        });
        gameState.playbutton.on('pointerout', function() {
            this.fillColor=0xFFFB00;
            gameState.colorPlayText = '#FF0000';
        });
    }

    update() {
        gameState.playtext = this.add.text(gameState.widthScreen / 2-50,gameState.heightScreen / 2-25,'PLAY',{font: '40px Times New Roman', fill: gameState.colorPlayText});
    }
}