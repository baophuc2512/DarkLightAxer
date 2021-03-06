const gameState = {
    widthScreen: 1000,
    heightScreen: 600,
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