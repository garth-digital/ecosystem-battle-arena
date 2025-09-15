console.log('🎮 Game starting...');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded, initializing game...');
    
    // Global game variable - declared here so buttons can access it
    window.game = null;
    
    class EcosystemArena {
        constructor() {
            console.log('🎮 EcosystemArena constructor called');
            
            this.canvas = document.getElementById('ecosystemCanvas');
            if (!this.canvas) {
                console.error('❌ Canvas not found!');
                return;
            }
            
            this.ctx = this.canvas.getContext('2d');
            this.running = false;
            this.generation = 1;
            
            // Game entities
            this.entities = {
                prey: [],
                predators: [],
                plants: [],
                bots: []
            };
            
            // Bot deployment
            this.selectedBotType = null;
            
            // Simulation parameters
            this.params = {
                breedingSpeed: 1,
                mutationRate: 0.1,
                foodGrowth: 1,
                preyVisionRange: 80,
                predatorVisionRange: 120,
                botVisionRange: 100
            };
            
            // Initialize everything
            this.initializeCanvas();
            this.setupEventListeners();
            this.resetArena();
            this.startGameLoop();
            
            console.log('✅ Game initialized successfully!');
        }
        
        initializeCanvas() {
            // Set canvas size
            this.canvas.width = 800;
            this.canvas.height = 600;
            
            // Click to deploy bots
            this.canvas.addEventListener('click', (e) => {
                if (this.selectedBotType) {
                    const rect = this.canvas.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    this.deployBot(this.selectedBotType, x, y);
                }
            });
            
            console.log('✅ Canvas initialized');
        }
        
        setupEventListeners() {
            // Bot selection
            document.querySelectorAll('.bot-item').forEach(item => {
                item.addEventListener('click', () => {
                    document.querySelectorAll('.bot-item').forEach(i => i.classList.remove('selected'));
                    item.classList.add('selected');
                    this.selectedBotType = item.dataset.type;
                    console.log('Bot selected:', this.selectedBotType);
                });
            });
            
            // Parameter sliders
            ['breedingSpeed', 'mutationRate', 'foodGrowth'].forEach(param => {
                const slider = document.getElementById(param);
                const display = document.getElementById(param + 'Value');
                if (slider && display) {
                    slider.addEventListener('input', () => {
                        this.params[param] = parseFloat(slider.value);
                        display.textContent = slider.value;
                    });
                }
            });
            
            console.log('✅ Event listeners setup');
        }
        
        deployBot(type, x, y) {
            const botConfig = this.getBotConfig(type);
            const bot = new Bot(x, y, botConfig);
            this.entities.bots.push(bot);
            this.updateStats();
            console.log(`Bot deployed: ${type} at (${Math.round(x)}, ${Math.round(y)})`);
        }
        
        getBotConfig(type) {
            const configs = {
                hunter: {
                    type: 'hunter',
                    size: 8,
                    speed: 2.5,
                    energy: 100,
                    color: '#ff4444',
                    behavior: 'aggressive'
                },
                defender: {
                    type: 'defender',
                    size: 12,
                    speed: 1,
                    energy: 150,
                    color: '#4444ff',
                    behavior: 'defensive'
                },
                scout: {
                    type: 'scout',
                    size: 6,
                    speed: 3.5,
                    energy: 80,
                    color: '#44ff44',
                    behavior: 'evasive'
                },
                collector: {
                    type: 'collector',
                    size: 9,
                    speed: 1.8,
                    energy: 120,
                    color: '#ffaa44',
                    behavior: 'collector'
                }
            };
            
            return configs[type] || configs.scout;
        }
        
        startGameLoop() {
            const gameLoop = () => {
                this.update();
                this.render();
                requestAnimationFrame(gameLoop);
            };
            gameLoop();
            console.log('✅ Game loop started');
        }
        
        update() {
            if (!this.running) return;
            
            // Update all moving entities
            [...this.entities.prey, ...this.entities.predators, ...this.entities.bots].forEach(entity => {
                if (entity.update) {
                    entity.update(this.getAllEntities(), this.params);
                }
            });
            
            // Handle interactions
            this.handleInteractions();
            
            // Spawn new entities
            this.spawnEntities();
            
            // Update UI
            this.updateStats();
        }
        
        getAllEntities() {
            return [...this.entities.prey, ...this.entities.predators, ...this.entities.plants, ...this.entities.bots];
        }
        
        handleInteractions() {
            // Prey eating plants
            this.entities.prey.forEach(prey => {
                this.entities.plants.forEach((plant, plantIndex) => {
                    if (this.checkCollision(prey, plant)) {
                        prey.energy = Math.min(100, prey.energy + 25);
                        this.entities.plants.splice(plantIndex, 1);
                    }
                });
            });
            
            // Predators eating prey
            this.entities.predators.forEach(predator => {
                this.entities.prey.forEach((prey, preyIndex) => {
                    if (this.checkCollision(predator, prey)) {
                        predator.energy = Math.min(100, predator.energy + 40);
                        this.entities.prey.splice(preyIndex, 1);
                    }
                });
            });
            
            // Bot interactions
            this.entities.bots.forEach(bot => {
                // Bots vs Predators
                this.entities.predators.forEach((predator, predIndex) => {
                    if (this.checkCollision(bot, predator)) {
                        if (bot.config.behavior === 'aggressive') {
                            this.entities.predators.splice(predIndex, 1);
                            bot.energy = Math.min(bot.energy + 20, bot.maxEnergy);
                        } else {
                            bot.energy -= 15;
                        }
                    }
                });
                
                // Collector bots eating plants
                if (bot.config.behavior === 'collector') {
                    this.entities.plants.forEach((plant, plantIndex) => {
                        if (this.checkCollision(bot, plant)) {
                            bot.energy = Math.min(bot.energy + 15, bot.maxEnergy);
                            this.entities.plants.splice(plantIndex, 1);
                        }
                    });
                }
            });
            
            // Remove dead entities
            this.entities.bots = this.entities.bots.filter(bot => bot.energy > 0);
            this.entities.prey = this.entities.prey.filter(prey => prey.energy > 0);
            this.entities.predators = this.entities.predators.filter(pred => pred.energy > 0);
        }
        
        checkCollision(entity1, entity2) {
            const dx = entity1.x - entity2.x;
            const dy = entity1.y - entity2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < (entity1.size || 5) + (entity2.size || 5);
        }
        
        spawnEntities() {
            // Spawn plants
            if (Math.random() < 0.02 * this.params.foodGrowth) {
                this.spawnPlant();
            }
            
            // Natural breeding
            if (this.entities.prey.length > 1 && Math.random() < 0.005 * this.params.breedingSpeed) {
                this.breedPrey();
            }
            
            if (this.entities.predators.length > 1 && Math.random() < 0.003 * this.params.breedingSpeed) {
                this.breedPredators();
            }
        }
        
        spawnPlant() {
            const plant = new Plant(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height
            );
            this.entities.plants.push(plant);
        }
        
        breedPrey() {
            if (this.entities.prey.length < 2) return;
            const parent1 = this.entities.prey[Math.floor(Math.random() * this.entities.prey.length)];
            const parent2 = this.entities.prey[Math.floor(Math.random() * this.entities.prey.length)];
            
            if (parent1 !== parent2) {
                const offspring = new Prey(
                    (parent1.x + parent2.x) / 2 + (Math.random() - 0.5) * 50,
                    (parent1.y + parent2.y) / 2 + (Math.random() - 0.5) * 50
                );
                this.entities.prey.push(offspring);
            }
        }
        
        breedPredators() {
            if (this.entities.predators.length < 2) return;
            const parent1 = this.entities.predators[Math.floor(Math.random() * this.entities.predators.length)];
            const parent2 = this.entities.predators[Math.floor(Math.random() * this.entities.predators.length)];
            
            if (parent1 !== parent2) {
                const offspring = new Predator(
                    (parent1.x + parent2.x) / 2 + (Math.random() - 0.5) * 50,
                    (parent1.y + parent2.y) / 2 + (Math.random() - 0.5) * 50
                );
                this.entities.predators.push(offspring);
            }
        }
        
        render() {
            // Clear canvas with dark background
            this.ctx.fillStyle = '#1a1a2e';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Render all entities
            this.entities.plants.forEach(plant => plant.render(this.ctx));
            this.entities.prey.forEach(prey => prey.render(this.ctx));
            this.entities.predators.forEach(predator => predator.render(this.ctx));
            this.entities.bots.forEach(bot => bot.render(this.ctx));
        }
        
        updateStats() {
            const elements = {
                preyCount: this.entities.prey.length,
                predatorCount: this.entities.predators.length,
                plantCount: this.entities.plants.length,
                botCount: this.entities.bots.length,
                generation: this.generation
            };
            
            Object.entries(elements).forEach(([id, value]) => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = value;
                }
            });
        }
        
        resetArena() {
            console.log('🔄 Resetting arena...');
            
            this.entities = {
                prey: [],
                predators: [],
                plants: [],
                bots: []
            };
            
            // Add initial ecosystem
            for (let i = 0; i < 15; i++) {
                this.entities.prey.push(new Prey(
                    Math.random() * this.canvas.width,
                    Math.random() * this.canvas.height
                ));
            }
            
            for (let i = 0; i < 8; i++) {
                this.entities.predators.push(new Predator(
                    Math.random() * this.canvas.width,
                    Math.random() * this.canvas.height
                ));
            }
            
            for (let i = 0; i < 25; i++) {
                this.entities.plants.push(new Plant(
                    Math.random() * this.canvas.width,
                    Math.random() * this.canvas.height
                ));
            }
            
            this.generation = 1;
            this.updateStats();
            console.log('✅ Arena reset complete');
        }
    }
    
    // Entity Classes
    class Prey {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.size = 4 + Math.random() * 2;
            this.energy = 50 + Math.random() * 50;
            this.speed = 1.5 + Math.random() * 0.5;
        }
        
        update(allEntities, params) {
            // Find nearest predator to flee from
            let nearestPredator = null;
            let minPredDist = params.preyVisionRange;
            
            allEntities.forEach(entity => {
                if (entity.constructor.name === 'Predator' || (entity.config && entity.config.behavior === 'aggressive')) {
                    const dist = Math.sqrt((entity.x - this.x) ** 2 + (entity.y - this.y) ** 2);
                    if (dist < minPredDist) {
                        nearestPredator = entity;
                        minPredDist = dist;
                    }
                }
            });
            
            if (nearestPredator) {
                // Flee from predator
                const dx = this.x - nearestPredator.x;
                const dy = this.y - nearestPredator.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                this.vx = (dx / dist) * this.speed * 2;
                this.vy = (dy / dist) * this.speed * 2;
            } else {
                // Random movement
                this.vx += (Math.random() - 0.5) * 0.2;
                this.vy += (Math.random() - 0.5) * 0.2;
                this.vx *= 0.95;
                this.vy *= 0.95;
            }
            
            this.x += this.vx;
            this.y += this.vy;
            
            // Boundary check
            if (this.x < 0 || this.x > 800) this.vx *= -1;
            if (this.y < 0 || this.y > 600) this.vy *= -1;
            this.x = Math.max(0, Math.min(800, this.x));
            this.y = Math.max(0, Math.min(600, this.y));
            
            this.energy -= 0.1;
        }
        
        render(ctx) {
            ctx.fillStyle = `hsl(${120 + this.energy}, 70%, 50%)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    class Predator {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.size = 6 + Math.random() * 2;
            this.energy = 60 + Math.random() * 40;
            this.speed = 1.2 + Math.random() * 0.3;
        }
        
        update(allEntities, params) {
            // Find nearest prey to hunt
            let nearestPrey = null;
            let minPreyDist = params.predatorVisionRange;
            
            allEntities.forEach(entity => {
                if (entity.constructor.name === 'Prey') {
                    const dist = Math.sqrt((entity.x - this.x) ** 2 + (entity.y - this.y) ** 2);
                    if (dist < minPreyDist) {
                        nearestPrey = entity;
                        minPreyDist = dist;
                    }
                }
            });
            
            if (nearestPrey) {
                // Chase prey
                const dx = nearestPrey.x - this.x;
                const dy = nearestPrey.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                this.vx = (dx / dist) * this.speed;
                this.vy = (dy / dist) * this.speed;
            } else {
                // Random roaming
                this.vx += (Math.random() - 0.5) * 0.3;
                this.vy += (Math.random() - 0.5) * 0.3;
                this.vx *= 0.9;
                this.vy *= 0.9;
            }
            
            this.x += this.vx;
            this.y += this.vy;
            
            // Boundary check
            if (this.x < 0 || this.x > 800) this.vx *= -1;
            if (this.y < 0 || this.y > 600) this.vy *= -1;
            this.x = Math.max(0, Math.min(800, this.x));
            this.y = Math.max(0, Math.min(600, this.y));
            
            this.energy -= 0.15;
        }
        
        render(ctx) {
            ctx.fillStyle = `hsl(0, 70%, ${30 + this.energy / 2}%)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw predator "teeth"
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(this.x - 2, this.y - 1, 1, 0, Math.PI * 2);
            ctx.arc(this.x + 2, this.y - 1, 1, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    class Plant {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = 3 + Math.random() * 3;
            this.age = 0;
        }
        
        render(ctx) {
            const green = Math.floor(50 + this.age * 2);
            ctx.fillStyle = `hsl(120, 60%, ${green}%)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            this.age++;
        }
    }
    
    class Bot {
        constructor(x, y, config) {
            this.x = x;
            this.y = y;
            this.vx = 0;
            this.vy = 0;
            this.config = config;
            this.size = config.size;
            this.energy = config.energy;
            this.maxEnergy = config.energy;
            this.speed = config.speed;
        }
        
        update(allEntities, params) {
            // Simple bot AI - just move randomly for now
            this.vx += (Math.random() - 0.5) * 0.2;
            this.vy += (Math.random() - 0.5) * 0.2;
            this.vx *= 0.9;
            this.vy *= 0.9;
            
            this.x += this.vx;
            this.y += this.vy;
            
            // Boundary check
            if (this.x < 0 || this.x > 800) this.vx *= -1;
            if (this.y < 0 || this.y > 600) this.vy *= -1;
            this.x = Math.max(0, Math.min(800, this.x));
            this.y = Math.max(0, Math.min(600, this.y));
            
            this.energy -= 0.08;
        }
        
        render(ctx) {
            // Main bot body
            ctx.fillStyle = this.config.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Energy indicator (inner circle)
            const energyPercent = this.energy / this.maxEnergy;
            ctx.fillStyle = `hsl(${energyPercent * 120}, 70%, 40%)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 0.6, 0, Math.PI * 2);
            ctx.fill();
            
            // Bot type indicator
            ctx.fillStyle = '#ffffff';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.config.type[0].toUpperCase(), this.x, this.y + 3);
        }
    }
    
    // Initialize the game
    window.game = new EcosystemArena();
});

// Global functions for UI controls - these will work now because game is global
window.startSimulation = function() {
    if (window.game) {
        window.game.running = true;
        console.log('🎮 Simulation started!');
    }
};

window.pauseSimulation = function() {
    if (window.game) {
        window.game.running = false;
        console.log('⏸️ Simulation paused!');
    }
};

window.resetArena = function() {
    if (window.game) {
        window.game.resetArena();
    }
};

window.deploySelectedBots = function() {
    if (!window.game) return;
    
    if (!window.game.selectedBotType) {
        alert('Please select a bot type first!');
        return;
    }
    
    // Deploy 3 bots of selected type in random positions
    for (let i = 0; i < 3; i++) {
        const x = 100 + Math.random() * (window.game.canvas.width - 200);
        const y = 100 + Math.random() * (window.game.canvas.height - 200);
        window.game.deployBot(window.game.selectedBotType, x, y);
    }
    
    console.log(`🚀 Deployed 3 ${window.game.selectedBotType} bots!`);
};

window.addRandomBots = function() {
    if (!window.game) return;
    
    const botTypes = ['hunter', 'defender', 'scout', 'collector'];
    
    for (let i = 0; i < 5; i++) {
        const randomType = botTypes[Math.floor(Math.random() * botTypes.length)];
        const x = Math.random() * window.game.canvas.width;
        const y = Math.random() * window.game.canvas.height;
        window.game.deployBot(randomType, x, y);
    }
    
    console.log('🤖 Added 5 random bots to the arena!');
};