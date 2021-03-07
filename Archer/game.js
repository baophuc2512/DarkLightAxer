const gameState = {
    widthScreen: 1000,
    heightScreen: 600,
    speedCharacter: 100,
    keyArrow: 0,
    chargeTime: 1000,
    healthCharacter: 10000,
};

const config = {
        type: Phaser.AUTO,
        width: gameState.widthScreen,
        height: gameState.heightScreen,
        backgroundColor:"000000",
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {y: 300},
                enableBody: true,
                debug: false,
            },
        },
        scene: [MatchGame, StartGame],
    };

const game = new Phaser.Game(config);