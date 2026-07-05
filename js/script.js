// Wind Magic System
class WindMagicSystem {
    constructor() {
        // Canvas setup
        this.canvas = document.getElementById('windCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Magic system state
        this.currentLevel = 1;
        this.maxLevel = 10;
        this.evolutionStage = 0; // 0: Breeze, 1: Gust, 2: Cyclone, 3: Tornado, 4: Tempest
        this.evolutionStages = ['Breeze', 'Gust', 'Cyclone', 'Tornado', 'Tempest'];
        this.evolutionThresholds = [0, 3, 6, 8, 10]; // Levels at which evolution occurs

        // Statistics
        this.spellsCast = 0;
        this.totalPowerUsed = 0;
        this.totalEvolutions = 0;

        // Particle system
        this.particles = [];
        this.windStreams = [];
        this.isCasting = false;

        // DOM elements
        this.currentLevelEl = document.getElementById('currentLevel');
        this.windPowerEl = document.getElementById('windPower');
        this.evolutionStageEl = document.getElementById('evolutionStage');
        this.levelSlider = document.getElementById('magicLevel');
        this.levelDisplay = document.getElementById('levelDisplay');
        this.castButton = document.getElementById('castButton');
        this.evolveButton = document.getElementById('evolveButton');
        this.resetButton = document.getElementById('resetButton');
        this.magicInfo = document.getElementById('magicInfo');
        this.coreInner = document.getElementById('coreInner');
        this.spellsCastEl = document.getElementById('spellsCast');
        this.totalPowerEl = document.getElementById('totalPower');
        this.evolutionCountEl = document.getElementById('evolutionCount');

        // Event listeners
        this.levelSlider.addEventListener('input', (e) => this.updateLevel(parseInt(e.target.value)));
        this.castButton.addEventListener('click', () => this.castMagic());
        this.evolveButton.addEventListener('click', () => this.evolveMagic());
        this.resetButton.addEventListener('click', () => this.resetMagic());

        // Animation loop
        this.animate();

        // Initial update
        this.updateUI();
    }

    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    updateLevel(level) {
        this.currentLevel = level;
        this.levelSlider.value = level;
        this.levelDisplay.textContent = `Level ${level}`;
        this.updateUI();
    }

    updateUI() {
        // Update stats
        this.currentLevelEl.textContent = this.currentLevel;
        const windPowerPercent = Math.round((this.currentLevel / this.maxLevel) * 100);
        this.windPowerEl.textContent = windPowerPercent + '%';
        this.evolutionStageEl.textContent = this.evolutionStages[this.evolutionStage];

        // Update info
        const stageName = this.getStageDescription();
        this.magicInfo.textContent = stageName;

        // Update statistics
        this.spellsCastEl.textContent = this.spellsCast;
        this.totalPowerEl.textContent = Math.round(this.totalPowerUsed);
        this.evolutionCountEl.textContent = this.totalEvolutions;

        // Update core color based on level
        const hue = 180 + (this.currentLevel * 6);
        this.coreInner.style.filter = `hue-rotate(${hue}deg) brightness(${0.8 + this.currentLevel * 0.02})`;
    }

    getStageDescription() {
        const descriptions = [
            `Wind Breeze (Level ${this.currentLevel}): Gentle wind flow, basic thrust power.`,
            `Wind Gust (Level ${this.currentLevel}): Stronger gusts, increased wind velocity.`,
            `Wind Cyclone (Level ${this.currentLevel}): Spinning vortex of wind, powerful rotation.`,
            `Wind Tornado (Level ${this.currentLevel}): Devastating tornado, extreme wind force.`,
            `Wind Tempest (Level ${this.currentLevel}): Ultimate wind magic, catastrophic power!`
        ];
        return descriptions[this.evolutionStage];
    }

    castMagic() {
        if (this.isCasting) return;

        this.isCasting = true;
        this.spellsCast++;
        this.totalPowerUsed += this.currentLevel * 10;

        // Calculate wind power based on level
        const basePower = 20 + (this.currentLevel * 15);
        const windForce = basePower + (this.evolutionStage * 30);

        // Check for evolution
        const nextThreshold = this.evolutionThresholds[this.evolutionStage + 1];
        if (nextThreshold && this.currentLevel >= nextThreshold && this.evolutionStage < 4) {
            this.showEvolutionNotification();
        }

        // Disable button during casting
        this.castButton.disabled = true;
        this.castButton.style.opacity = '0.5';

        // Create wind effect
        this.createWindEffect(windForce);

        // Visual feedback
        this.animateCastEffect();

        // Re-enable button after animation
        setTimeout(() => {
            this.castButton.disabled = false;
            this.castButton.style.opacity = '1';
            this.isCasting = false;
        }, 1500);

        this.updateUI();
    }

    createWindEffect(windForce) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const particleCount = 30 + (this.currentLevel * 8);

        // Create wind streams
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = windForce / 100;

            this.particles.push({
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                life: 1,
                maxLife: 1,
                size: 2 + Math.random() * 4,
                color: this.getWindColor(),
                evolutionStage: this.evolutionStage
            });
        }

        // Create swirling wind streams for advanced stages
        if (this.evolutionStage >= 2) {
            for (let i = 0; i < 20; i++) {
                const angle = (Math.PI * 2 * i) / 20;
                const radius = 30 + Math.random() * 20;

                this.windStreams.push({
                    x: centerX + Math.cos(angle) * radius,
                    y: centerY + Math.sin(angle) * radius,
                    vx: Math.cos(angle + Math.PI / 4) * (windForce / 80),
                    vy: Math.sin(angle + Math.PI / 4) * (windForce / 80),
                    life: 1,
                    maxLife: 1,
                    size: 3 + Math.random() * 5,
                    color: this.getStreamColor(),
                    evolutionStage: this.evolutionStage
                });
            }
        }
    }

    getWindColor() {
        const colors = [
            '#00d4ff',      // Breeze - Cyan
            '#00ffff',      // Gust - Bright Cyan
            '#00ff88',      // Cyclone - Green-Cyan
            '#ffaa00',      // Tornado - Orange
            '#ff4444'       // Tempest - Red
        ];
        return colors[this.evolutionStage];
    }

    getStreamColor() {
        const colors = [
            'rgba(0, 212, 255, 0.6)',
            'rgba(0, 255, 255, 0.6)',
            'rgba(0, 255, 136, 0.6)',
            'rgba(255, 170, 0, 0.6)',
            'rgba(255, 68, 68, 0.6)'
        ];
        return colors[this.evolutionStage];
    }

    animateCastEffect() {
        const core = document.querySelector('.energy-core');
        const originalTransform = core.style.transform;
        core.style.transform = 'translate(-50%, -50%) scale(1.5)';
        core.style.boxShadow = `0 0 60px ${this.getWindColor()}`;

        setTimeout(() => {
            core.style.transform = originalTransform;
            core.style.boxShadow = '0 0 40px var(--primary-color), inset 0 0 20px rgba(255, 255, 255, 0.3)';
        }, 300);
    }

    evolveMagic() {
        if (this.evolutionStage >= 4) {
            alert('Already at maximum evolution stage! (Tempest)');
            return;
        }

        const nextThreshold = this.evolutionThresholds[this.evolutionStage + 1];
        if (this.currentLevel < nextThreshold) {
            alert(`Reach Level ${nextThreshold} to evolve to ${this.evolutionStages[this.evolutionStage + 1]}!`);
            return;
        }

        this.evolutionStage++;
        this.totalEvolutions++;

        // Visual evolution effect
        this.createEvolutionEffect();
        this.updateUI();

        setTimeout(() => {
            alert(`🎉 Wind Magic evolved to: ${this.evolutionStages[this.evolutionStage]}!`);
        }, 500);
    }

    createEvolutionEffect() {
        const container = document.getElementById('particleContainer');
        const particleCount = 40;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'wind-particle';
            particle.textContent = '✨';
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.top = Math.random() * window.innerHeight + 'px';
            particle.style.animation = `particleExplode ${1 + Math.random() * 0.5}s ease-out forwards`;
            container.appendChild(particle);

            setTimeout(() => particle.remove(), 1500);
        }

        // Add keyframes for particle explosion
        if (!document.querySelector('style[data-particle-animation]')) {
            const style = document.createElement('style');
            style.setAttribute('data-particle-animation', 'true');
            style.textContent = `
                @keyframes particleExplode {
                    0% {
                        opacity: 1;
                        transform: translate(0, 0) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(${(Math.random() - 0.5) * 300}px, ${(Math.random() - 0.5) * 300}px) scale(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    showEvolutionNotification() {
        const container = document.getElementById('particleContainer');
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, var(--accent-color), #ff8ab9);
            color: white;
            padding: 30px 50px;
            border-radius: 20px;
            font-size: 1.5em;
            font-weight: 700;
            text-align: center;
            z-index: 1000;
            animation: notificationPop 0.5s ease-out;
            box-shadow: 0 0 50px rgba(255, 107, 157, 0.6);
        `;
        notification.textContent = '🌪️ Ready to evolve! Use "Evolve Magic" button!';
        container.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);

        // Add keyframes for notification
        if (!document.querySelector('style[data-notification-animation]')) {
            const style = document.createElement('style');
            style.setAttribute('data-notification-animation', 'true');
            style.textContent = `
                @keyframes notificationPop {
                    0% {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 0;
                    }
                    50% {
                        transform: translate(-50%, -50%) scale(1.2);
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    resetMagic() {
        if (confirm('Reset all progress? This will reset level, evolution, and statistics.')) {
            this.currentLevel = 1;
            this.evolutionStage = 0;
            this.spellsCast = 0;
            this.totalPowerUsed = 0;
            this.totalEvolutions = 0;
            this.particles = [];
            this.windStreams = [];

            this.updateLevel(1);
            this.updateUI();

            alert('✨ Wind Magic reset! Start your journey again!');
        }
    }

    updateParticles() {
        // Update regular particles
        this.particles = this.particles.filter(p => p.life > 0);
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;

            // Wind resistance and gravity
            p.vx *= 0.98;
            p.vy *= 0.99;
        });

        // Update wind streams
        this.windStreams = this.windStreams.filter(p => p.life > 0);
        this.windStreams.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.015;

            // Circular motion for cyclone effect
            if (p.evolutionStage >= 2) {
                const centerX = this.canvas.width / 2;
                const centerY = this.canvas.height / 2;
                const dx = p.x - centerX;
                const dy = p.y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance > 0) {
                    const rotationForce = 0.15 * (this.evolutionStage - 1);
                    p.vx += (-dy / distance) * rotationForce;
                    p.vy += (dx / distance) * rotationForce;
                }
            }
        });
    }

    drawParticles() {
        // Draw regular wind particles
        this.particles.forEach(p => {
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.life;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Draw wind streams
        this.windStreams.forEach(p => {
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.life * 0.7;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.ctx.globalAlpha = 1;
    }

    drawBackground() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Add wind lines for visual effect
        if (this.particles.length > 0) {
            this.ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
            this.ctx.lineWidth = 1;

            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;

            for (let i = 0; i < this.particles.length; i += 5) {
                const p = this.particles[i];
                this.ctx.beginPath();
                this.ctx.moveTo(centerX, centerY);
                this.ctx.lineTo(p.x, p.y);
                this.ctx.stroke();
            }
        }
    }

    animate() {
        this.updateParticles();
        this.drawBackground();
        this.drawParticles();

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new WindMagicSystem();
});