class HUD {
    static drawBar(ctx, sx, sy, w, h, cur, max, color) {
        ctx.fillStyle = '#555';
        ctx.fillRect(sx, sy, w, h);
        ctx.fillStyle = color;
        ctx.fillRect(sx, sy, w * clamp(cur / max, 0, 1), h);
    }

    static drawSinglePlayerHUD(ctx, player) {
        let sx = 10, sy = 10, barH = 15;

        // HP Bar
        this.drawBar(ctx, sx, sy, 360, barH, player.stats.hp, player.statsMax.hp, 'red');
        sy += 20;

        // Mana Bar
        this.drawBar(ctx, sx, sy, 90, barH, player.stats.mana, player.statsMax.mana, 'blue');
        sy += 20;

        // Stamina Bar
        this.drawBar(ctx, sx, sy, 180, barH, player.stats.stamina, player.statsMax.stamina, 'green');
        sy += 25;

        // HP Potions - FIX: vị trí số lượng bình
        if (this.hpPotionImage && this.hpPotionImage.complete) {
            ctx.drawImage(this.hpPotionImage, sx, sy, 20, 20);
        } else {
            ctx.fillStyle = 'red';
            ctx.fillRect(sx, sy, 20, 20);
        }
        ctx.fillStyle = 'white';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'left';
        // FIX: vị trí chữ số lượng bình
        ctx.fillText('x' + player.hpPotions, sx + 25, sy + 15);

        // Mana Potions - FIX: vị trí số lượng bình
        if (this.manaPotionImage && this.manaPotionImage.complete) {
            ctx.drawImage(this.manaPotionImage, sx + 110, sy, 20, 20);
        } else {
            ctx.fillStyle = 'blue';
            ctx.fillRect(sx + 110, sy, 20, 20);
        }
        ctx.fillStyle = 'white';
        // FIX: vị trí chữ số lượng bình
        ctx.fillText('x' + player.manaPotions, sx + 135, sy + 15);
    }

    static drawMultiplayerHUD(ctx, p1, p2, canvasW) {
        const barH = 15;

        // ===== PLAYER 1 (bên trái) =====
        let sx = 10, sy = 10;

        this.drawBar(ctx, sx, sy, 300, barH, p1.stats.hp, p1.statsMax.hp, 'red');
        sy += 20;
        this.drawBar(ctx, sx, sy, 75, barH, p1.stats.mana, p1.statsMax.mana, 'blue');
        sy += 20;
        this.drawBar(ctx, sx, sy, 150, barH, p1.stats.stamina, p1.statsMax.stamina, 'green');
        sy += 25;

        // Potions P1 - FIX: vị trí số lượng bình
        // HP Potion
        if (this.hpPotionImage && this.hpPotionImage.complete) {
            ctx.drawImage(this.hpPotionImage, sx, sy, 20, 20);
        } else {
            ctx.fillStyle = 'red';
            ctx.fillRect(sx, sy, 20, 20);
        }
        ctx.fillStyle = 'white';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'left';
        // FIX: vị trí chữ số lượng bình
        ctx.fillText('x' + p1.hpPotions, sx + 25, sy + 15);

        // Mana Potion
        if (this.manaPotionImage && this.manaPotionImage.complete) {
            ctx.drawImage(this.manaPotionImage, sx + 110, sy, 20, 20);
        } else {
            ctx.fillStyle = 'blue';
            ctx.fillRect(sx + 110, sy, 20, 20);
        }
        ctx.fillStyle = 'white';
        // FIX: vị trí chữ số lượng bình
        ctx.fillText('x' + p1.manaPotions, sx + 135, sy + 15);

        // ===== PLAYER 2 (bên phải) =====
        sx = canvasW - 10;
        sy = 10;

        // BAR P2
        this.drawBar(ctx, sx - 300, sy, 300, barH, p2.stats.hp, p2.statsMax.hp, 'red');
        sy += 20;
        this.drawBar(ctx, sx - 75, sy, 75, barH, p2.stats.mana, p2.statsMax.mana, 'blue');
        sy += 20;
        this.drawBar(ctx, sx - 150, sy, 150, barH, p2.stats.stamina, p2.statsMax.stamina, 'green');
        sy += 25;

        // Potions P2 - FIX: vị trí số lượng bình
        const hpX = sx - 20;
        const manaX = sx - 130;

        // HP Potion
        if (this.hpPotionImage && this.hpPotionImage.complete) {
            ctx.drawImage(this.hpPotionImage, hpX, sy, 20, 20);
        } else {
            ctx.fillStyle = 'red';
            ctx.fillRect(hpX, sy, 20, 20);
        }
        ctx.fillStyle = 'white';
        ctx.textAlign = 'right';
        // FIX: vị trí chữ số lượng bình
        ctx.fillText('x' + p2.hpPotions, hpX - 5, sy + 15);

        // Mana Potion
        if (this.manaPotionImage && this.manaPotionImage.complete) {
            ctx.drawImage(this.manaPotionImage, manaX, sy, 20, 20);
        } else {
            ctx.fillStyle = 'blue';
            ctx.fillRect(manaX, sy, 20, 20);
        }
        ctx.fillStyle = 'white';
        // FIX: vị trí chữ số lượng bình
        ctx.fillText('x' + p2.manaPotions, manaX - 5, sy + 15);
        
        // Reset text align
        ctx.textAlign = 'left';
    }
}

// Load hình ảnh
HUD.hpPotionImage = new Image();
HUD.hpPotionImage.src = 'img/items/hp.png';
HUD.manaPotionImage = new Image();
HUD.manaPotionImage.src = 'img/items/mana.png';

// Fallback nếu hình ảnh không load được
HUD.hpPotionImage.onerror = function() {
    console.log('Failed to load hp potion image');
};
HUD.manaPotionImage.onerror = function() {
    console.log('Failed to load mana potion image');
};