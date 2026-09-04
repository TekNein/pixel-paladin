window.Game = class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });

        // Player state
        this.player = null;
        this.playerHP = 100;
        this.playerMaxHP = 100;
        this.playerLevel = 1;
        this.favor = 0;
        this.gold = 0;
        this.lives = 3;

        // Combat state
        this.isAttacking = false;
        this.isBlocking = false;
        this.canAttack = true;

        // Skeleton types with base stats (scale with player level)
        // Catacomb levels 1-4: White to Yellow
        // Catacomb levels 5+: add Knight, Mage, Cleric (Yellow to Red)
        this.skeletonTypes = {
            // Levels 1-4 (White to Yellow)
            skeleton: { name: 'Skeleton', baseHP: 15, baseDamage: 4, baseSpeed: 50, baseGold: 5, type: 'melee', minCatacomb: 1 },
            skeleton_warrior: { name: 'Skeleton Warrior', baseHP: 25, baseDamage: 8, baseSpeed: 55, baseGold: 10, type: 'melee', minCatacomb: 1 },
            skeleton_archer: { name: 'Skeleton Archer', baseHP: 20, baseDamage: 10, baseSpeed: 60, baseGold: 15, type: 'ranged', minCatacomb: 1 },
            skeleton_veteran: { name: 'Skeleton Veteran', baseHP: 35, baseDamage: 12, baseSpeed: 45, baseGold: 20, type: 'ranged', ranged: true, minCatacomb: 1 },
            // Levels 5+ (Yellow to Red)
            skeleton_mage: { name: 'Skeleton Mage', baseHP: 15, baseDamage: 20, baseSpeed: 35, baseGold: 25, type: 'magic', minCatacomb: 5 },
            skeleton_knight: { name: 'Skeleton Knight', baseHP: 60, baseDamage: 15, baseSpeed: 40, baseGold: 30, type: 'melee', minCatacomb: 5 },
            skeleton_cleric: { name: 'Skeleton Cleric', baseHP: 25, baseDamage: 5, baseSpeed: 40, baseGold: 20, type: 'healer', minCatacomb: 5 }
        };

        // Boss skeleton (fixed stats, doesn't scale)
        this.bossType = { name: 'LICH LORD', baseHP: 300, baseDamage: 40, baseSpeed: 50, baseGold: 200, type: 'boss' };

        // Paladin spells (unlock with Favor)
        this.spells = {
            // 1st Level
            divine_favor: { name: 'Divine Favor', level: 1, cost: 1, description: '+Radiant damage', unlocked: false, castCost: 1 },
            divine_smite: { name: 'Divine Smite', level: 1, cost: 1, description: 'Radiant burst', unlocked: false, castCost: 1 },
            searing_smite: { name: 'Searing Smite', level: 1, cost: 1, description: 'Fire + burn', unlocked: false, castCost: 1 },
            shield_of_faith: { name: 'Shield of Faith', level: 1, cost: 1, description: '+AC + temp HP', unlocked: false, castCost: 1 },
            cure_wounds: { name: 'Cure Wounds', level: 1, cost: 1, description: 'Heal self', unlocked: false, castCost: 1 },
            heroism: { name: 'Heroism', level: 1, cost: 1, description: 'Temp HP/fight', unlocked: false, castCost: 1 },
            bless: { name: 'Bless', level: 1, cost: 1, description: '+d4 attacks/saves', unlocked: false, castCost: 1 },
            command: { name: 'Command', level: 1, cost: 1, description: 'Stun enemy', unlocked: false, castCost: 1 },
            detect_evil: { name: 'Detect Evil & Good', level: 1, cost: 1, description: 'Reveal enemies', unlocked: false, castCost: 1 },
            protection_evil: { name: 'Protection from Evil & Good', level: 1, cost: 1, description: 'Ward off chaos', unlocked: false, castCost: 1 },
            // 2nd Level
            aid: { name: 'Aid', level: 2, cost: 2, description: '+Max HP', unlocked: false, castCost: 2 },
            lesser_restoration: { name: 'Lesser Restoration', level: 2, cost: 2, description: 'Remove conditions', unlocked: false, castCost: 2 },
            magic_weapon: { name: 'Magic Weapon', level: 2, cost: 2, description: '+1d4 weapon', unlocked: false, castCost: 2 },
            protection_poison: { name: 'Protection from Poison', level: 2, cost: 2, description: 'Poison resist', unlocked: false, castCost: 2 },
            zone_of_truth: { name: 'Zone of Truth', level: 2, cost: 2, description: 'No lies', unlocked: false, castCost: 2 },
            // 3rd Level
            dispel_magic: { name: 'Dispel Magic', level: 3, cost: 3, description: 'Remove buffs', unlocked: false, castCost: 3 },
            remove_curse: { name: 'Remove Curse', level: 3, cost: 3, description: 'Anti-curse', unlocked: false, castCost: 3 },
            create_food: { name: 'Create Food & Water', level: 3, cost: 3, description: 'Restore HP', unlocked: false, castCost: 3 },
            magic_circle: { name: 'Magic Circle', level: 3, cost: 3, description: 'Ward area', unlocked: false, castCost: 3 },
            beacon_of_hope: { name: 'Beacon of Hope', level: 3, cost: 3, description: 'Max healing', unlocked: false, castCost: 3 },
            // 4th Level
            death_ward: { name: 'Death Ward', level: 4, cost: 4, description: 'Prevent death', unlocked: false, castCost: 4 },
            aura_of_life: { name: 'Aura of Life', level: 4, cost: 4, description: 'Radiant aura', unlocked: false, castCost: 4 },
            locate_creature: { name: 'Locate Creature', level: 4, cost: 4, description: 'Find enemies', unlocked: false, castCost: 4 },
            freedom_of_movement: { name: 'Freedom of Movement', level: 4, cost: 4, description: 'Ignore restraints', unlocked: false, castCost: 4 },
            banishment: { name: 'Banishment', level: 4, cost: 4, description: 'Banish (not bosses)', unlocked: false, castCost: 4 },
            // 5th Level
            greater_restoration: { name: 'Greater Restoration', level: 5, cost: 5, description: 'Remove conditions', unlocked: false, castCost: 5 },
            dispel_evil: { name: 'Dispel Evil & Good', level: 5, cost: 5, description: 'Exorcism', unlocked: false, castCost: 5 },
            geas: { name: 'Geas', level: 5, cost: 5, description: 'Command enemy', unlocked: false, castCost: 5 },
            flame_strike: { name: 'Flame Strike', level: 5, cost: 5, description: 'Meteor damage', unlocked: false, castCost: 5 },
            guardian_of_faith: { name: 'Guardian of Faith', level: 5, cost: 5, description: 'Guardian protects', unlocked: false, castCost: 5 },
            commune: { name: 'Commune', level: 5, cost: 5, description: 'Divine insight', unlocked: false, castCost: 5 }
        };

        this.enemies = [];
        this.enemyProjectiles = [];
        this.goldCoins = this.physics.add.group();
        this.currentWave = 1;
        
        // Spell casting state
        this.activeSpells = {}; // Currently active spell effects
        this.spellMenuOpen = false;
    }

    // Calculate enemy stats based on player level
    getScaledStats(baseStats) {
        const levelMultiplier = 1 + (this.playerLevel - 1) * 0.15;
        return {
            hp: Math.floor(baseStats.baseHP * levelMultiplier),
            damage: Math.floor(baseStats.baseDamage * levelMultiplier),
            speed: baseStats.baseSpeed,
            gold: baseStats.baseGold
        };
    }

    create() {
        const { width, height } = this.scale;

        // Create tilemap for room
        this.createRoom();

        // Player setup
        this.player = this.physics.add.sprite(width / 2, height / 2, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(1000);

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.spellKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        
        // Spell menu toggle
        this.input.keyboard.on('keydown-Q', () => {
            if (this.spellMenuOpen) {
                this.closeSpellMenu();
            } else {
                this.openSpellMenu();
            }
        });

        // Combat input
        this.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) this.attack();
            if (pointer.rightButtonDown()) this.block();
        });

        this.input.on('pointerup', (pointer) => {
            if (!pointer.leftButtonDown()) this.isAttacking = false;
            if (!pointer.rightButtonDown()) this.isBlocking = false;
        });

        this.input.keyboard.on('keydown-SPACE', () => this.attack());
        this.input.keyboard.on('keyup-SPACE', () => this.isAttacking = false);

        // Collisions
        this.physics.add.collider(this.player, this.roomGroup);
        this.physics.add.collider(this.goldCoins, this.roomGroup);
        this.physics.add.overlap(this.player, this.goldCoins, this.collectGold, null, this);

        // UI
        this.createUI();

        // Enemy spawner
        this.spawnInitialEnemies();
    }

    createRoom() {
        const { width, height } = this.scale;
        this.roomGroup = this.physics.add.staticGroup();

        // Floor (tiled)
        for (let x = 0; x < width; x += 64) {
            for (let y = 0; y < height; y += 64) {
                this.roomGroup.create(x + 32, y + 32, 'floor');
            }
        }

        // Walls (border)
        for (let x = 0; x < width; x += 64) {
            this.roomGroup.create(x + 32, 32, 'wall');
            this.roomGroup.create(x + 32, height - 32, 'wall');
        }
        for (let y = 64; y < height - 64; y += 64) {
            this.roomGroup.create(32, y + 32, 'wall');
            this.roomGroup.create(width - 32, y + 32, 'wall');
        }
    }

    createUI() {
        const { width } = this.scale;

        // Health bar background
        this.add.rectangle(200, 60, 200, 24, 0x333333).setOrigin(0, 0.5);
        this.hpBar = this.add.rectangle(100, 60, 200, 20, 0xff0000).setOrigin(0, 0.5);

        this.add.text(100, 30, 'HP', {
            fontSize: '18px',
            fontFamily: 'monospace',
            color: '#ffffff'
        });

        // Level
        this.levelText = this.add.text(100, 80, `Level: ${this.playerLevel}`, {
            fontSize: '20px',
            fontFamily: 'monospace',
            color: '#ffcc00'
        });

        // Lives
        this.livesText = this.add.text(350, 50, `Lives: ${this.lives}`, {
            fontSize: '24px',
            fontFamily: 'monospace',
            color: '#ffffff'
        });

        // Gold
        this.goldText = this.add.text(500, 50, `Gold: ${this.gold}`, {
            fontSize: '24px',
            fontFamily: 'monospace',
            color: '#ffd700'
        });

        // Favor
        this.favorText = this.add.text(700, 50, `Favor: ${this.favor}`, {
            fontSize: '24px',
            fontFamily: 'monospace',
            color: '#00ffff'
        });

        // Wave
        this.waveText = this.add.text(width - 200, 50, `Wave: ${this.currentWave}`, {
            fontSize: '24px',
            fontFamily: 'monospace',
            color: '#ff8800'
        });

        // Controls hint
        this.add.text(100, this.scale.height - 50, 'LMB: Attack | RMB: Block | Shift: Sprint | E: Interact | Q: Spells', {
            fontSize: '16px',
            fontFamily: 'monospace',
            color: '#666666'
        });
    }

    spawnInitialEnemies() {
        // Start with basic skeletons
        for (let i = 0; i < 3; i++) {
            this.spawnEnemy('skeleton');
        }
    }

    spawnEnemy(type, isBoss = false) {
        const { width, height } = this.scale;

        // Random spawn position (away from player)
        let x, y;
        do {
            x = Phaser.Math.Between(150, width - 150);
            y = Phaser.Math.Between(150, height - 150);
        } while (Phaser.Math.Distance.Between(x, y, this.player.x, this.player.y) < 250);

        const baseType = isBoss ? this.bossType : this.skeletonTypes[type];
        const stats = isBoss ? baseType : this.getScaledStats(baseType);

        // Pick texture based on type
        const textureKey = isBoss ? 'boss_purple' : this.getTextureForType(type);

        const enemy = this.physics.add.sprite(x, y, textureKey);
        enemy.setCollideWorldBounds(true);
        enemy.setBounce(0);
        enemy.setGravityY(1000);

        // Attach enemy data
        enemy.enemyType = type;
        enemy.textureKey = textureKey;
        enemy.hp = stats.hp;
        enemy.maxHp = stats.hp;
        enemy.damage = stats.damage;
        enemy.speed = stats.speed;
        enemy.goldValue = stats.gold;
        enemy.isBoss = isBoss;
        enemy.name = baseType.name;
        enemy.skeletonRole = baseType.type;

        // Ranged/magic enemies track their last shot
        if (baseType.ranged || baseType.type === 'magic') {
            enemy.lastRangedAttack = 0;
            enemy.rangedAttackCooldown = 2000;
        }

        // Clerics track healing
        if (baseType.type === 'healer') {
            enemy.lastHeal = 0;
            enemy.healCooldown = 3000;
        }

        // Create health bar for enemy
        const barWidth = isBoss ? 60 : 40;
        enemy.hpBar = this.add.rectangle(x - barWidth/2, y - 45, barWidth, 6, 0xff0000);
        enemy.hpBarBg = this.add.rectangle(x - barWidth/2, y - 45, barWidth, 6, 0x333333).setOrigin(0.5);

        // Name label with level indicator
        const levelIndicator = isBoss ? '' : ` [L${this.playerLevel}]`;
        enemy.nameLabel = this.add.text(x, y - 60, baseType.name + levelIndicator, {
            fontSize: '12px',
            fontFamily: 'monospace',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Color by actual texture used (White → Green → Yellow → Orange → Red)
        const textureColors = ['#ffffff', '#00ff00', '#ffff00', '#ff8800', '#ff0000'];
        const colorMap = {
            'skeleton_white': '#ffffff',
            'skeleton_green': '#00ff00',
            'skeleton_yellow': '#ffff00',
            'skeleton_orange': '#ff8800',
            'skeleton_red': '#ff0000'
        };
        enemy.nameLabel.setColor(colorMap[enemy.textureKey] || '#ffffff');

        this.physics.add.collider(enemy, this.roomGroup);
        this.physics.add.collider(enemy, this.enemies);

        this.enemies.push(enemy);
    }

    getTextureForType(type) {
        // Each skeleton type can appear in White → Red based on difficulty
        // Max color available scales with wave (1=white, 2=green, 3=yellow, 4=orange, 5+=red)
        const colorsByLevel = ['skeleton_white', 'skeleton_green', 'skeleton_yellow', 'skeleton_orange', 'skeleton_red'];
        const maxColorIndex = Math.min(Math.max(0, this.currentWave - 1), colorsByLevel.length - 1);
        const colorIndex = Phaser.Math.Between(0, maxColorIndex);
        return colorsByLevel[colorIndex];
    }

    attack() {
        if (this.isAttacking || !this.canAttack) return;

        this.isAttacking = true;
        this.canAttack = false;

        // Visual feedback
        const attackEffect = this.add.sprite(this.player.x, this.player.y, 'attack');
        this.tweens.add({
            targets: attackEffect,
            scale: 2,
            alpha: 0,
            duration: 200,
            onComplete: () => attackEffect.destroy()
        });

        // Check for enemies in range
        const attackRange = 80;
        this.enemies.forEach(enemy => {
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
            if (dist < attackRange) {
                let damage = 25;
                if (this.isBlocking) damage = Math.floor(damage * 0.3);

                enemy.hp -= damage;

                // Knockback
                const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, enemy.x, enemy.y);
                enemy.setVelocity(Math.cos(angle) * 300, Math.sin(angle) * 200 - 200);

                this.updateEnemyHP(enemy);

                if (enemy.hp <= 0) {
                    this.killEnemy(enemy);
                }
            }
        });

        this.time.delayedCall(300, () => {
            this.isAttacking = false;
            this.canAttack = true;
        });
    }

    block() {
        this.isBlocking = true;
    }

    updateEnemyHP(enemy) {
        const hpPercent = Math.max(0, enemy.hp / enemy.maxHp);
        const barWidth = enemy.isBoss ? 60 : 40;
        enemy.hpBar.width = barWidth * hpPercent;
    }

    killEnemy(enemy) {
        // Drop gold coin as collectible
        const coin = this.physics.add.sprite(enemy.x, enemy.y, 'coin');
        coin.goldValue = enemy.goldValue;
        coin.setBounce(0);
        coin.setGravityY(500);
        this.physics.add.collider(coin, this.roomGroup);
        this.goldCoins.add(coin);

        // Floating text
        const goldFloat = this.add.text(enemy.x, enemy.y, `+${enemy.goldValue}g`, {
            fontSize: '20px',
            fontFamily: 'monospace',
            color: '#ffd700'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: goldFloat,
            y: goldFloat.y - 50,
            alpha: 0,
            duration: 1000,
            onComplete: () => goldFloat.destroy()
        });

        if (enemy.hpBar) {
            enemy.hpBar.destroy();
            enemy.hpBarBg.destroy();
            enemy.nameLabel.destroy();
        }

        const index = this.enemies.indexOf(enemy);
        if (index > -1) this.enemies.splice(index, 1);

        enemy.destroy();

        if (this.enemies.length === 0) {
            this.currentWave++;
            this.waveText.setText(`Wave: ${this.currentWave}`);
            this.spawnWave();
        }
    }

    collectGold(player, coin) {
        this.gold += coin.goldValue;
        this.goldText.setText(`Gold: ${this.gold}`);

        const pickupText = this.add.text(coin.x, coin.y - 20, `+${coin.goldValue}g`, {
            fontSize: '16px',
            fontFamily: 'monospace',
            color: '#ffd700'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: pickupText,
            y: pickupText.y - 30,
            alpha: 0,
            duration: 500,
            onComplete: () => pickupText.destroy()
        });

        coin.destroy();

        // Check level up after pickup
        const levelUpCost = 25 * this.playerLevel * this.playerLevel;
        if (this.gold >= levelUpCost) {
            this.gold -= levelUpCost;
            this.playerLevel++;
            this.levelText.setText(`Level: ${this.playerLevel}`);

            this.playerHP = Math.min(this.playerMaxHP, this.playerHP + 50);
            this.updateHPBar();

            const levelText = this.add.text(this.player.x, this.player.y - 80, `LEVEL ${this.playerLevel}!`, {
                fontSize: '28px',
                fontFamily: 'monospace',
                color: '#ffcc00'
            }).setOrigin(0.5);

            this.tweens.add({
                targets: levelText,
                y: levelText.y - 60,
                alpha: 0,
                duration: 1500,
                onComplete: () => levelText.destroy()
            });
        }
    }

    spawnWave() {
        const enemiesToSpawn = Math.min(3 + this.currentWave * 2, 15);

        // Filter skeleton types by catacomb level (wave)
        const availableTypes = Object.entries(this.skeletonTypes)
            .filter(([key, data]) => data.minCatacomb <= this.currentWave)
            .map(([key]) => key);

        for (let i = 0; i < enemiesToSpawn; i++) {
            const typeIndex = Phaser.Math.Between(0, availableTypes.length - 1);
            const type = availableTypes[typeIndex];

            this.spawnEnemy(type);
        }        // Boss spawning: every wave from level 5+, extra boss every 3 levels
        if (this.currentWave >= 5) {
            const extraBosses = Math.floor((this.currentWave - 5) / 3);
            const totalBosses = 1 + extraBosses;
            for (let b = 0; b < totalBosses; b++) {
                this.spawnEnemy('skeleton_knight', true);
            }
        }
    }

    // Enemy ranged attack
    enemyRangedAttack(enemy) {
        const now = this.time.now;
        if (now - enemy.lastRangedAttack < enemy.rangedAttackCooldown) return;
        enemy.lastRangedAttack = now;

        const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);

        const projectile = this.physics.add.sprite(enemy.x, enemy.y, 'coin');
        projectile.setVelocity(Math.cos(angle) * 250, Math.sin(angle) * 250);
        projectile.damage = enemy.damage;
        projectile.isEnemyProjectile = true;

        // Tint based on enemy type
        if (enemy.skeletonRole === 'magic') {
            projectile.setTint(0xff55ff); // Mage - purple
        } else if (enemy.enemyType === 'skeleton_veteran') {
            projectile.setTint(0xffff00); // Veteran - yellow (crossbow)
        } else {
            projectile.setTint(0xaaffff); // Archer - cyan
        }

        this.enemyProjectiles.push(projectile);

        this.physics.add.collider(projectile, this.player, (proj, player) => {
            if (!this.isBlocking) {
                this.playerHP -= proj.damage;
                this.updateHPBar();
                if (this.playerHP <= 0) this.playerDeath();
            }
            proj.destroy();
        });

        this.physics.add.collider(projectile, this.roomGroup, (proj) => {
            proj.destroy();
        });
    }

    // Cleric healing other skeletons
    enemyHeal(enemy) {
        const now = this.time.now;
        if (now - enemy.lastHeal < enemy.healCooldown) return;
        enemy.lastHeal = now;

        // Find hurt skeleton to heal
        const target = this.enemies.find(e => e.hp < e.maxHp * 0.8 && e !== enemy);
        if (!target) return;

        // Heal visual
        const healEffect = this.add.text(target.x, target.y - 40, '+HEAL', {
            fontSize: '16px',
            fontFamily: 'monospace',
            color: '#55ffff'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: healEffect,
            y: healEffect.y - 30,
            alpha: 0,
            duration: 800,
            onComplete: () => healEffect.destroy()
        });

        // Apply healing
        const healAmount = Math.floor(target.maxHp * 0.3);
        target.hp = Math.min(target.maxHp, target.hp + healAmount);
        this.updateEnemyHP(target);
    }

    update() {
        if (!this.player) return;
        if (this.paused) return;

        const speed = this.shiftKey.isDown ? 300 : 150;

        // Movement
        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.player.setVelocityX(-speed);
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.player.setVelocityX(speed);
        } else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            if (this.player.body.blocked.down) {
                this.player.setVelocityY(-450);
            }
        }

        // Blocking visual
        if (this.isBlocking && !this.blockVisual) {
            this.blockVisual = this.add.sprite(this.player.x, this.player.y, 'block');
        } else if (this.isBlocking && this.blockVisual) {
            this.blockVisual.setPosition(this.player.x, this.player.y);
        } else if (!this.isBlocking && this.blockVisual) {
            this.blockVisual.destroy();
            this.blockVisual = null;
        }

        // Enemy AI
        this.enemies.forEach(enemy => {
            if (!enemy.active) return;

            const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);

            // Ranged/magic enemies keep distance
            if (enemy.skeletonRole === 'ranged' || enemy.skeletonRole === 'magic') {
                if (dist < 200) {
                    // Back away
                    const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, enemy.x, enemy.y);
                    enemy.setVelocity(Math.cos(angle) * enemy.speed * 0.5, Math.sin(angle) * enemy.speed * 0.5);
                } else if (dist > 350) {
                    // Get closer
                    const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
                    enemy.setVelocity(Math.cos(angle) * enemy.speed * 0.5, Math.sin(angle) * enemy.speed * 0.5);
                } else {
                    // Stand ground and shoot
                    enemy.setVelocity(0, 0);
                    this.enemyRangedAttack(enemy);
                }
            }
            // Clerics keep distance and heal
            else if (enemy.skeletonRole === 'healer') {
                if (dist < 150) {
                    const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, enemy.x, enemy.y);
                    enemy.setVelocity(Math.cos(angle) * enemy.speed * 0.5, Math.sin(angle) * enemy.speed * 0.5);
                } else if (dist > 250) {
                    const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
                    enemy.setVelocity(Math.cos(angle) * enemy.speed * 0.5, Math.sin(angle) * enemy.speed * 0.5);
                } else {
                    enemy.setVelocity(0, 0);
                    this.enemyHeal(enemy);
                }
            }
            // Melee enemies charge player
            else if (dist < 50) {
                if (!enemy.lastAttack || this.time.now - enemy.lastAttack > 1000) {
                    enemy.lastAttack = this.time.now;

                    if (!this.isBlocking) {
                        this.playerHP -= enemy.damage;
                        this.updateHPBar();
                        if (this.playerHP <= 0) this.playerDeath();
                    }
                }
            } else {
                const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
                enemy.setVelocity(Math.cos(angle) * enemy.speed, Math.sin(angle) * enemy.speed);
            }

            // Update HP bar position
            if (enemy.hpBar) {
                const barWidth = enemy.isBoss ? 60 : 40;
                enemy.hpBar.setPosition(enemy.x - barWidth/2, enemy.y - 45);
                enemy.hpBarBg.setPosition(enemy.x - barWidth/2, enemy.y - 45);
                enemy.nameLabel.setPosition(enemy.x, enemy.y - 60);
                this.updateEnemyHP(enemy);
            }
        });

        // Interact: pick up gold OR tithe for favor
        if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
            // First, try to pick up nearby gold coins
            const nearbyCoins = this.physics.overlapTest(this.player, this.goldCoins.getChildren());
            if (nearbyCoins && nearbyCoins.length > 0) {
                const coin = nearbyCoins[0];
                this.collectGold(this.player, coin);
            } else if (this.gold >= 10) {
                // No coins nearby, tithe gold for favor
                this.gold -= 10;
                this.favor += 1;
                this.goldText.setText(`Gold: ${this.gold}`);
                this.favorText.setText(`Favor: ${this.favor}`);

                const favortext = this.add.text(this.player.x, this.player.y - 40, '+1 Favor!', {
                    fontSize: '20px',
                    fontFamily: 'monospace',
                    color: '#00ffff'
                }).setOrigin(0.5);

                this.tweens.add({
                    targets: favortext,
                    y: favortext.y - 50,
                    alpha: 0,
                    duration: 1000,
                    onComplete: () => favortext.destroy()
                });
            }
        }

        // Clean up destroyed projectiles
        this.enemyProjectiles = this.enemyProjectiles.filter(p => p.active);
    }

    // === SPELL SYSTEM ===
    
    openSpellMenu() {
        this.spellMenuOpen = true;
        this.paused = true;
        
        // Dark overlay
        this.spellMenuBg = this.add.rectangle(960, 540, 1920, 1080, 0x000000, 0.85);
        
        this.spellMenuContainer = this.add.container(0, 0);
        
        // Title
        const title = this.add.text(960, 80, 'SPELLS - Press Q to Close', {
            fontSize: '36px',
            fontFamily: 'monospace',
            color: '#ffcc00'
        }).setOrigin(0.5);
        this.spellMenuContainer.add(title);
        
        // Current Favor
        this.spellMenuFavor = this.add.text(960, 130, `Available Favor: ${this.favor}`, {
            fontSize: '24px',
            fontFamily: 'monospace',
            color: '#00ffff'
        }).setOrigin(0.5);
        this.spellMenuContainer.add(this.spellMenuFavor);
        
        // List spells by level
        const spellKeys = Object.keys(this.spells);
        let yPos = 200;
        let col = 0;
        
        spellKeys.forEach((key, i) => {
            const spell = this.spells[key];
            const xPos = 300 + col * 600;
            
            // Only show spells player can afford to unlock
            if (spell.cost <= this.favor || spell.unlocked) {
                const color = spell.unlocked ? '#00ff00' : '#ffffff';
                const status = spell.unlocked ? '[UNLOCKED]' : `[Unlock: ${spell.cost}F]`;
                
                const spellText = this.add.text(xPos, yPos, `${spell.name} (${spell.level}) ${status}`, {
                    fontSize: '18px',
                    fontFamily: 'monospace',
                    color: color
                });
                spellText.setInteractive({ useHandCursor: true });
                
                const descText = this.add.text(xPos, yPos + 24, spell.description, {
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    color: '#888888'
                });
                
                spellText.on('pointerdown', () => {
                    this.handleSpellClick(key);
                });
                
                this.spellMenuContainer.add(spellText);
                this.spellMenuContainer.add(descText);
                
                yPos += 60;
                if (yPos > 900) {
                    yPos = 200;
                    col++;
                }
            }
        });
        
        // Instructions
        const hint = this.add.text(960, 1040, 'Click spell to unlock | Q to close', {
            fontSize: '20px',
            fontFamily: 'monospace',
            color: '#666666'
        }).setOrigin(0.5);
        this.spellMenuContainer.add(hint);
    }
    
    closeSpellMenu() {
        this.spellMenuOpen = false;
        this.paused = false;
        if (this.spellMenuBg) this.spellMenuBg.destroy();
        if (this.spellMenuContainer) this.spellMenuContainer.destroy();
    }
    
    handleSpellClick(key) {
        const spell = this.spells[key];
        
        if (spell.unlocked) {
            // Already unlocked - cast it
            this.castSpell(key);
        } else if (this.favor >= spell.cost) {
            // Unlock the spell
            this.favor -= spell.cost;
            spell.unlocked = true;
            this.favorText.setText(`Favor: ${this.favor}`);
            
            // Visual feedback
            const unlockText = this.add.text(960, 540, `${spell.name} UNLOCKED!`, {
                fontSize: '48px',
                fontFamily: 'monospace',
                color: '#00ff00'
            }).setOrigin(0.5);
            
            this.tweens.add({
                targets: unlockText,
                alpha: 0,
                y: unlockText.y - 50,
                duration: 1500,
                onComplete: () => unlockText.destroy()
            });
            
            // Refresh menu
            this.closeSpellMenu();
            this.openSpellMenu();
        }
    }
    
    castSpell(key) {
        const spell = this.spells[key];
        const castCost = spell.castCost;
        
        // Increase cast cost for next use (1.2x)
        spell.castCost = Math.floor(spell.castCost * 1.2);
        
        // Apply spell effect
        switch(key) {
            case 'cure_wounds':
                this.playerHP = Math.min(this.playerMaxHP, this.playerHP + 20);
                this.updateHPBar();
                this.showSpellEffect('+20 HP!', '#00ff00');
                break;
            case 'shield_of_faith':
                this.activeSpells.shieldOfFaith = { active: true, duration: 30000 };
                this.playerHP = Math.min(this.playerMaxHP, this.playerHP + 25);
                this.updateHPBar();
                this.showSpellEffect('Shield of Faith!', '#00ffff');
                break;
            case 'divine_favor':
                this.activeSpells.divineFavor = { active: true, duration: 15000, damageBonus: 10 };
                this.showSpellEffect('Divine Favor!', '#ffcc00');
                break;
            case 'bless':
                this.activeSpells.bless = { active: true, duration: 15000 };
                this.showSpellEffect('Bless!', '#ffcc00');
                break;
            case 'heroism':
                this.playerHP = Math.min(this.playerMaxHP, this.playerHP + 15);
                this.updateHPBar();
                this.showSpellEffect('Heroism!', '#ffcc00');
                break;
            case 'death_ward':
                this.activeSpells.deathWard = { active: true, duration: 60000 };
                this.showSpellEffect('Death Ward!', '#ff0000');
                break;
            case 'aid':
                this.playerMaxHP += 10;
                this.playerHP += 10;
                this.updateHPBar();
                this.showSpellEffect('Aid! +10 Max HP', '#00ff00');
                break;
            case 'banishment':
                // Find closest non-boss enemy
                const target = this.enemies.find(e => !e.isBoss);
                if (target) {
                    this.showSpellEffect('Banished!', '#8800ff');
                    this.killEnemy(target);
                } else {
                    this.showSpellEffect('No targets!', '#ff0000');
                }
                break;
            case 'dispel_magic':
                // Remove buffs from all enemies
                this.enemies.forEach(e => {
                    e.hp = Math.max(1, e.hp - 15);
                    this.updateEnemyHP(e);
                    if (e.hp <= 1) this.killEnemy(e);
                });
                this.showSpellEffect('Dispel Magic!', '#ffffff');
                break;
            case 'flame_strike':
                // Big damage to all enemies
                this.enemies.forEach(e => {
                    e.hp -= 50;
                    this.updateEnemyHP(e);
                    if (e.hp <= 0) this.killEnemy(e);
                });
                this.showSpellEffect('FLAME STRIKE!', '#ff4400');
                break;
                
            // === ADDITIONAL SPELL EFFECTS ===
            case 'divine_smite':
                this.activeSpells.divineSmite = { active: true, duration: 10000, damageBonus: 15 };
                this.showSpellEffect('Divine Smite!', '#ffcc00');
                break;
            case 'searing_smite':
                this.activeSpells.searingSmite = { active: true, duration: 10000, burnDamage: 5 };
                this.showSpellEffect('Searing Smite!', '#ff4400');
                break;
            case 'command':
                // Stun nearest enemy briefly
                const stunTarget = this.enemies[0];
                if (stunTarget) {
                    stunTarget.setVelocity(0, 0);
                    stunTarget.setTint(0xffff00);
                    this.time.delayedCall(2000, () => {
                        if (stunTarget.active) stunTarget.clearTint();
                    });
                    this.showSpellEffect('COMMAND!', '#ffff00');
                } else {
                    this.showSpellEffect('No targets!', '#888888');
                }
                break;
            case 'detect_evil':
                // Reveal all enemies briefly
                this.enemies.forEach(e => {
                    e.setTint(0xff0000);
                });
                this.time.delayedCall(3000, () => {
                    this.enemies.forEach(e => {
                        if (e.active) e.clearTint();
                    });
                });
                this.showSpellEffect('DETECTED!', '#ffffff');
                break;
            case 'protection_evil':
                this.activeSpells.protectionEvil = { active: true, duration: 30000, damageReduction: 0.25 };
                this.showSpellEffect('Protected!', '#00ffff');
                break;
            case 'lesser_restoration':
                // Remove any debuffs (heal + clear tint)
                this.player.clearTint();
                this.playerHP = Math.min(this.playerMaxHP, this.playerHP + 10);
                this.updateHPBar();
                this.showSpellEffect('Restored!', '#00ff00');
                break;
            case 'magic_weapon':
                this.activeSpells.magicWeapon = { active: true, duration: 30000, damageBonus: 8 };
                this.showSpellEffect('Magic Weapon!', '#00ffff');
                break;
            case 'protection_poison':
                this.activeSpells.protectionPoison = { active: true, duration: 30000 };
                this.showSpellEffect('Poison Protected!', '#00ff00');
                break;
            case 'zone_of_truth':
                // All enemies take small damage
                this.enemies.forEach(e => {
                    e.hp -= 10;
                    this.updateEnemyHP(e);
                    if (e.hp <= 0) this.killEnemy(e);
                });
                this.showSpellEffect('Zone of Truth!', '#ffff00');
                break;
            case 'remove_curse':
                // Clear any active negative spell effects on player
                this.activeSpells = {};
                this.player.clearTint();
                this.showSpellEffect('Curse Removed!', '#ffffff');
                break;
            case 'create_food':
                this.playerHP = Math.min(this.playerMaxHP, this.playerHP + 30);
                this.updateHPBar();
                this.showSpellEffect('Food Created! +30 HP', '#00ff00');
                break;
            case 'magic_circle':
                // Create a protective circle - enemies near player take damage
                this.activeSpells.magicCircle = { active: true, duration: 20000 };
                this.showSpellEffect('Magic Circle!', '#8800ff');
                break;
            case 'beacon_of_hope':
                this.activeSpells.beaconOfHope = { active: true, duration: 20000, healingBonus: 1.5 };
                this.showSpellEffect('Beacon of Hope!', '#ffffff');
                break;
            case 'aura_of_life':
                this.activeSpells.auraOfLife = { active: true, duration: 20000 };
                this.showSpellEffect('Aura of Life!', '#00ff00');
                break;
            case 'locate_creature':
                // Show direction to nearest enemy
                if (this.enemies.length > 0) {
                    const nearest = this.enemies.reduce((a, b) => 
                        Phaser.Math.Distance.Between(this.player.x, this.player.y, a.x, a.y) <
                        Phaser.Math.Distance.Between(this.player.x, this.player.y, b.x, b.y) ? a : b);
                    const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, nearest.x, nearest.y);
                    const arrow = this.add.text(this.player.x, this.player.y - 100, '⬇', {
                        fontSize: '32px',
                        color: '#ff0000'
                    }).setOrigin(0.5);
                    arrow.rotation = angle + Math.PI/2;
                    this.tweens.add({
                        targets: arrow,
                        alpha: 0,
                        duration: 2000,
                        onComplete: () => arrow.destroy()
                    });
                    this.showSpellEffect('Enemy Detected!', '#ff0000');
                }
                break;
            case 'freedom_of_movement':
                this.activeSpells.freedomOfMovement = { active: true, duration: 30000 };
                this.showSpellEffect('Freedom!', '#00ffff');
                break;
            case 'greater_restoration':
                this.playerHP = this.playerMaxHP;
                this.playerMaxHP += 20;
                this.updateHPBar();
                this.showSpellEffect('Greater Restoration! +20 Max HP', '#00ff00');
                break;
            case 'dispel_evil':
                // Exorcism - heavy damage to all enemies
                this.enemies.forEach(e => {
                    e.hp -= 40;
                    this.updateEnemyHP(e);
                    if (e.hp <= 0) this.killEnemy(e);
                });
                this.showSpellEffect('DISPEL EVIL!', '#ffffff');
                break;
            case 'geas':
                // Command enemy to stop attacking temporarily
                const geasTarget = this.enemies.find(e => !e.isBoss);
                if (geasTarget) {
                    geasTarget.setVelocity(0, 0);
                    geasTarget.setTint(0xff00ff);
                    this.time.delayedCall(3000, () => {
                        if (geasTarget.active) geasTarget.clearTint();
                    });
                    this.showSpellEffect('GEAS!', '#ff00ff');
                }
                break;
            case 'guardian_of_faith':
                this.activeSpells.guardianOfFaith = { active: true, duration: 30000, damageOnHit: 30 };
                this.showSpellEffect('Guardian of Faith!', '#ffcc00');
                break;
            case 'commune':
                // Reveal enemy count and locations briefly
                const enemyCount = this.enemies.length;
                const infoText = this.add.text(960, 400, `Enemies: ${enemyCount}`, {
                    fontSize: '48px',
                    fontFamily: 'monospace',
                    color: '#ffcc00'
                }).setOrigin(0.5);
                this.tweens.add({
                    targets: infoText,
                    alpha: 0,
                    y: infoText.y - 50,
                    duration: 3000,
                    onComplete: () => infoText.destroy()
                });
                // Show enemy indicators
                this.enemies.forEach(e => {
                    const marker = this.add.text(e.x, e.y - 80, '!', {
                        fontSize: '24px',
                        color: '#ff0000'
                    }).setOrigin(0.5);
                    this.tweens.add({
                        targets: marker,
                        alpha: 0,
                        duration: 2000,
                        onComplete: () => marker.destroy()
                    });
                });
                this.showSpellEffect('COMMUNE!', '#ffcc00');
                break;
                
            default:
                this.showSpellEffect(`${spell.name} cast!`, '#ffffff');
        }
        
        this.closeSpellMenu();
    }
    
    showSpellEffect(text, color) {
        const effect = this.add.text(this.player.x, this.player.y - 60, text, {
            fontSize: '28px',
            fontFamily: 'monospace',
            color: color,
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: effect,
            y: effect.y - 80,
            alpha: 0,
            duration: 1500,
            onComplete: () => effect.destroy()
        });
    }
    
    // === END SPELL SYSTEM ===

    updateHPBar() {
        const percent = this.playerHP / this.playerMaxHP;
        this.hpBar.width = 200 * Math.max(0, percent);
    }

    playerDeath() {
        this.lives--;
        this.livesText.setText(`Lives: ${this.lives}`);

        if (this.lives <= 0) {
            this.scene.start('GameOver', { wave: this.currentWave, gold: this.gold, level: this.playerLevel });
        } else {
            this.playerHP = this.playerMaxHP;
            this.player.setPosition(this.scale.width / 2, this.scale.height / 2);
            this.updateHPBar();

            this.player.setAlpha(0.5);
            this.time.delayedCall(2000, () => {
                this.player.setAlpha(1);
            });
        }
    }
}
