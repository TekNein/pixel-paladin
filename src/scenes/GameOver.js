window.GameOver = class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOver' });
    }

    init(data) {
        this.finalWave = data.wave || 1;
        this.finalGold = data.gold || 0;
        this.finalLevel = data.level || 1;
    }

    create() {
        const { width, height } = this.scale;

        this.add.text(width / 2, height * 0.3, 'GAME OVER', {
            fontSize: '96px',
            fontFamily: 'monospace',
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        this.add.text(width / 2, height * 0.45, `Wave Reached: ${this.finalWave}`, {
            fontSize: '36px',
            fontFamily: 'monospace',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(width / 2, height * 0.55, `Gold Collected: ${this.finalGold}`, {
            fontSize: '36px',
            fontFamily: 'monospace',
            color: '#ffd700'
        }).setOrigin(0.5);

        this.add.text(width / 2, height * 0.65, `Level Reached: ${this.finalLevel}`, {
            fontSize: '36px',
            fontFamily: 'monospace',
            color: '#ffcc00'
        }).setOrigin(0.5);

        const restartText = this.add.text(width / 2, height * 0.75, '[ Click to Restart ]', {
            fontSize: '36px',
            fontFamily: 'monospace',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: restartText,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        this.input.on('pointerdown', () => {
            this.scene.start('Game');
        });
    }
}
