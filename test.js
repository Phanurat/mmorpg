// main.js
class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    create() {
        // Player: สี่เหลี่ยมสีฟ้า
        this.player = this.add.rectangle(400, 300, 30, 30, 0x3399ff);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);

        // Monster group
        this.monsters = this.physics.add.group();
        // Bullet group
        this.bullets = this.physics.add.group();

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Spawn monster loop
        this.time.addEvent({
            delay: 2000,
            loop: true,
            callback: this.spawnMonster,
            callbackScope: this
        });

        // Collision: bullet vs monster
        this.physics.add.overlap(this.bullets, this.monsters, this.hitMonster, null, this);
    }

    update() {
        const speed = 200;
        const body = this.player.body;
        body.setVelocity(0);

        if (this.cursors.left.isDown) body.setVelocityX(-speed);
        if (this.cursors.right.isDown) body.setVelocityX(speed);
        if (this.cursors.up.isDown) body.setVelocityY(-speed);
        if (this.cursors.down.isDown) body.setVelocityY(speed);

        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            this.shootBullet();
        }

        // Monster AI: move toward player
        this.monsters.getChildren().forEach(monster => {
            this.physics.moveToObject(monster, this.player, 80);
        });
    }

    spawnMonster() {
        const x = Phaser.Math.Between(0, 800);
        const y = Phaser.Math.Between(0, 600);
        const monster = this.add.rectangle(x, y, 30, 30, 0xff3333);
        this.physics.add.existing(monster);
        monster.hp = 3;
        this.monsters.add(monster);
    }

    shootBullet() {
        const bullet = this.add.rectangle(this.player.x, this.player.y, 10, 10, 0xffff00);
        this.physics.add.existing(bullet);
        this.bullets.add(bullet);

        this.physics.moveTo(bullet, this.input.activePointer.worldX, this.input.activePointer.worldY, 400);
        this.time.delayedCall(1000, () => bullet.destroy());
    }

    hitMonster(bullet, monster) {
        bullet.destroy();
        monster.hp -= 1;
        if (monster.hp <= 0) {
            monster.destroy();
        }
    }
}

// Game config
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#222222',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: MainScene
};

// Start game
const game = new Phaser.Game(config);
