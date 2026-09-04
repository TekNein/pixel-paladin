class Preload extends Phaser.Scene {
    constructor() {
        super({ key: 'Preload' });
    }

    create() {
        this.generateTextures();

        const loading = this.add.text(960, 540, 'Loading...', {
            fontSize: '48px',
            fontFamily: 'monospace',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.time.delayedCall(500, () => {
            this.scene.start('MainMenu');
        });
    }

    generateTextures() {
        // === PLAYER ===
        const playerGraphics = this.make.graphics();
        playerGraphics.fillStyle(0x3366ff, 1);
        playerGraphics.fillRect(0, 0, 48, 64);
        playerGraphics.fillStyle(0x6699ff, 1);
        playerGraphics.fillRect(8, 8, 32, 24); // visor
        playerGraphics.generateTexture('player', 48, 64);
        playerGraphics.destroy();

        // === SKELETON TYPES ===
        
        // Skeleton (basic melee) - White
        const skeleton = this.make.graphics();
        skeleton.fillStyle(0xffffff, 1);
        skeleton.fillRect(0, 0, 40, 56); // body
        skeleton.fillStyle(0x000000, 1);
        skeleton.fillRect(10, 10, 6, 6); // left eye
        skeleton.fillRect(24, 10, 6, 6); // right eye
        skeleton.generateTexture('skeleton_white', 40, 56);
        skeleton.destroy();
        
        // Skeleton Warrior - Light green
        const warrior = this.make.graphics();
        warrior.fillStyle(0xaaffaa, 1);
        warrior.fillRect(0, 0, 44, 60);
        warrior.fillStyle(0x000000, 1);
        warrior.fillRect(10, 12, 6, 6);
        warrior.fillRect(28, 12, 6, 6);
        // Helmet
        warrior.fillStyle(0x888888, 1);
        warrior.fillRect(6, 4, 32, 10);
        warrior.generateTexture('skeleton_green', 44, 60);
        warrior.destroy();
        
        // Skeleton Veteran - Yellow (with crossbow hint)
        const veteran = this.make.graphics();
        veteran.fillStyle(0xffffaa, 1);
        veteran.fillRect(0, 0, 40, 56);
        veteran.fillStyle(0x000000, 1);
        veteran.fillRect(10, 10, 6, 6);
        veteran.fillRect(24, 10, 6, 6);
        // Crossbow on back
        veteran.fillStyle(0x8b4513, 1);
        veteran.fillRect(32, 20, 8, 24);
        veteran.generateTexture('skeleton_yellow', 40, 56);
        veteran.destroy();
        
        // Skeleton Knight - Orange (armored)
        const knight = this.make.graphics();
        knight.fillStyle(0xff8800, 1);
        knight.fillRect(0, 0, 48, 64);
        knight.fillStyle(0x000000, 1);
        knight.fillRect(12, 14, 6, 6);
        knight.fillRect(30, 14, 6, 6);
        // Full helm
        knight.fillStyle(0x666666, 1);
        knight.fillRect(4, 4, 40, 16);
        knight.fillRect(8, 8, 8, 8); // visor slits
        knight.fillRect(32, 8, 8, 8);
        // Shield
        knight.fillStyle(0x444444, 1);
        knight.fillRect(0, 24, 12, 28);
        knight.generateTexture('skeleton_orange', 48, 64);
        knight.destroy();
        
        // Skeleton Red - For level 5+ enemies (glowing ember effect)
        const redSkeleton = this.make.graphics();
        redSkeleton.fillStyle(0xff0000, 1);
        redSkeleton.fillRect(0, 0, 42, 58);
        redSkeleton.fillStyle(0xffaa00, 1); // glowing eyes
        redSkeleton.fillRect(10, 12, 6, 6);
        redSkeleton.fillRect(26, 12, 6, 6);
        // Ember particles around
        redSkeleton.fillStyle(0xff4400, 0.8);
        redSkeleton.fillCircle(-4, 20, 3);
        redSkeleton.fillCircle(46, 30, 3);
        redSkeleton.fillCircle(10, -4, 3);
        redSkeleton.generateTexture('skeleton_red', 48, 64);
        redSkeleton.destroy();
        
        // Skeleton Archer - Cyan tint
        const archer = this.make.graphics();
        archer.fillStyle(0xaaffff, 1);
        archer.fillRect(0, 0, 36, 52);
        archer.fillStyle(0x000000, 1);
        archer.fillRect(8, 10, 6, 6);
        archer.fillRect(22, 10, 6, 6);
        // Bow
        archer.lineStyle(2, 0x8b4513, 1);
        archer.strokeCircle(30, 28, 10);
        archer.generateTexture('skeleton_archer', 36, 52);
        archer.destroy();
        
        // Skeleton Mage - Purple/Red
        const mage = this.make.graphics();
        mage.fillStyle(0xff0000, 1);
        mage.fillRect(0, 0, 40, 56);
        mage.fillStyle(0x000000, 1);
        mage.fillRect(10, 10, 6, 6);
        mage.fillRect(24, 10, 6, 6);
        // Hood/hat
        mage.fillStyle(0x440044, 1);
        mage.fillTriangle(20, 0, 4, 14, 36, 14);
        // Staff
        mage.fillStyle(0x8b4513, 1);
        mage.fillRect(34, 10, 4, 40);
        mage.fillStyle(0xff55ff, 1);
        mage.fillCircle(36, 8, 4);
        mage.generateTexture('skeleton_mage', 40, 56);
        mage.destroy();
        
        // Skeleton Cleric - Light cyan
        const cleric = this.make.graphics();
        cleric.fillStyle(0x55ffff, 1);
        cleric.fillRect(0, 0, 40, 56);
        cleric.fillStyle(0x000000, 1);
        cleric.fillRect(10, 10, 6, 6);
        cleric.fillRect(24, 10, 6, 6);
        // Priest hat
        cleric.fillStyle(0xffffff, 1);
        cleric.fillRect(6, 0, 28, 8);
        // Staff with heal symbol
        cleric.fillStyle(0x8b4513, 1);
        cleric.fillRect(32, 10, 4, 40);
        cleric.fillStyle(0x55ff55, 1);
        cleric.fillCircle(34, 8, 4);
        cleric.generateTexture('skeleton_cleric', 40, 56);
        cleric.destroy();
        
        // Boss - Purple
        const boss = this.make.graphics();
        boss.fillStyle(0x8800ff, 1);
        boss.fillRect(0, 0, 56, 72);
        boss.fillStyle(0xff0000, 1); // Red eyes
        boss.fillRect(12, 16, 8, 8);
        boss.fillRect(36, 16, 8, 8);
        // Crown
        boss.fillStyle(0xffd700, 1);
        boss.fillRect(8, 0, 40, 12);
        for (let i = 0; i < 5; i++) {
            boss.fillRect(12 + i * 8, -8, 4, 8);
        }
        // Robe
        boss.fillStyle(0x440044, 1);
        boss.fillRect(8, 40, 40, 32);
        boss.generateTexture('boss_purple', 56, 72);
        boss.destroy();

        // === ENVIRONMENT ===
        
        const floor = this.make.graphics();
        floor.fillStyle(0x2a2a2a, 1);
        floor.fillRect(0, 0, 64, 64);
        floor.lineStyle(2, 0x3a3a3a, 1);
        floor.strokeRect(0, 0, 64, 64);
        floor.generateTexture('floor', 64, 64);
        floor.destroy();

        const wall = this.make.graphics();
        wall.fillStyle(0x4a4a4a, 1);
        wall.fillRect(0, 0, 64, 64);
        wall.lineStyle(2, 0x5a5a5a, 1);
        wall.strokeRect(0, 0, 64, 64);
        wall.generateTexture('wall', 64, 64);
        wall.destroy();

        // === EFFECTS ===
        
        const attack = this.make.graphics();
        attack.fillStyle(0xffffaa, 0.8);
        attack.fillCircle(24, 24, 24);
        attack.generateTexture('attack', 48, 48);
        attack.destroy();

        const block = this.make.graphics();
        block.lineStyle(4, 0x00ffff, 1);
        block.strokeRect(8, 8, 32, 48);
        block.generateTexture('block', 48, 64);
        block.destroy();

        const coin = this.make.graphics();
        coin.fillStyle(0xffd700, 1);
        coin.fillCircle(12, 12, 12);
        coin.generateTexture('coin', 24, 24);
        coin.destroy();
    }
}
