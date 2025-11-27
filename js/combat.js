class Combat {
    constructor(isMultiplayer = false) {
        this.projectiles = [];
        this.explosions = [];
        this.attackHitboxes = [];
        this.isMultiplayer = isMultiplayer;

        // Load ảnh chưởng
        this.projectileImages = {};
        this.loadProjectileImages();
    }

    loadProjectileImages() {
        this.projectileImages['fl'] = new Image();
        this.projectileImages['fl'].src = 'img/items/fl.png';
        this.projectileImages['fr'] = new Image();
        this.projectileImages['fr'].src = 'img/items/fr.png';
    }

    spawnProjectile(px, py, dmg, isStrong = false, facing = 1) {
        const height = isStrong ? 50 : 25;
        const width = height * (38/25); // Giữ nguyên tỉ lệ


        this.projectiles.push({
            x: px + facing * 40,      // Mép bên hướng đánh
    	    y: py - 75,  
            vx: 12 * facing,
            vy: 0,
            damage: dmg,
            radius: height/2, // Hitbox hình tròn
            isStrong: isStrong,
            owner: facing,
            isSkill: true,
            bounces: 0,
            canDamageOwner: false,
            height: height,
            width: width,
            image: facing > 0 ? 'fr' : 'fl'
        });
    }
    spawnAttackHitbox(player, attackType) {
    	const size = 10; // hitbox 10x10
    	const distance = attackType === 'normal' ? 40 : 50;

    	const originX = player.x + player.dir * distance;
    	const width = size * player.dir; // đổ về phía player

    	this.attackHitboxes.push({
            x: originX,
            y: player.y - 50,
            width: width,
            height: size,
            damage: attackType === 'normal' ? 10 : 40,
            timer: attackType === 'normal' ? 0.1 : 0.3,
            owner: player,
            attackType: attackType
        });
    }

    updateProjectiles(ctx, dt, canvasW) {
        // Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.x += p.vx;

            // Kiểm tra va chạm với tường cho chưởng trong multiplayer
            if (p.isSkill && this.isMultiplayer) {
                if (p.x < 0 || p.x > canvasW) {
                    // Nảy lại
                    p.vx *= -1;
                    p.bounces++;
                    p.canDamageOwner = true; // Sau khi nảy, có thể gây damage cho chủ nhân
                    p.vx *= 1.05;
                    p.x = clamp(p.x, 0, canvasW);
                    // Đổi hướng ảnh khi nảy
                    p.image = p.vx > 0 ? 'fr' : 'fl';
                    continue;
                }
            } else {
                // Đối với singleplayer hoặc không phải chưởng, xóa khi chạm tường
                if (p.x < 0 || p.x > canvasW) {
                    this.explosions.push({
                        x: clamp(p.x, 0, canvasW),
                        y: p.y,
                        radius: p.radius * 2 + 10,
                        timer: 0.2
                    });
                    this.projectiles.splice(i, 1);
                    continue;
                }
            }
            
            // Vẽ chưởng bằng hình ảnh
            const img = this.projectileImages[p.image];
            if (img && img.complete) {
                const drawX = p.x - (p.vx > 0 ? 0 : p.width);
                const drawY = p.y - p.height/2;
                ctx.drawImage(img, drawX, drawY, p.width, p.height);
            } else {
                // Fallback: vẽ hình tròn
                ctx.fillStyle = 'black';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Update explosions
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const e = this.explosions[i];
            ctx.fillStyle = 'rgba(255,80,0,0.45)';
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
            ctx.fill();
            e.timer -= dt;
            if (e.timer <= 0) this.explosions.splice(i, 1);
        }

        // Update attack hitboxes
        for (let i = this.attackHitboxes.length - 1; i >= 0; i--) {
            const hitbox = this.attackHitboxes[i];
            hitbox.timer -= dt;
            
            if (hitbox.timer <= 0) {
                this.attackHitboxes.splice(i, 1);
            }
        }
    }

    checkProjectileCollision(player) {
        // Kiểm tra va chạm với đạn
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            
            if (circleRectCollision(p, player.hitbox)) {
                const isPlayer1 = player.color === 'blue';
                const isOwner = (isPlayer1 && p.owner === 1) || (!isPlayer1 && p.owner === -1);

                // Nếu là chưởng trong multiplayer và chưa nảy, và đây là chủ nhân, thì bỏ qua
                if (p.isSkill && this.isMultiplayer && !p.canDamageOwner && isOwner) {
                    continue;
                }

                if (!player.state.invulnerable) {
                    // Nếu player đang dựng khiên
                    if (player.state.shield) {
                        const damageTaken = p.damage / 2;
                        const staminaLoss = p.damage / 2;

                        player.stats.hp -= damageTaken;
                        player.stats.stamina -= staminaLoss;

                        player.setStaminaRecovery();

                        if (player.stats.stamina <= 0 || p.isStrong) {
                            player.stats.stamina = Math.max(player.stats.stamina, 0);
                            player.stun(1);
                        }

                        this.projectiles.splice(i, 1);
                        return true;
                    } else {
                        player.takeDamage(p.damage);
                        this.projectiles.splice(i, 1);
                        return true;
                    }
                }
            }
        }

        // Kiểm tra va chạm với đòn tấn công cận chiến - FIX: đòn đánh tay không gây damage cho người đánh
        for (let i = this.attackHitboxes.length - 1; i >= 0; i--) {
            const hitbox = this.attackHitboxes[i];
            
            if (rectRectCollision(hitbox, player.hitbox)) {
                const isPlayer1 = player.color === 'blue';
                const isOwner = (isPlayer1 && hitbox.owner === 1) || (!isPlayer1 && hitbox.owner === -1);
                
                // FIX: Đòn đánh tay không gây damage cho chủ nhân
                if (isOwner) {
                    continue;
                }

                if (!player.state.invulnerable) {
                    // Nếu player đang dựng khiên
                    if (player.state.shield) {
                        const staminaLoss = hitbox.damage / 2;

                        player.stats.stamina -= staminaLoss;

                        player.setStaminaRecovery();

                        if (player.stats.stamina <= 0 || hitbox.attackType === 'strong') {
                            player.stats.stamina = Math.max(player.stats.stamina, 0);
                            player.stun(1);
                        }

                        this.attackHitboxes.splice(i, 1);
                        return true;
                    } else {
                        player.takeDamage(hitbox.damage);
                        this.attackHitboxes.splice(i, 1);
                        return true;
                    }
                }
            }
        }
        
        return false;
    }

    handlePlayerActions(player, input, isPlayer1 = true) {
        if (player.isDead || player.state.stunned) return;

        // Freeze direction during attack
        const freezeDir = !!player.state.attack;
        if (!freezeDir) {
            if (isPlayer1) {
                if (input.isKeyPressed('KeyA') || input.isKeyPressed('a')) player.dir = -1;
                if (input.isKeyPressed('KeyD') || input.isKeyPressed('d')) player.dir = 1;
            } else {
                if (input.isKeyPressed('ArrowLeft')) player.dir = -1;
                if (input.isKeyPressed('ArrowRight')) player.dir = 1;
            }
        }

        // Potions
        if (isPlayer1) {
            if ((input.isKeyPressed('Digit1') || input.isKeyPressed('1')) && (player.creative || player.manaPotions > 0)) {
                if (!player.creative) player.manaPotions--;
                player.stats.mana = Math.min(player.stats.mana + 25, player.statsMax.mana);
                input.clearKey('Digit1');
                input.clearKey('1');
            }

            if ((input.isKeyPressed('Digit2') || input.isKeyPressed('2')) && (player.creative || player.hpPotions > 0)) {
                if (!player.creative) player.hpPotions--;
                player.stats.hp = Math.min(player.stats.hp + 50, player.statsMax.hp);
                input.clearKey('Digit2');
                input.clearKey('2');
            }
        } else {
            if (input.isKeyPressed('Numpad7') && (player.creative || player.manaPotions > 0)) {
                if (!player.creative) player.manaPotions--;
                player.stats.mana = Math.min(player.stats.mana + 25, player.statsMax.mana);
                input.clearKey('Numpad7');
            }

            if (input.isKeyPressed('Numpad8') && (player.creative || player.hpPotions > 0)) {
                if (!player.creative) player.hpPotions--;
                player.stats.hp = Math.min(player.stats.hp + 50, player.statsMax.hp);
                input.clearKey('Numpad8');
            }
        }

        if (player.state.inputLocked) return;

        // Roll
        const rollKey = isPlayer1 ? 'KeyL' : 'Numpad3';
        const rollKeyAlt = isPlayer1 ? 'l' : null;
        if ((input.isKeyPressed(rollKey) || (rollKeyAlt && input.isKeyPressed(rollKeyAlt))) && 
            !player.state.rolling && 
            player.state.rollCooldown <= 0 &&
            (player.creative || player.stats.stamina > 0)) {
            
            player.state.rolling = true;
            player.state.rollDir = player.dir;
            player.state.rollElapsed = 0;
            player.state.invulnerable = true;
            player.state.rollCooldown = 0.3;

            if (!player.creative) {
                if (player.stats.stamina < 20) {
                    player.stats.stamina = 0;
                } else {
                    player.stats.stamina -= 20;
                }
                player.setStaminaRecovery();
            }

            setTimeout(() => {
                player.state.rolling = false;
                setTimeout(() => {
                    player.state.invulnerable = false;
                }, 100);
            }, player.state.rollDuration * 1000);

            input.clearKey(rollKey);
            if (rollKeyAlt) input.clearKey(rollKeyAlt);
        }

        // Shield
        const shieldKey = isPlayer1 ? 'KeyS' : 'ArrowDown';
        const shieldKeyAlt = isPlayer1 ? 's' : null;
        player.state.shield = (input.isKeyPressed(shieldKey) || (shieldKeyAlt && input.isKeyPressed(shieldKeyAlt))) && 
                             !player.creative && 
                             !player.state.rolling &&
                             player.stats.stamina > 0;

        const canAttack = !(player.state.shield || player.state.rolling);

        // Normal attack
        const normalAttackKey = isPlayer1 ? 'KeyJ' : 'Numpad1';
        const normalAttackKeyAlt = isPlayer1 ? 'j' : null;
        if (canAttack && (input.isKeyPressed(normalAttackKey) || (normalAttackKeyAlt && input.isKeyPressed(normalAttackKeyAlt))) && player.state.attack === null) {
            if (player.creative || player.stats.stamina > 0) {
                if (!player.creative) {
                    if (player.stats.stamina < 10) {
                        player.stats.stamina = 0;
                    } else {
                        player.stats.stamina -= 10;
                    }
                    player.setStaminaRecovery();
                }
                player.state.attack = 'normal';
                player.state.inputLocked = true;

                setTimeout(() => {
                    this.spawnAttackHitbox(player, 'normal');
                }, 50);

                setTimeout(() => {
                    player.state.attack = null;
                    player.state.inputLocked = false;
                }, 100);

                input.clearKey(normalAttackKey);
                if (normalAttackKeyAlt) input.clearKey(normalAttackKeyAlt);
            }
        }

        // Strong attack
        const strongAttackKey = isPlayer1 ? 'KeyK' : 'Numpad2';
        const strongAttackKeyAlt = isPlayer1 ? 'k' : null;
        if (canAttack && (input.isKeyPressed(strongAttackKey) || (strongAttackKeyAlt && input.isKeyPressed(strongAttackKeyAlt))) && player.state.attack === null) {
            if (player.creative || player.stats.stamina > 0) {
                if (!player.creative) {
                    if (player.stats.stamina < 20) {
                        player.stats.stamina = 0;
                    } else {
                        player.stats.stamina -= 20;
                    }
                    player.setStaminaRecovery();
                }
                player.state.attack = 'strong';
                player.state.inputLocked = true;

                setTimeout(() => {
                    this.spawnAttackHitbox(player, 'strong');
                }, 50);

                setTimeout(() => {
                    player.state.attack = null;
                    player.state.inputLocked = false;
                }, 500);

                input.clearKey(strongAttackKey);
                if (strongAttackKeyAlt) input.clearKey(strongAttackKeyAlt);
            }
        }

        // Skill U
        const skillUKey = isPlayer1 ? 'KeyU' : 'Numpad4';
        const skillUKeyAlt = isPlayer1 ? 'u' : null;
        if (canAttack && (input.isKeyPressed(skillUKey) || (skillUKeyAlt && input.isKeyPressed(skillUKeyAlt))) && player.state.skill === null && 
            (player.creative || (player.stats.mana >= 3 && player.stats.stamina > 0))) {
            
            if (player.creative || player.stats.stamina > 0) {
                if (!player.creative) {
                    player.stats.mana -= 3;
                    if (player.stats.stamina < 10) {
                        player.stats.stamina = 0;
                    } else {
                        player.stats.stamina -= 10;
                    }
                    player.setStaminaRecovery();
                }

                player.state.skill = 'u';
                player.state.inputLocked = true;

                setTimeout(() => {
                    this.spawnProjectile(player.x, player.y, 20, false, player.dir);
                    player.state.skill = null;
                    player.state.inputLocked = false;
                }, 200);

                input.clearKey(skillUKey);
                if (skillUKeyAlt) input.clearKey(skillUKeyAlt);
            }
        }

        // Skill I
        const skillIKey = isPlayer1 ? 'KeyI' : 'Numpad5';
        const skillIKeyAlt = isPlayer1 ? 'i' : null;
        if (canAttack && (input.isKeyPressed(skillIKey) || (skillIKeyAlt && input.isKeyPressed(skillIKeyAlt))) && player.state.skill === null && 
            (player.creative || (player.stats.mana >= 10 && player.stats.stamina > 0))) {
            
            if (player.creative || player.stats.stamina > 0) {
                if (!player.creative) {
                    player.stats.mana -= 10;
                    if (player.stats.stamina < 20) {
                        player.stats.stamina = 0;
                    } else {
                        player.stats.stamina -= 20;
                    }
                    player.setStaminaRecovery();
                }

                player.state.skill = 'i';
                player.state.inputLocked = true;

                setTimeout(() => {
                    this.spawnProjectile(player.x, player.y, 80, true, player.dir);
                    player.state.skill = null;
                    player.state.inputLocked = false;
                }, 1500);

                input.clearKey(skillIKey);
                if (skillIKeyAlt) input.clearKey(skillIKeyAlt);
            }
        }
    }
}