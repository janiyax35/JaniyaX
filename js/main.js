// Main JavaScript File for Cybersecurity Portfolio
// Author: IT24102137
// Last Updated: 2025-06-28 16:50:39 UTC

// Global Variables
let matrixCanvas, matrixCtx;
let particles = [];
let typingTexts = [];
let currentTime = new Date();

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('%c[SYSTEM] Portfolio initialized - IT24102137', 'color: #00ff41; font-family: monospace;');
    console.log('%c[TIME] Current UTC: 2025-06-28 16:50:39', 'color: #0080ff; font-family: monospace;');
    
    initializeMatrix();
    initializeParticles();
    initializeTypingEffects();
    initializeNavigation();
    initializeScrollEffects();
    initializeSkillBars();
    initializeAOS();
    updateRealTime();
    
    // Security console message
    displaySecurityMessage();
});

// Matrix Background Animation
function initializeMatrix() {
    matrixCanvas = document.getElementById('matrix-canvas');
    if (!matrixCanvas) return;
    
    matrixCtx = matrixCanvas.getContext('2d');
    resizeMatrix();
    
    const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?`~';
    const fontSize = 14;
    const columns = Math.floor(matrixCanvas.width / fontSize);
    const drops = Array(columns).fill(1);
    
    function drawMatrix() {
        // Semi-transparent black background for trail effect
        matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        
        // Matrix green text
        matrixCtx.fillStyle = '#008f11';
        matrixCtx.font = `${fontSize}px "Fira Code", monospace`;
        
        for (let i = 0; i < drops.length; i++) {
            const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            
            matrixCtx.fillText(text, x, y);
            
            // Reset drop to top randomly
            if (y > matrixCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    // Start matrix animation
    setInterval(drawMatrix, 35);
    
    // Resize handler
    window.addEventListener('resize', resizeMatrix);
}

function resizeMatrix() {
    if (!matrixCanvas) return;
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
}

// Particle System
function initializeParticles() {
    const particlesContainer = document.getElementById('particles-container');
    if (!particlesContainer) return;
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = `particle ${['small', 'medium', 'large'][Math.floor(Math.random() * 3)]}`;
        
        // Random starting position
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = window.innerHeight + 'px';
        
        // Random animation duration
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        
        particlesContainer.appendChild(particle);
        
        // Remove particle after animation
        particle.addEventListener('animationend', () => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
    }
    
    // Create particles continuously
    setInterval(createParticle, 300);
}

// Typing Effects
function initializeTypingEffects() {
    const typingText = document.querySelector('.typing-text');
    const typingSubtitle = document.querySelector('.typing-subtitle');
    const typingDescription = document.querySelector('.typing-description');
    
    const texts = {
        title: 'CYBERSECURITY',
        subtitle: 'UNDERGRADUATE SPECIALIST',
        description: 'whoami && echo "Ethical Hacker | Security Researcher | Code Warrior"'
    };
    
    // Type text function
    function typeText(element, text, speed = 100, callback) {
        if (!element) return;
        
        let index = 0;
        element.textContent = '';
        
        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            } else if (callback) {
                callback();
            }
        }
        
        type();
    }
    
    // Start typing sequence
    setTimeout(() => {
        typeText(typingText, texts.title, 150, () => {
            setTimeout(() => {
                typeText(typingSubtitle, texts.subtitle, 100, () => {
                    setTimeout(() => {
                        typeText(typingDescription, texts.description, 50);
                    }, 500);
                });
            }, 500);
        });
    }, 1000);
}

// Navigation
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Close mobile menu
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        updateActiveNavLink();
    });
    
    // Update active navigation link
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Scroll Effects
function initializeScrollEffects() {
    // Scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                aboutSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        
        if (hero && heroContent) {
            const rate = scrolled * -0.5;
            heroContent.style.transform = `translateY(${rate}px)`;
        }
        
        // Hide scroll indicator after scrolling
        if (scrollIndicator && scrolled > 100) {
            scrollIndicator.style.opacity = '0';
        } else if (scrollIndicator) {
            scrollIndicator.style.opacity = '1';
        }
    });
    
    // Reveal animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });
}

// Skill Progress Bars
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const level = progressBar.getAttribute('data-level');
                
                // Animate the progress bar
                setTimeout(() => {
                    progressBar.style.width = level + '%';
                    progressBar.classList.add('animate');
                }, 200);
                
                // Unobserve after animation
                skillObserver.unobserve(progressBar);
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Initialize AOS (Animate On Scroll)
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            delay: 100
        });
        
        console.log('%c[AOS] Animation library initialized', 'color: #00ff41; font-family: monospace;');
    }
}

// Real-time Updates
function updateRealTime() {
    function updateTime() {
        const now = new Date();
        const timeString = now.toUTCString();
        
        // Update any time displays
        const timeElements = document.querySelectorAll('.current-time');
        timeElements.forEach(element => {
            element.textContent = timeString;
        });
        
        // Update footer with current year
        const year = now.getFullYear();
        const yearElements = document.querySelectorAll('.current-year');
        yearElements.forEach(element => {
            element.textContent = year;
        });
    }
    
    // Update immediately and then every minute
    updateTime();
    setInterval(updateTime, 60000);
}

// Security Console Message
function displaySecurityMessage() {
    const messages = [
        '%c╔══════════════════════════════════════════════════════════════╗',
        '%c║                    CYBERSECURITY PORTFOLIO                   ║',
        '%c║                        IT24102137                           ║',
        '%c╠══════════════════════════════════════════════════════════════╣',
        '%c║  WARNING: This portfolio contains advanced security tools     ║',
        '%c║  and techniques for educational purposes only.               ║',
        '%c║                                                              ║',
        '%c║  • Network Security Scanner                                   ║',
        '%c║  • Encryption Tool Suite                                     ║',
        '%c║  • Web Application Pentester                                 ║',
        '%c║  • Digital Forensics Toolkit                                ║',
        '%c║                                                              ║',
        '%c║  All tools are developed for ethical hacking and             ║',
        '%c║  educational purposes. Use responsibly.                      ║',
        '%c╚══════════════════════════════════════════════════════════════╝'
    ];
    
    const style = 'color: #00ff41; font-family: monospace; font-size: 12px;';
    
    messages.forEach(message => {
        console.log(message, style);
    });
    
    // Additional security info
    console.log('%c[SECURITY] All communications are encrypted', 'color: #0080ff; font-family: monospace;');
    console.log('%c[STATUS] Portfolio loaded successfully', 'color: #00ff41; font-family: monospace;');
    console.log('%c[USER] Welcome, IT24102137', 'color: #ff0080; font-family: monospace;');
}

// Terminal Command Simulation
function simulateTerminalCommand(command, output) {
    const terminal = document.querySelector('.terminal-body');
    if (!terminal) return;
    
    const commandLine = document.createElement('p');
    commandLine.className = 'terminal-line';
    commandLine.innerHTML = `
        <span class="prompt">cybersec@IT24102137:~$ </span>
        <span class="command">${command}</span>
    `;
    
    const outputDiv = document.createElement('div');
    outputDiv.className = 'output';
    outputDiv.textContent = output;
    
    terminal.appendChild(commandLine);
    terminal.appendChild(outputDiv);
    
    // Scroll to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

// Project Status Updates
function updateProjectStatus() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        const status = card.querySelector('.project-status');
        if (status) {
            // Simulate project status updates
            const statusTypes = ['ACTIVE', 'COMPLETED', 'IN PROGRESS', 'PLANNED'];
            const colors = ['#00ff41', '#0080ff', '#ffaa00', '#888888'];
            
            // Add random status updates (simulation)
            setTimeout(() => {
                status.style.animation = 'pulse 0.5s ease-in-out';
            }, index * 1000);
        }
    });
}

// Cyber Effects
function addCyberEffects() {
    // Add scanning lines to cyber frames
    const cyberFrames = document.querySelectorAll('.cyber-frame');
    cyberFrames.forEach(frame => {
        if (!frame.querySelector('.scanning-lines')) {
            const scanningLines = document.createElement('div');
            scanningLines.className = 'scanning-lines';
            frame.appendChild(scanningLines);
        }
    });
    
    // Add digital noise effect
    const noiseElements = document.querySelectorAll('.digital-noise');
    noiseElements.forEach(element => {
        if (!element.querySelector('.noise-overlay')) {
            const noiseOverlay = document.createElement('div');
            noiseOverlay.className = 'noise-overlay';
            element.appendChild(noiseOverlay);
        }
    });
}

// Performance Monitoring
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`%c[PERFORMANCE] Page loaded in ${loadTime}ms`, 'color: #ffaa00; font-family: monospace;');
            
            // Monitor FPS for animations
            let lastTime = performance.now();
            let frameCount = 0;
            
            function measureFPS() {
                const now = performance.now();
                frameCount++;
                
                if (now - lastTime >= 1000) {
                    const fps = frameCount;
                    console.log(`%c[FPS] Current: ${fps}`, 'color: #0080ff; font-family: monospace;');
                    frameCount = 0;
                    lastTime = now;
                }
                
                requestAnimationFrame(measureFPS);
            }
            
            measureFPS();
        });
    }
}

// Easter Eggs
function initializeEasterEggs() {
    let konami = [];
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // UP UP DOWN DOWN LEFT RIGHT LEFT RIGHT B A
    
    document.addEventListener('keydown', (e) => {
        konami.push(e.keyCode);
        if (konami.length > konamiCode.length) {
            konami.shift();
        }
        
        if (JSON.stringify(konami) === JSON.stringify(konamiCode)) {
            activateHackerMode();
        }
        
        // Developer console access warning
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
            console.log('%c[SECURITY] Developer tools detected!', 'color: #ff0040; font-family: monospace; font-size: 16px;');
            console.log('%c[WARNING] Unauthorized access to console may violate security policies.', 'color: #ffaa00; font-family: monospace;');
        }
    });
}

function activateHackerMode() {
    console.log('%c[EASTER EGG] Hacker mode activated!', 'color: #ff0080; font-family: monospace; font-size: 16px;');
    
    // Add special effects
    document.body.classList.add('hacker-mode');
    
    // Enhanced matrix effect
    if (matrixCtx) {
        matrixCtx.fillStyle = '#ff0080';
    }
    
    // Show secret message
    const secretMessage = document.createElement('div');
    secretMessage.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: #ff0080;
            padding: 20px;
            border: 2px solid #ff0080;
            border-radius: 8px;
            font-family: 'Fira Code', monospace;
            text-align: center;
            z-index: 10000;
            box-shadow: 0 0 30px #ff0080;
        ">
            <h3>🎯 HACKER MODE ACTIVATED 🎯</h3>
            <p>Welcome to the matrix, IT24102137!</p>
            <p>You've discovered the hidden developer mode.</p>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: #ff0080; color: black; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
                CLOSE
            </button>
        </div>
    `;
    
    document.body.appendChild(secretMessage);
    
    setTimeout(() => {
        if (secretMessage.parentElement) {
            secretMessage.remove();
        }
        document.body.classList.remove('hacker-mode');
    }, 5000);
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error(`%c[ERROR] ${e.message}`, 'color: #ff0040; font-family: monospace;');
});

// Initialize all systems
function initializeAllSystems() {
    console.log('%c[INIT] Initializing all systems...', 'color: #00ff41; font-family: monospace;');
    
    // Add cyber effects
    addCyberEffects();
    
    // Initialize easter eggs
    initializeEasterEggs();
    
    // Monitor performance
    monitorPerformance();
    
    // Update project status
    setTimeout(updateProjectStatus, 2000);
    
    console.log('%c[INIT] All systems operational', 'color: #00ff41; font-family: monospace;');
}

// Call initialization
initializeAllSystems();

// Export functions for use in other files
window.portfolioFunctions = {
    simulateTerminalCommand,
    updateProjectStatus,
    addCyberEffects,
    typeText: function(element, text, speed, callback) {
        if (!element) return;
        
        let index = 0;
        element.textContent = '';
        
        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            } else if (callback) {
                callback();
            }
        }
        
        type();
    }
};

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('%c[SW] Service Worker registered', 'color: #00ff41; font-family: monospace;');
            })
            .catch(error => {
                console.log('%c[SW] Service Worker registration failed', 'color: #ff0040; font-family: monospace;');
            });
    });
}

console.log('%c[SYSTEM] Main.js loaded successfully - Ready for deployment', 'color: #00ff41; font-family: monospace;');