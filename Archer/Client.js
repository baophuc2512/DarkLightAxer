var Client = {};
Client.socket = io("ws://localhost:4242");

// ---------------------SEND TO SERVER----------------
Client.stop = function(isLeft){
    console.log("stop sent");
    Client.socket.emit('stop');
};

Client.move = function(isLeft){
    console.log("move sent");
    Client.socket.emit('move', isLeft);
};

///////////////////////////////////////////////////////////////////////////
// ---------------------RECEIVE FROM SERVER--------------------------
Client.socket.on('currentPlayer', (id) => {
    gameState.id = id;
});

Client.socket.on('movePlayer',function(isLeft, id){
    if (gameState.id != id) { // only receive msg from another id, avoid receive msg itself
        if (isLeft) {
            gameState.character2.setVelocityX(-gameState.speedCharacter);
            // gameState.keyArrow = 0;
        } else {
            gameState.character2.setVelocityX(gameState.speedCharacter);
            // gameState.keyArrow = 0;
        }
        console.log('receive from server');
    }
});

Client.socket.on('stopPlayer',function(id){
    if (gameState.id != id) { // only receive msg from another id, avoid receive msg itself
        if (gameState.character2) gameState.character2.setVelocityX(0);
    }
});

Client.socket.on('newplayer', (id) => {
    console.log(`Player id ${id} join game`);
});

Client.socket.on('disconnectPlayer',(id) => {
    console.log(`Player id ${id} leave game`);
});
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////


Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};

Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
};

Client.sendClick = function(x,y){
  Client.socket.emit('click',{x:x,y:y});
};

Client.socket.on('newplayer',function(data){
    Game.addNewPlayer(data.id,data.x,data.y);
});

Client.socket.on('allplayers',function(data){
    for(var i = 0; i < data.length; i++){
        Game.addNewPlayer(data[i].id,data[i].x,data[i].y);
    }

    Client.socket.on('move',function(data){
        Game.movePlayer(data.id,data.x,data.y);
    });

    Client.socket.on('remove',function(id){
        Game.removePlayer(id);
    });
});