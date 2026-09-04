export default class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    create() {
        const { width, height } = this.scale;

        // Title
        this.add.text(width / 2, height * 0.3, 'PIXEL PALADIN', {
            fontSize: '96px',
            fontFamily: 'monospace',
            color: '#ffcc00',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(width / 2, height * 0.4, 'A Slay the Foul Undead POC', {
            fontSize: '32px',
            fontFamily: 'monospace',
            color: '#888888'
        }).setOrigin(0.5);

        // Controls info
        const controlsText = [
            'WASD / Arrows - Move',
            'LMB - Attack',
            'RMB - Block',
            'Shift - Sprint',
            'E - Interact'
        ];

        controlsText.forEach((text, i) => {
            this.add.text(width / 2, height * 0.55 + i * 36, text, {
                fontSize: '24px',
                fontFamily: 'monospace',
                color: '#aaaaaa'
            }).setOrigin(0.5);
        });

        // Start prompt
        const startText = this.add.text(width / 2, height * 0.8, '[ Click to Start ]', {
            fontSize: '36px',
            fontFamily: 'monospace',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Pulsing effect
        this.tweens.add({
            targets: startText,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Click to start
        this.input.on('pointerdown', () => {
            this.scene.start('Game');
        });

        // Also allow keyboard
        this.input.keyboard.on('keydown', () => {
            this.scene.start('Game');
        });
    }
}
