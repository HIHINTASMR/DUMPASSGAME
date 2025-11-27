class Player {
    constructor(x, y, type = 'p1', color = 'black') {
        this.x = x;
        this.y = y;
        this.vy = 0;
        this.dir = 1;
        this.color = color;
        this.type = type;
        this.creative = false;
        this.isDead = false;
        
        this.statsMax = { hp: 100, mana: 25, stamina: 50 };
        this.stats = { hp: 100, mana: 25, stamina: 50 };
        this.manaPotions = 2;
        this.hpPotions = 5;
        
        this.state = {
            attack: null,
            skill: null,
            shield: false,
            rolling: false,
            rollDir: 1,
            rollElapsed: 0,
            rollDuration: 0.2,
            invulnerable: false,
            staminaRecoverTimer: 0,
            inputLocked: false,
            rollCooldown: 0,
            stunned: false,
            stunTimer: 0
        };

        this.width = 40;
        this.height = 100;
        
        this.hitbox = {
            x: this.x - this.width/2,
            y: this.y - this.height,
            width: this.width,
            height: this.height
        };

        this.images = {};
        this.loadImages();
        this.currentImage = null;
        
        // Load ảnh kiếm
        this.swordImage = new Image();
        this.swordImage.src = 'img/items/sw.png';
    }

    loadImages() {
        const states = ['nor', 'ml', 'mr', 'al', 'ar', 'rl', 'rr', 's', 'f'];
        
        states.forEach(state => {
            this.images[state] = new Image();
            this.images[state].src = `img/char/${this.type}${state}.png`;
        });
    }

    updateHitbox() {
        if (this.isDead) {
            this.hitbox.x = this.x - 25;
            this.hitbox.y = this.y + 20;
            this.hitbox.width = 50;
            this.hitbox.height = 10;
        } else if (this.state.rolling) {
            this.hitbox.x = this.x - this.width/2;
            this.hitbox.y = this.y - this.height;
            this.hitbox.width = this.width;
            this.hitbox.height = this.height;
        } else if (this.state.shield) {
            this.hitbox.x = this.x - this.width/2;
            this.hitbox.y = this.y - this.height;
            this.hitbox.width = this.width;
            this.hitbox.height = this.height;
        } else if (this.state.skill === 'u' || this.state.skill === 'i') {
            this.hitbox.x = this.x - this.width/2;
            this.hitbox.y = this.y - this.height;
            this.hitbox.width = this.width;
            this.hitbox.height = this.height;
        } else {
            this.hitbox.x = this.x - this.width/2;
            this.hitbox.y = this.y - this.height;
            this.hitbox.width = this.width;
            this.hitbox.height = this.height;
        }
    }

    takeDamage(dmg) {
        if (this.state.invulnerable || this.creative || this.isDead) return;
        
        this.stats.hp -= dmg;
        if (this.stats.hp <= 0) {
            this.stats.hp = 0;
            this.die();
        }
    }

    die() {
        this.isDead = true;
        this.state.inputLocked = true;
        this.state.attack = null;
        this.state.skill = null;
        this.state.shield = false;
        this.state.rolling = false;
        this.state.invulnerable = false;
        this.state.stunned = false;
        this.updateHitbox();
    }

    stun(duration) {
        this.state.stunned = true;
        this.state.stunTimer = duration;
        this.state.shield = false;
        this.state.inputLocked = true;

        setTimeout(() => {
            this.state.inputLocked = false;
            this.state.stunned = false;
        }, duration * 1000);
    }

    determineImage() {
        if (this.isDead) {
            return null;
        }

        if (this.state.rolling) {
            return this.dir > 0 ? this.images.rr : this.images.rl;
        }

        if (this.state.shield) {
            return this.images.s;
        }

        // Khi vận chưởng (skill u hoặc i)
        if (this.state.skill === 'u' || this.state.skill === 'i') {
            return this.images.f;
        }

        if (this.state.attack === 'normal' || this.state.attack === 'strong') {
            return this.dir > 0 ? this.images.ar : this.images.al;
        }

        if (this.moving) {
            return this.dir > 0 ? this.images.mr : this.images.ml;
        }

        return this.images.nor;
    }

    draw(ctx) {

        this.currentImage = this.determineImage();

        if (this.currentImage && this.currentImage.complete) {
            let drawWidth, drawHeight, drawX, drawY;

            // Xác định kích thước và vị trí vẽ dựa trên trạng thái
            if (this.state.rolling) {
                // Roll: h=30, giữ nguyên tỉ lệ
                drawHeight = 50;
                drawWidth = drawHeight * (this.width / this.height); // Giữ nguyên tỉ lệ
                drawX = this.x - drawWidth/2;
                drawY = this.y - drawHeight;
            } else if (this.state.skill === 'u' || this.state.skill === 'i') {
                // Vận chưởng: h=50, giữ nguyên tỉ lệ
                drawHeight = 50;
                drawWidth = drawHeight * (75/50);
                drawX = this.x - drawWidth/2;
                drawY = this.y - this.height; // Đỉnh ảnh vận chưởng chạm đỉnh ảnh nhân vật
            } else {
                // Bình thường: 40x100
                drawWidth = this.width;
                drawHeight = this.height;
                drawX = this.x - drawWidth/2;
                drawY = this.y - drawHeight;
            }

            ctx.drawImage(this.currentImage, drawX, drawY, drawWidth, drawHeight);

            // Vẽ kiếm khi đánh
            if (this.state.attack === 'normal' || this.state.attack === 'strong') {
                this.drawSword(ctx);
            }
        } else {
            this.drawStickman(ctx);
        }
    }

    drawSword(ctx) {
        if (!this.swordImage.complete) return;

        const swordLength = this.state.attack === 'normal' ? 30 : 40;
        const swordWidth = 4;

        // Vị trí bắt đầu: giữa player
        const startX = this.dir > 0 ? this.x + this.width/2 : this.x - this.width/2;
    	const startY = this.y - this.height/2;

        ctx.save();
        ctx.translate(startX, startY);
        
        if (this.dir > 0) {
            // Đánh bên phải
            ctx.drawImage(this.swordImage, 0, -swordWidth/2, swordLength, swordWidth);
        } else {
            // Đánh bên trái - lật ảnh
            ctx.scale(-1, 1);
            ctx.drawImage( this.swordImage, -swordLength + (this.state.attack === 'normal' ? 30 : 40),-swordWidth/2,swordLength,swordWidth);

        }
        
        ctx.restore();
    }

    drawStickman(ctx) {
        const px = this.x;
        const py = this.y - 50;

        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;

        if (this.isDead) {
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(px - 25, py + 30);
            ctx.lineTo(px + 25, py + 30);
            ctx.stroke();
            return;
        }

        if (this.state.rolling) {
            ctx.font = '20px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText('o', px, py + 45);
            return;
        }

        if (this.state.shield) {
            ctx.font = '70px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'alphabetic';
            ctx.fillText('0', px, py + 40);
            return;
        }

        if (this.state.skill === 'u' || this.state.skill === 'i') {
            ctx.font = '30px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('o', px, py - 10);
            return;
        }

        ctx.lineWidth = 3;

        // Head
        ctx.beginPath();
        ctx.arc(px, py - 20, 10, 0, Math.PI * 2);
        ctx.stroke();

        // Body
        ctx.beginPath();
        ctx.moveTo(px, py - 10);
        ctx.lineTo(px, py + 20);
        ctx.stroke();

        // Arms
        ctx.beginPath();
        ctx.moveTo(px - 15, py);
        ctx.lineTo(px + 15, py);
        ctx.stroke();

        // Legs
        ctx.beginPath();
        ctx.moveTo(px, py + 20);
        ctx.lineTo(px - 10, py + 40);
        ctx.moveTo(px, py + 20);
        ctx.lineTo(px + 10, py + 40);
        ctx.stroke();

        // Attacks
        if (this.state.attack === 'normal') {
            ctx.strokeStyle = 'brown';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(px + 15 * this.dir, py);
            ctx.lineTo(px + 40 * this.dir, py);
            ctx.stroke();
        } else if (this.state.attack === 'strong') {
            ctx.strokeStyle = 'brown';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(px + 15 * this.dir, py);
            ctx.lineTo(px + 50 * this.dir, py);
            ctx.stroke();
        }
    }

    updateStamina(dt) {
        if (this.state.staminaRecoverTimer > 0) {
            this.state.staminaRecoverTimer -= dt;
            if (this.state.staminaRecoverTimer <= 0 && !this.creative) {
                this.stats.stamina = this.statsMax.stamina;
            }
        }
        
        if (this.state.rollCooldown > 0) {
            this.state.rollCooldown -= dt;
        }

        if (this.state.stunned) {
            this.state.stunTimer -= dt;
            if (this.state.stunTimer <= 0) {
                this.state.stunned = false;
                this.state.stunTimer = 0;
            }
        }
    }

    setStaminaRecovery() {
        if (this.stats.stamina > 0) {
            this.state.staminaRecoverTimer = 1.5;
        } else {
            this.state.staminaRecoverTimer = 2.0;
        }
    }
}