const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#222222',
    scene: {
        preload,
        create,
        update
    },
    plugins: {
        scene: [{
            key: 'rexVirtualJoystick',
            plugin: rexvirtualjoystickplugin,
            mapping: 'rexVirtualJoystick'
        }]
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    }
};

const game = new Phaser.Game(config);

let player;
let joystick;
let cursors;

function preload() {
    // ไม่ต้องโหลดรูป
}

function create() {
    // สร้างวงกลม
    player = this.add.circle(400, 300, 30, 0x00ff00); // วงกลมสีเขียว
    this.physics.add.existing(player); // เพิ่ม physics เข้าไป

    player.body.setCollideWorldBounds(true); // ชนขอบไม่ทะลุ

    // สร้าง Joystick
    joystick = this.rexVirtualJoystick.add(this, {
        x: 100,
        y: 500,
        radius: 50,
        base: this.add.circle(0, 0, 50, 0x888888),
        thumb: this.add.circle(0, 0, 25, 0xcccccc),
    }).on('update', () => {
        cursors = joystick.createCursorKeys();
    });
}

function update() {
    if (!cursors) return;

    player.body.setVelocity(0);

    if (cursors.left.isDown) {
        player.body.setVelocityX(-200);
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(200);
    }

    if (cursors.up.isDown) {
        player.body.setVelocityY(-200);
    } else if (cursors.down.isDown) {
        player.body.setVelocityY(200);
    }
}
