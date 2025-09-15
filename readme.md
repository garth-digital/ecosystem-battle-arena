# 🤖 Ecosystem Bot Arena 🌿

A dynamic ecosystem simulation where you can deploy AI bots that interact with prey, predators, and plants in a living environment!

## 🎮 How to Play

1. **Click "Start Battle"** to begin the simulation
2. **Select a Bot Type** from the left panel:
   - **Hunter Bot** (Red) - Aggressive, seeks and destroys predators
   - **Defender Bot** (Blue) - Tanky, guards the center area  
   - **Scout Bot** (Green) - Fast, explores and avoids combat
   - **Collector Bot** (Orange) - Gathers plants efficiently

3. **Deploy Bots** by clicking anywhere in the arena after selecting a type
4. **Watch the Ecosystem** evolve with prey, predators, and your bots
5. **Adjust Parameters** with the sliders to change breeding speed, mutation rate, and food growth

## 🎯 Game Elements

- **🟢 Green Dots** - Prey animals that flee from predators and eat plants
- **🔴 Red Dots** - Predators that hunt prey and roam when hungry
- **🟤 Small Dots** - Plants that grow randomly and feed the ecosystem
- **🤖 Colored Bots** - Your deployed AI units with different behaviors

## 🛠️ Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/ecosystem-bot-arena.git
cd ecosystem-bot-arena

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚀 Live Deployment

This project automatically deploys to GitHub Pages when you push to the main branch.
Your live version will be available at: `https://yourusername.github.io/ecosystem-bot-arena/`

## 🎯 Features

- **Real-time Ecosystem Simulation** with complex predator-prey dynamics
- **4 Unique Bot Types** with distinct AI behaviors and visual indicators
- **Interactive Deployment** - click to place bots strategically
- **Dynamic Parameters** - adjust ecosystem settings with sliders
- **Visual Feedback** - see bot types, energy levels, and behavior patterns
- **Responsive Design** - works on different screen sizes

## 🤖 Using AI Tools for Development

### Claude (Anthropic) - Perfect for:
- Code reviews and debugging
- Adding new bot behaviors and AI logic
- Implementing complex game features
- Performance optimization

**Example prompts:**
- *"Help me add a new 'medic bot' that heals other bots within range"*
- *"Make predators form hunting packs of 2-3 individuals"*
- *"Add particle effects when bots fight predators"*
- *"Optimize the collision detection for better performance"*

### GitHub Copilot - Great for:
- Auto-completing repetitive code patterns
- Suggesting implementation approaches
- Writing test cases and documentation

### ChatGPT/GPT-4 - Useful for:
- Brainstorming new game mechanics and features
- Explaining complex algorithms and concepts
- Writing clear documentation and tutorials

## 📝 Adding New Features

### Adding a New Bot Type
1. Update `getBotConfig()` in `src/main.js`
2. Add new behavior function (e.g., `medicBehavior()`, `swarmBehavior()`)
3. Update the bot list in `index.html`
4. Add visual indicators in the `render()` method

### Adding New Ecosystem Elements
1. Create new entity class (similar to `Prey`, `Predator`, `Plant`)
2. Add to `entities` object in `EcosystemArena`
3. Handle interactions in `handleInteractions()`
4. Add rendering logic in `render()` method

## 🎨 Customization Ideas

**New Bot Types:**
- **Medic Bot** - Heals nearby friendly bots
- **Builder Bot** - Creates defensive structures
- **Swarm Bot** - Works in coordinated groups
- **Hybrid Bot** - Combines multiple behaviors

**Environmental Features:**
- **Weather Effects** - Rain affects movement speed
- **Day/Night Cycle** - Different behaviors at different times
- **Terrain Types** - Obstacles and different movement zones
- **Resource Deposits** - Special areas with concentrated plants

**Advanced AI:**
- **Neural Networks** - Self-learning bot behaviors
- **Genetic Algorithms** - Evolving bot strategies
- **Formation Tactics** - Coordinated group movements
- **Adaptive Strategies** - Bots that learn from environment

**Multiplayer Features:**
- **Real-time Battles** - Play against friends
- **Tournament Mode** - Elimination brackets
- **Spectator Mode** - Watch others play
- **Team Battles** - Coordinate with allies

## 🐛 Common Issues & Solutions

**🔧 Bots not moving?**
- Check that the simulation is started (click "Start Battle")
- Make sure you've selected a bot type before clicking

**🔧 Canvas appears blank?**
- Refresh the page (F5)
- Check browser console for errors (F12)
- Ensure JavaScript is enabled

**🔧 Deployment not working?**
- Verify GitHub Pages is enabled in repository settings
- Check that the workflow file is in `.github/workflows/`
- Ensure main branch has the latest code

**🔧 Performance issues?**
- Try reducing the number of entities
- Lower the breeding speed slider
- Close other browser tabs

## 🎯 Game Strategy Tips

- **Hunter Bots** are great for controlling predator populations
- **Defender Bots** create safe zones in the center
- **Scout Bots** can outrun most threats and explore safely  
- **Collector Bots** help maintain the plant population
- **Balance** different bot types for optimal ecosystem control
- **Watch the stats** to see how your interventions affect the ecosystem

## 📜 License

MIT License - Feel free to modify, share, and use this project however you'd like!

## 🌟 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Built with **Vite** for fast development and building
- Deployed with **GitHub Pages** for free hosting
- AI-assisted development with **Claude** for rapid iteration

---

**Have fun building your bot army and controlling the ecosystem! 🤖⚔️🌿**

*Made with ❤️ and AI assistance*