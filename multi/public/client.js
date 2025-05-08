const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#222',
    physics: {
        default: 'arcade'
    },
    scene: {
        preload,
        create,
        update
    }
};

let player;
let otherPlayers = {};
let cursors;
let socket;

const game = new Phaser.Game(config);

function preload() {}

function create() {
    socket = io();

    cursors = this.input.keyboard.createCursorKeys();

    socket.on('currentPlayers', players => {
        Object.keys(players).forEach(id => {
            if (id === socket.id) {
                player = this.add.rectangle(players[id].x, players[id].y, 30, 30, 0x00ff00);
                this.physics.add.existing(player);
            } else {
                const other = this.add.rectangle(players[id].x, players[id].y, 30, 30, 0xff0000);
                otherPlayers[id] = other;
            }
        });
    });

    socket.on('newPlayer', newPlayer => {
        const other = this.add.rectangle(newPlayer.x, newPlayer.y, 30, 30, 0xff0000);
        otherPlayers[newPlayer.id] = other;
    });

    socket.on('playerMoved', data => {
        if (otherPlayers[data.id]) {
            otherPlayers[data.id].x = data.x;
            otherPlayers[data.id].y = data.y;
        }
    });

    socket.on('playerDisconnected', id => {
        if (otherPlayers[id]) {
            otherPlayers[id].destroy();
            delete otherPlayers[id];
        }
    });
}

function update() {
    if (player) {
        const speed = 200;
        player.body.setVelocity(0);

        if (cursors.left.isDown) player.body.setVelocityX(-speed);
        if (cursors.right.isDown) player.body.setVelocityX(speed);
        if (cursors.up.isDown) player.body.setVelocityY(-speed);
        if (cursors.down.isDown) player.body.setVelocityY(speed);

        socket.emit('playerMovement', { x: player.x, y: player.y });
    }
}
