import Preload from './scenes/Preload.js';
import MainMenu from './scenes/MainMenu.js';
import GameOver from './scenes/GameOver.js';

const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#0d0d0d',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: [Preload, MainMenu, Game, GameOver]
};

new Phaser.Game(config);
