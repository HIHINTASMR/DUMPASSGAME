class Physics {
    static updatePlayer(player, keys, canvasW, canvasH, dt, isPlayer1 = true) {
        const ground = getGround(canvasH);
        
        // Theo dõi trạng thái di chuyển
        player.moving = false;
        
        if (!player.state.inputLocked && !player.isDead && !player.state.stunned) {
            if (player.creative) {
                // Creative mode movement
                if (isPlayer1) {
                    if (keys['KeyW'] || keys['w'] || keys['W']) player.y -= 5;
                    if (keys['KeyS'] || keys['s'] || keys['S']) player.y += 5;
                    if (keys['KeyA'] || keys['a'] || keys['A']) { 
                        player.x -= 5;
                        player.moving = true;
                    }
                    if (keys['KeyD'] || keys['d'] || keys['D']) { 
                        player.x += 5;
                        player.moving = true;
                    }
                }
            } else {
                if (!player.state.rolling) {
                    // Jump
                    if (isPlayer1 && (keys['KeyW'] || keys['w'] || keys['W']) && player.y >= ground) {
                        player.vy = -15;
                    }
                    
                    // Horizontal movement only when not attacking
                    if (!player.state.attack) {
                        let moveSpeed = 5;
                        // Nếu đang dựng khiên, giảm tốc độ 80%
                        if (player.state.shield) {
                            moveSpeed = 5 * 0.2;
                        }
                        if (isPlayer1) {
                            if (keys['KeyA'] || keys['a'] || keys['A']) { 
                                player.x -= moveSpeed;
                                player.moving = true;
                            }
                            if (keys['KeyD'] || keys['d'] || keys['D']) { 
                                player.x += moveSpeed;
                                player.moving = true;
                            }
                        }
                    }
                }
                
                // Apply gravity
                if (!player.state.rolling) {
                    player.vy += 0.7;
                    player.y += player.vy;
                } else {
                    player.y = ground;
                    player.vy = 0;
                }
                
                // Ground collision
                if (player.y > ground) {
                    player.y = ground;
                    player.vy = 0;
                }
            }
        }
        
        if (player.state.rolling) {
            player.state.rollElapsed += dt;
            const rollSpeed = 100 / player.state.rollDuration;
            player.x += rollSpeed * dt * player.state.rollDir;
            player.y = ground;
            player.vy = 0;
        }
        
        // Keep player in bounds
        player.x = clamp(player.x, 20 + player.width/2, canvasW - 20 - player.width/2);
        player.y = clamp(player.y, player.height, canvasH - 20);
        
        // Update hitbox position
        player.updateHitbox();
    }
    
    static updatePlayer2(player, keys, canvasW, canvasH, dt) {
        const ground = getGround(canvasH);
        
        // Theo dõi trạng thái di chuyển
        player.moving = false;
        
        if (!player.state.inputLocked && !player.isDead && !player.state.stunned) {
            if (!player.state.rolling) {
                // Jump
                if ((keys['ArrowUp']) && player.y >= ground) {
                    player.vy = -15;
                }
                
                // Horizontal movement only when not attacking
                if (!player.state.attack) {
                    let moveSpeed = 5;
                    // Nếu đang dựng khiên, giảm tốc độ 80%
                    if (player.state.shield) {
                        moveSpeed = 5 * 0.2;
                    }
                    if (keys['ArrowLeft']) { 
                        player.x -= moveSpeed;
                        player.moving = true;
                    }
                    if (keys['ArrowRight']) { 
                        player.x += moveSpeed;
                        player.moving = true;
                    }
                }
            }
            
            // Apply gravity
            if (!player.state.rolling) {
                player.vy += 0.7;
                player.y += player.vy;
            } else {
                player.y = ground;
                player.vy = 0;
            }
            
            // Ground collision
            if (player.y > ground) {
                player.y = ground;
                player.vy = 0;
            }
        }
        
        if (player.state.rolling) {
            player.state.rollElapsed += dt;
            const rollSpeed = 100 / player.state.rollDuration;
            player.x += rollSpeed * dt * player.state.rollDir;
            player.y = ground;
            player.vy = 0;
        }
        
        // Keep player in bounds
        player.x = clamp(player.x, 20 + player.width/2, canvasW - 20 - player.width/2);
        player.y = clamp(player.y, player.height, canvasH - 20);
        
        // Update hitbox position
        player.updateHitbox();
    }
}