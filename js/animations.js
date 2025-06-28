// Advanced Animation System for Cybersecurity Portfolio
// Author: IT24102137
// Current Time: 2025-06-28 17:02:33 UTC
// Last Updated: 2025-06-28 17:02:33

// Animation configuration
const ANIMATION_CONFIG = {
    MATRIX: {
        CHARS: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?`~',
        SPECIAL_CHARS: '01100101 01110100 01101000 01101001 01100011 01100001 01101100',
        FONT_SIZE: 14,
        SPEED: 35,
        DENSITY: 0.975
    },
    PARTICLES: {
        COUNT: 50,
        SPEED: { MIN: 0.5, MAX: 2 },
        SIZE: { MIN: 1, MAX: 4 },
        SPAWN_RATE: 300
    },
    GLITCH: {
        INTENSITY: 2,
        FREQUENCY: 0.1,
        DURATION: 300
    },
    TYPING: {
        SPEED: { FAST: 50, NORMAL: 100, SLOW: 150 },
        CURSOR_BLINK: 1000
    }
};

// Advanced Animation Manager
class CyberAnimationSystem {
    constructor() {
        this.isInitialized = false;
        this.animations = new Map();
        this.particles = [];
        this.glitchElements = new Set();
        this.typingQueue = [];
        this.performanceMode = this.detectPerformanceMode();
        
        this.init();
        this.logAnimationSystem();
    }
    
    init() {
        try {
            this.setupMatrixAnimation();
            this.setupParticleSystem();
            this.setupGlitchEffects();
            this.setupTypingAnimations();
            this.setupScrollAnimations();
            this.setupCyberEffects();
            this.setupPerformanceMonitoring();
            
            this.isInitialized = true;
            console.log('%c[ANIMATION] Advanced animation system initialized', 
                       'color: #00ff41; font-family: monospace;');
            
        } catch (error) {
            console.error('%c[ANIMATION] Initialization failed', 
                         'color: #ff0040; font-family: monospace;', error);
        }
    }
    
    detectPerformanceMode() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const isLowEnd = connection && connection.effectiveType && 
                        ['slow-2g', '2g', '3g'].includes(connection.effectiveType);
        
        const deviceMemory = navigator.deviceMemory || 4;
        const isLowMemory = deviceMemory < 4;
        
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        return {
            isLowEnd: isLowEnd || isLowMemory,
            isMobile,
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        };
    }
    
    setupMatrixAnimation() {
        const canvas = document.getElementById('matrix-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        this.resizeCanvas(canvas);
        
        const columns = Math.floor(canvas.width / ANIMATION_CONFIG.MATRIX.FONT_SIZE);
        const drops = Array(columns).fill(1);
        
        // Enhanced matrix with binary sequences
        const matrixChars = ANIMATION_CONFIG.MATRIX.CHARS;
        const binarySequences = ANIMATION_CONFIG.MATRIX.SPECIAL_CHARS.split(' ');
        
        const drawMatrix = () => {
            // Semi-transparent background for trail effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Get current theme
            const theme = document.documentElement.getAttribute('data-theme') || 'dark';
            const matrixColor = theme === 'light' ? '#006b0d' : '#008f11';
            
            ctx.fillStyle = matrixColor;
            ctx.font = `${ANIMATION_CONFIG.MATRIX.FONT_SIZE}px "Fira Code", monospace`;
            
            for (let i = 0; i < drops.length; i++) {
                let text;
                
                // Occasionally use binary sequences for cyber effect
                if (Math.random() > 0.95) {
                    text = binarySequences[Math.floor(Math.random() * binarySequences.length)];
                    ctx.fillStyle = '#00ff41'; // Highlight binary
                } else {
                    text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
                    ctx.fillStyle = matrixColor;
                }
                
                const x = i * ANIMATION_CONFIG.MATRIX.FONT_SIZE;
                const y = drops[i] * ANIMATION_CONFIG.MATRIX.FONT_SIZE;
                
                // Add glow effect for special characters
                if (text.includes('01') || text === '@' || text === '#') {
                    ctx.shadowColor = '#00ff41';
                    ctx.shadowBlur = 10;
                } else {
                    ctx.shadowBlur = 0;
                }
                
                ctx.fillText(text, x, y);
                
                // Reset drop to top randomly
                if (y > canvas.height && Math.random() > ANIMATION_CONFIG.MATRIX.DENSITY) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };
        
        // Store animation for performance monitoring
        const matrixInterval = setInterval(drawMatrix, ANIMATION_CONFIG.MATRIX.SPEED);
        this.animations.set('matrix', { interval: matrixInterval, fps: 1000 / ANIMATION_CONFIG.MATRIX.SPEED });
        
        // Resize handler
        window.addEventListener('resize', () => this.resizeCanvas(canvas));
        
        console.log('%c[MATRIX] Matrix animation initialized with binary sequences', 
                   'color: #00ff41; font-family: monospace;');
    }
    
    resizeCanvas(canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    setupParticleSystem() {
        const container = document.getElementById('particles-container');
        if (!container) return;
        
        const particleTypes = ['cyber', 'code', 'security'];
        let particleCount = 0;
        
        const createParticle = () => {
            if (particleCount > ANIMATION_CONFIG.PARTICLES.COUNT && !this.performanceMode.isLowEnd) {
                return;
            }
            
            const particle = document.createElement('div');
            const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
            
            particle.className = `particle particle-${type}`;
            
            // Random properties
            const size = Math.random() * (ANIMATION_CONFIG.PARTICLES.SIZE.MAX - ANIMATION_CONFIG.PARTICLES.SIZE.MIN) + ANIMATION_CONFIG.PARTICLES.SIZE.MIN;
            const speed = Math.random() * (ANIMATION_CONFIG.PARTICLES.SPEED.MAX - ANIMATION_CONFIG.PARTICLES.SPEED.MIN) + ANIMATION_CONFIG.PARTICLES.SPEED.MIN;
            
            particle.style.cssText = `
                position: absolute;
                left: ${Math.random() * window.innerWidth}px;
                top: ${window.innerHeight + 10}px;
                width: ${size}px;
                height: ${size}px;
                background: var(--primary-color);
                border-radius: 50%;
                pointer-events: none;
                opacity: ${Math.random() * 0.8 + 0.2};
                animation: particleFloat ${4 / speed}s linear infinite;
            `;
            
            // Special effects for different types
            switch (type) {
                case 'cyber':
                    particle.style.boxShadow = '0 0 10px var(--primary-color)';
                    break;
                case 'code':
                    particle.style.background = 'var(--secondary-color)';
                    particle.style.borderRadius = '0';
                    break;
                case 'security':
                    particle.style.background = 'var(--accent-color)';
                    particle.style.animation += ', securityPulse 2s ease-in-out infinite';
                    break;
            }
            
            container.appendChild(particle);
            particleCount++;
            
            // Remove particle after animation
            particle.addEventListener('animationend', () => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                    particleCount--;
                }
            });
        };
        
        // Create particles continuously
        const particleInterval = setInterval(createParticle, ANIMATION_CONFIG.PARTICLES.SPAWN_RATE);
        this.animations.set('particles', { interval: particleInterval });
        
        console.log('%c[PARTICLES] Advanced particle system initialized', 
                   'color: #00ff41; font-family: monospace;');
    }
    
    setupGlitchEffects() {
        const glitchElements = document.querySelectorAll('.glitch');
        
        glitchElements.forEach(element => {
            this.glitchElements.add(element);
            this.enhanceGlitchElement(element);
        });
        
        // Random glitch triggers
        setInterval(() => {
            if (Math.random() < ANIMATION_CONFIG.GLITCH.FREQUENCY) {
                this.triggerRandomGlitch();
            }
        }, 2000);
        
        console.log(`%c[GLITCH] Enhanced glitch effects for ${glitchElements.length} elements`, 
                   'color: #00ff41; font-family: monospace;');
    }
    
    enhanceGlitchElement(element) {
        // Add data attributes for advanced glitch effects
        element.setAttribute('data-glitch-text', element.textContent);
        
        // Create additional glitch layers
        const glitchLayer1 = document.createElement('span');
        const glitchLayer2 = document.createElement('span');
        
        glitchLayer1.className = 'glitch-layer glitch-layer-1';
        glitchLayer2.className = 'glitch-layer glitch-layer-2';
        
        glitchLayer1.textContent = element.textContent;
        glitchLayer2.textContent = element.textContent;
        
        element.appendChild(glitchLayer1);
        element.appendChild(glitchLayer2);
        
        // Add hover glitch effect
        element.addEventListener('mouseenter', () => {
            this.triggerGlitch(element);
        });
    }
    
    triggerGlitch(element) {
        const originalText = element.getAttribute('data-glitch-text');
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?`~';
        
        // Create glitched text
        let glitchedText = '';
        for (let i = 0; i < originalText.length; i++) {
            if (Math.random() < 0.1) {
                glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
            } else {
                glitchedText += originalText[i];
            }
        }
        
        // Apply glitch effect
        element.style.animation = 'none';
        element.textContent = glitchedText;
        
        setTimeout(() => {
            element.textContent = originalText;
            element.style.animation = '';
        }, ANIMATION_CONFIG.GLITCH.DURATION);
    }
    
    triggerRandomGlitch() {
        if (this.glitchElements.size === 0) return;
        
        const elements = Array.from(this.glitchElements);
        const randomElement = elements[Math.floor(Math.random() * elements.length)];
        
        this.triggerGlitch(randomElement);
    }
    
    setupTypingAnimations() {
        const typingElements = document.querySelectorAll('[data-typing]');
        
        typingElements.forEach((element, index) => {
            const text = element.getAttribute('data-typing');
            const speed = element.getAttribute('data-speed') || 'normal';
            const delay = parseInt(element.getAttribute('data-delay')) || index * 500;
            
            setTimeout(() => {
                this.typeText(element, text, ANIMATION_CONFIG.TYPING.SPEED[speed.toUpperCase()]);
            }, delay);
        });
        
        // Enhanced typing for specific elements
        this.setupHeroTyping();
        this.setupTerminalTyping();
        
        console.log(`%c[TYPING] Advanced typing animations for ${typingElements.length} elements`, 
                   'color: #00ff41; font-family: monospace;');
    }
    
    setupHeroTyping() {
        const heroTitle = document.querySelector('.typing-text');
        const heroSubtitle = document.querySelector('.typing-subtitle');
        const heroDescription = document.querySelector('.typing-description');
        
        if (!heroTitle) return;
        
        const sequences = [
            { element: heroTitle, text: 'CYBERSECURITY', speed: 150 },
            { element: heroSubtitle, text: 'UNDERGRADUATE SPECIALIST', speed: 100 },
            { element: heroDescription, text: 'whoami && echo "Ethical Hacker | Security Researcher | Code Warrior"', speed: 50 }
        ];
        
        this.executeTypingSequence(sequences, 1000);
    }
    
    setupTerminalTyping() {
        const terminals = document.querySelectorAll('.terminal-body');
        
        terminals.forEach(terminal => {
            this.simulateTerminalSession(terminal);
        });
    }
    
    simulateTerminalSession(terminal) {
        const commands = [
            { command: 'nmap -sS -O target_host', delay: 2000 },
            { command: 'john --wordlist=rockyou.txt hash.txt', delay: 3000 },
            { command: 'sqlmap -u "http://target.com/page?id=1" --dbs', delay: 4000 },
            { command: 'msfconsole -q -x "use exploit/multi/handler"', delay: 5000 }
        ];
        
        commands.forEach((cmd, index) => {
            setTimeout(() => {
                this.addTerminalCommand(terminal, cmd.command);
            }, cmd.delay + index * 1000);
        });
    }
    
    addTerminalCommand(terminal, command) {
        const commandLine = document.createElement('div');
        commandLine.innerHTML = `
            <span style="color: var(--primary-color);">root@cybersec:~# </span>
            <span style="color: var(--secondary-color);">${command}</span>
        `;
        
        terminal.appendChild(commandLine);
        terminal.scrollTop = terminal.scrollHeight;
    }
    
    executeTypingSequence(sequences, initialDelay = 0) {
        let currentDelay = initialDelay;
        
        sequences.forEach((seq, index) => {
            setTimeout(() => {
                this.typeText(seq.element, seq.text, seq.speed, () => {
                    if (index === sequences.length - 1) {
                        this.addBlinkingCursor(seq.element);
                    }
                });
            }, currentDelay);
            
            currentDelay += seq.text.length * seq.speed + 500;
        });
    }
    
    typeText(element, text, speed = 100, callback = null) {
        if (!element) return;
        
        let index = 0;
        element.textContent = '';
        
        const typeChar = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                
                // Add random typing variations
                const variation = Math.random() * 50;
                setTimeout(typeChar, speed + variation);
            } else if (callback) {
                callback();
            }
        };
        
        typeChar();
    }
    
    addBlinkingCursor(element) {
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        cursor.textContent = '_';
        cursor.style.animation = `blink ${ANIMATION_CONFIG.TYPING.CURSOR_BLINK}ms infinite`;
        
        element.appendChild(cursor);
    }
    
    setupScrollAnimations() {
        // Enhanced scroll-triggered animations
        const observerOptions = {
            threshold: [0.1, 0.3, 0.7],
            rootMargin: '0px 0px -50px 0px'
        };
        
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerScrollAnimation(entry.target, entry.intersectionRatio);
                }
            });
        }, observerOptions);
        
        // Observe skill progress bars
        document.querySelectorAll('.skill-progress').forEach(bar => {
            scrollObserver.observe(bar);
        });
        
        // Observe timeline items
        document.querySelectorAll('.timeline-item').forEach(item => {
            scrollObserver.observe(item);
        });
        
        // Observe project cards
        document.querySelectorAll('.project-card').forEach(card => {
            scrollObserver.observe(card);
        });
        
        console.log('%c[SCROLL] Advanced scroll animations initialized', 
                   'color: #00ff41; font-family: monospace;');
    }
    
    triggerScrollAnimation(element, ratio) {
        if (element.classList.contains('skill-progress')) {
            this.animateSkillProgress(element, ratio);
        } else if (element.classList.contains('timeline-item')) {
            this.animateTimelineItem(element);
        } else if (element.classList.contains('project-card')) {
            this.animateProjectCard(element);
        }
    }
    
    animateSkillProgress(progressBar, ratio) {
        const level = parseInt(progressBar.getAttribute('data-level'));
        const animatedWidth = Math.min(level * ratio, level);
        
        progressBar.style.width = `${animatedWidth}%`;
        
        // Add particles effect for high skill levels
        if (level > 80 && ratio > 0.7) {
            this.addSkillParticles(progressBar);
        }
    }
    
    addSkillParticles(skillBar) {
        const rect = skillBar.getBoundingClientRect();
        
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${rect.right}px;
                top: ${rect.top + rect.height / 2}px;
                width: 3px;
                height: 3px;
                background: var(--primary-color);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                animation: skillParticleFloat 1s ease-out forwards;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    }
    
    animateTimelineItem(item) {
        item.style.animation = 'timelineSlideIn 0.8s ease-out forwards';
        
        // Add scanning effect
        const scanner = document.createElement('div');
        scanner.className = 'timeline-scanner';
        scanner.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
            animation: timelineScan 2s ease-in-out;
        `;
        
        item.appendChild(scanner);
        
        setTimeout(() => {
            if (scanner.parentNode) {
                scanner.parentNode.removeChild(scanner);
            }
        }, 2000);
    }
    
    animateProjectCard(card) {
        card.style.animation = 'projectCardReveal 0.6s ease-out forwards';
        
        // Add cyber frame effect
        this.addCyberFrame(card);
    }
    
    addCyberFrame(element) {
        const frame = document.createElement('div');
        frame.className = 'cyber-frame-overlay';
        frame.style.cssText = `
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            border: 1px solid var(--primary-color);
            border-radius: 8px;
            opacity: 0;
            animation: cyberFrameAppear 0.5s ease-out 0.3s forwards;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.appendChild(frame);
    }
    
    setupCyberEffects() {
        // Security scan lines
        this.createSecurityScanEffect();
        
        // Data stream effects
        this.createDataStreamEffect();
        
        // Hologram overlays
        this.createHologramEffect();
        
        console.log('%c[CYBER] Advanced cyber effects initialized', 
                   'color: #00ff41; font-family: monospace;');
    }
    
    createSecurityScanEffect() {
        const scanLines = document.querySelectorAll('.scanning-lines');
        
        scanLines.forEach(line => {
            line.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 2px;
                background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
                animation: securityScan 3s linear infinite;
            `;
        });
    }
    
    createDataStreamEffect() {
        const containers = document.querySelectorAll('.data-stream');
        
        containers.forEach(container => {
            setInterval(() => {
                this.addDataPacket(container);
            }, 2000);
        });
    }
    
    addDataPacket(container) {
        const packet = document.createElement('div');
        packet.className = 'data-packet';
        packet.textContent = Math.random().toString(16).substr(2, 8);
        packet.style.cssText = `
            position: absolute;
            color: var(--primary-color);
            font-family: var(--font-primary);
            font-size: 0.8rem;
            left: -100px;
            top: 50%;
            animation: dataPacketFlow 3s linear forwards;
        `;
        
        container.appendChild(packet);
        
        setTimeout(() => {
            if (packet.parentNode) {
                packet.parentNode.removeChild(packet);
            }
        }, 3000);
    }
    
    createHologramEffect() {
        const holograms = document.querySelectorAll('.hologram');
        
        holograms.forEach(hologram => {
            hologram.style.animation = 'hologramFlicker 4s ease-in-out infinite';
        });
    }
    
    setupPerformanceMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const measureFPS = () => {
            frameCount++;
            const now = performance.now();
            
            if (now - lastTime >= 1000) {
                const fps = frameCount;
                
                // Adjust animation quality based on FPS
                if (fps < 30 && !this.performanceMode.isLowEnd) {
                    this.enablePerformanceMode();
                } else if (fps > 50 && this.performanceMode.isLowEnd) {
                    this.disablePerformanceMode();
                }
                
                frameCount = 0;
                lastTime = now;
                
                console.log(`%c[PERFORMANCE] FPS: ${fps} | Mode: ${this.performanceMode.isLowEnd ? 'Low' : 'High'}`, 
                           'color: #0080ff; font-family: monospace;');
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        measureFPS();
    }
    
    enablePerformanceMode() {
        this.performanceMode.isLowEnd = true;
        
        // Reduce particle count
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            if (index % 2 === 0) {
                particle.remove();
            }
        });
        
        // Reduce matrix density
        ANIMATION_CONFIG.MATRIX.SPEED = 50;
        
        console.log('%c[PERFORMANCE] Performance mode enabled', 
                   'color: #ffaa00; font-family: monospace;');
    }
    
    disablePerformanceMode() {
        this.performanceMode.isLowEnd = false;
        ANIMATION_CONFIG.MATRIX.SPEED = 35;
        
        console.log('%c[PERFORMANCE] Performance mode disabled', 
                   'color: #00ff41; font-family: monospace;');
    }
    
    // Public API methods
    pauseAnimations() {
        this.animations.forEach(({ interval }) => {
            clearInterval(interval);
        });
        console.log('%c[ANIMATION] All animations paused', 
                   'color: #ffaa00; font-family: monospace;');
    }
    
    resumeAnimations() {
        this.init(); // Reinitialize animations
        console.log('%c[ANIMATION] All animations resumed', 
                   'color: #00ff41; font-family: monospace;');
    }
    
    triggerSystemGlitch() {
        document.querySelectorAll('.glitch').forEach(element => {
            this.triggerGlitch(element);
        });
        
        // Add screen glitch effect
        document.body.style.animation = 'screenGlitch 0.5s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
        
        console.log('%c[GLITCH] System-wide glitch effect triggered', 
                   'color: #ff0080; font-family: monospace;');
    }
    
    logAnimationSystem() {
        console.log('%c╔══════════════════════════════════════════════════════════════╗', 
                   'color: #00ff41; font-family: monospace;');
        console.log('%c║                 ANIMATION SYSTEM INITIALIZED                 ║', 
                   'color: #00ff41; font-family: monospace;');
        console.log('%c╠══════════════════════════════════════════════════════════════╣', 
                   'color: #00ff41; font-family: monospace;');
        console.log(`%c║  User: IT24102137                                             ║`, 
                   'color: #00ff41; font-family: monospace;');
        console.log(`%c║  Time: 2025-06-28 17:02:33 UTC                               ║`, 
                   'color: #00ff41; font-family: monospace;');
        console.log(`%c║  Performance Mode: ${this.performanceMode.isLowEnd ? 'LOW END' : 'HIGH END'.padEnd(8)}                        ║`, 
                   'color: #00ff41; font-family: monospace;');
        console.log(`%c║  Mobile Device: ${this.performanceMode.isMobile ? 'YES' : 'NO '}                                   ║`, 
                   'color: #00ff41; font-family: monospace;');
        console.log(`%c║  Reduced Motion: ${this.performanceMode.reducedMotion ? 'YES' : 'NO '}                                  ║`, 
                   'color: #00ff41; font-family: monospace;');
        console.log(`%c║  Matrix FPS: ${(1000 / ANIMATION_CONFIG.MATRIX.SPEED).toFixed(1)}                                      ║`, 
                   'color: #00ff41; font-family: monospace;');
        console.log(`%c║  Particle Count: ${ANIMATION_CONFIG.PARTICLES.COUNT}                                   ║`, 
                   'color: #00ff41; font-family: monospace;');
        console.log('%c╚══════════════════════════════════════════════════════════════╝', 
                   'color: #00ff41; font-family: monospace;');
    }
}

// Initialize animation system
let cyberAnimationSystem;

document.addEventListener('DOMContentLoaded', () => {
    cyberAnimationSystem = new CyberAnimationSystem();
    
    // Global animation API
    window.cybersecAnimations = {
        system: cyberAnimationSystem,
        pause: () => cyberAnimationSystem.pauseAnimations(),
        resume: () => cyberAnimationSystem.resumeAnimations(),
        glitch: () => cyberAnimationSystem.triggerSystemGlitch(),
        typeText: (element, text, speed) => cyberAnimationSystem.typeText(element, text, speed)
    };
    
    console.log('%c[ANIMATIONS] Advanced animation system ready - IT24102137', 
               'color: #00ff41; font-family: monospace;');
});

// Animation CSS injection
const animationCSS = `
    @keyframes particleFloat {
        0% { transform: translateY(0) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }
    
    @keyframes securityPulse {
        0%, 100% { box-shadow: 0 0 5px var(--accent-color); }
        50% { box-shadow: 0 0 20px var(--accent-color); }
    }
    
    @keyframes securityScan {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
    
    @keyframes dataPacketFlow {
        0% { transform: translateX(0); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateX(200px); opacity: 0; }
    }
    
    @keyframes hologramFlicker {
        0%, 100% { opacity: 0.8; filter: brightness(1); }
        50% { opacity: 1; filter: brightness(1.2); }
        75% { opacity: 0.9; filter: brightness(0.9); }
    }
    
    @keyframes timelineSlideIn {
        0% { transform: translateX(-50px); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes timelineScan {
        0% { transform: translateX(-100%); opacity: 0; }
        50% { opacity: 1; }
        100% { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes projectCardReveal {
        0% { transform: scale(0.9) rotateY(10deg); opacity: 0; }
        100% { transform: scale(1) rotateY(0deg); opacity: 1; }
    }
    
    @keyframes cyberFrameAppear {
        0% { opacity: 0; transform: scale(1.1); }
        100% { opacity: 1; transform: scale(1); }
    }
    
    @keyframes skillParticleFloat {
        0% { transform: translate(0, 0) scale(1); opacity: 1; }
        100% { transform: translate(20px, -20px) scale(0); opacity: 0; }
    }
    
    @keyframes screenGlitch {
        0%, 100% { transform: translate(0); filter: hue-rotate(0deg); }
        20% { transform: translate(-2px, 2px); filter: hue-rotate(90deg); }
        40% { transform: translate(-2px, -2px); filter: hue-rotate(180deg); }
        60% { transform: translate(2px, 2px); filter: hue-rotate(270deg); }
        80% { transform: translate(2px, -2px); filter: hue-rotate(360deg); }
    }
`;

// Inject animation CSS
const animationStyle = document.createElement('style');
animationStyle.textContent = animationCSS;
document.head.appendChild(animationStyle);

console.log('%c[ANIMATIONS] Advanced animation system loaded - 2025-06-28 17:02:33 UTC', 
           'color: #00ff41; font-family: monospace;');