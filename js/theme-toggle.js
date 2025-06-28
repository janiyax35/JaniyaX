// Theme Toggle System for Cybersecurity Portfolio
// Author: IT24102137
// Current Time: 2025-06-28 16:54:21 UTC
// Last Updated: 2025-06-28 16:54:21

// Theme configuration
const THEMES = {
    DARK: 'dark',
    LIGHT: 'light'
};

const STORAGE_KEY = 'cybersec-portfolio-theme';
const THEME_TRANSITION_DURATION = 300;

// Theme state management
class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
        this.themeSwitch = null;
        this.observers = [];
        
        this.init();
        this.logThemeSystem();
    }
    
    init() {
        this.bindElements();
        this.applyTheme(this.currentTheme, false);
        this.setupEventListeners();
        this.watchSystemTheme();
        
        console.log(`%c[THEME] System initialized - Current: ${this.currentTheme.toUpperCase()}`, 
                   'color: #00ff41; font-family: monospace;');
    }
    
    bindElements() {
        this.themeSwitch = document.getElementById('theme-switch');
        if (!this.themeSwitch) {
            console.warn('%c[THEME] Theme switch element not found', 
                        'color: #ffaa00; font-family: monospace;');
            return;
        }
        
        // Set initial switch state
        this.themeSwitch.checked = this.currentTheme === THEMES.LIGHT;
    }
    
    setupEventListeners() {
        if (!this.themeSwitch) return;
        
        // Theme switch toggle
        this.themeSwitch.addEventListener('change', (e) => {
            const newTheme = e.target.checked ? THEMES.LIGHT : THEMES.DARK;
            this.setTheme(newTheme);
            this.logThemeChange(newTheme);
        });
        
        // Keyboard accessibility
        this.themeSwitch.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.themeSwitch.click();
            }
        });
        
        // System theme change detection
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!this.hasUserPreference()) {
                    const systemTheme = e.matches ? THEMES.DARK : THEMES.LIGHT;
                    this.setTheme(systemTheme, false);
                    console.log(`%c[THEME] System theme changed to: ${systemTheme.toUpperCase()}`, 
                               'color: #0080ff; font-family: monospace;');
                }
            });
        }
    }
    
    setTheme(theme, savePreference = true) {
        if (!Object.values(THEMES).includes(theme)) {
            console.error(`%c[THEME] Invalid theme: ${theme}`, 
                         'color: #ff0040; font-family: monospace;');
            return;
        }
        
        const previousTheme = this.currentTheme;
        this.currentTheme = theme;
        
        this.applyTheme(theme, true);
        
        if (savePreference) {
            this.storeTheme(theme);
        }
        
        this.updateThemeSwitch();
        this.notifyObservers(theme, previousTheme);
        this.triggerThemeTransition();
    }
    
    applyTheme(theme, animated = false) {
        const html = document.documentElement;
        const body = document.body;
        
        // Add transition class for smooth animation
        if (animated) {
            body.classList.add('theme-transitioning');
        }
        
        // Set theme attribute
        html.setAttribute('data-theme', theme);
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);
        
        // Update matrix canvas colors
        this.updateMatrixColors(theme);
        
        // Update particle colors
        this.updateParticleColors(theme);
        
        // Security scan overlay update
        this.updateSecurityOverlay(theme);
        
        // Remove transition class after animation
        if (animated) {
            setTimeout(() => {
                body.classList.remove('theme-transitioning');
            }, THEME_TRANSITION_DURATION);
        }
        
        console.log(`%c[THEME] Applied theme: ${theme.toUpperCase()} at ${new Date().toISOString()}`, 
                   'color: #00ff41; font-family: monospace;');
    }
    
    updateThemeSwitch() {
        if (this.themeSwitch) {
            this.themeSwitch.checked = this.currentTheme === THEMES.LIGHT;
        }
    }
    
    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        const colors = {
            [THEMES.DARK]: '#0a0a0a',
            [THEMES.LIGHT]: '#f0f0f0'
        };
        
        metaThemeColor.content = colors[theme];
    }
    
    updateMatrixColors(theme) {
        const matrixCanvas = document.getElementById('matrix-canvas');
        if (!matrixCanvas) return;
        
        const colors = {
            [THEMES.DARK]: '#008f11',
            [THEMES.LIGHT]: '#006b0d'
        };
        
        // Update matrix color via CSS custom property
        document.documentElement.style.setProperty('--matrix-color', colors[theme]);
    }
    
    updateParticleColors(theme) {
        const particles = document.querySelectorAll('.particle');
        const opacity = theme === THEMES.LIGHT ? '0.7' : '1';
        
        particles.forEach(particle => {
            particle.style.opacity = opacity;
        });
    }
    
    updateSecurityOverlay(theme) {
        const overlays = document.querySelectorAll('.cyber-scan, .security-scan');
        const intensity = theme === THEMES.LIGHT ? '0.05' : '0.1';
        
        overlays.forEach(overlay => {
            overlay.style.setProperty('--scan-opacity', intensity);
        });
    }
    
    triggerThemeTransition() {
        // Animate theme-specific elements
        const glitchElements = document.querySelectorAll('.glitch');
        glitchElements.forEach(element => {
            element.style.animation = 'none';
            element.offsetHeight; // Trigger reflow
            element.style.animation = null;
        });
        
        // Pulse effect on theme change
        const themeIndicators = document.querySelectorAll('.theme-indicator, .theme-label');
        themeIndicators.forEach(indicator => {
            indicator.classList.add('theme-changed');
            setTimeout(() => {
                indicator.classList.remove('theme-changed');
            }, 500);
        });
        
        // Update terminal windows
        this.updateTerminalTheme();
    }
    
    updateTerminalTheme() {
        const terminals = document.querySelectorAll('.terminal-window');
        terminals.forEach(terminal => {
            terminal.classList.add('theme-transition');
            setTimeout(() => {
                terminal.classList.remove('theme-transition');
            }, THEME_TRANSITION_DURATION);
        });
    }
    
    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return THEMES.DARK;
        }
        return THEMES.LIGHT;
    }
    
    getStoredTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (error) {
            console.warn('%c[THEME] LocalStorage not available', 
                        'color: #ffaa00; font-family: monospace;');
            return null;
        }
    }
    
    storeTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
            console.log(`%c[THEME] Preference saved: ${theme.toUpperCase()}`, 
                       'color: #0080ff; font-family: monospace;');
        } catch (error) {
            console.warn('%c[THEME] Failed to save preference', 
                        'color: #ffaa00; font-family: monospace;');
        }
    }
    
    hasUserPreference() {
        return this.getStoredTheme() !== null;
    }
    
    watchSystemTheme() {
        // Watch for system theme changes
        if (!window.matchMedia) return;
        
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const lightModeQuery = window.matchMedia('(prefers-color-scheme: light)');
        
        const handleSystemChange = (e) => {
            if (!this.hasUserPreference()) {
                const newTheme = e.matches ? 
                    (e.media.includes('dark') ? THEMES.DARK : THEMES.LIGHT) : 
                    this.getSystemTheme();
                this.setTheme(newTheme, false);
            }
        };
        
        darkModeQuery.addEventListener('change', handleSystemChange);
        lightModeQuery.addEventListener('change', handleSystemChange);
    }
    
    // Observer pattern for theme changes
    addObserver(callback) {
        this.observers.push(callback);
    }
    
    removeObserver(callback) {
        this.observers = this.observers.filter(obs => obs !== callback);
    }
    
    notifyObservers(newTheme, previousTheme) {
        this.observers.forEach(callback => {
            try {
                callback(newTheme, previousTheme);
            } catch (error) {
                console.error('%c[THEME] Observer callback failed', 
                             'color: #ff0040; font-family: monospace;', error);
            }
        });
    }
    
    // Public API methods
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
        this.setTheme(newTheme);
    }
    
    resetToSystemTheme() {
        const systemTheme = this.getSystemTheme();
        localStorage.removeItem(STORAGE_KEY);
        this.setTheme(systemTheme, false);
        console.log(`%c[THEME] Reset to system theme: ${systemTheme.toUpperCase()}`, 
                   'color: #00ff41; font-family: monospace;');
    }
    
    // Security and logging
    logThemeSystem() {
        console.log('%c╔══════════════════════════════════════════════════════════════╗', 
                   'color: #00ff41; font-family: monospace;');
        console.log('%c║                    THEME SYSTEM INITIALIZED                  ║', 
                   'color: #00ff41; font-family: monospace;');
        console.log('%c╠══════════════════════════════════════════════════════════════╣', 
                   'color: #00ff41; font-family: monospace;');
        console.log(`%c║  User: IT24102137                                             ║`, 
                   'color: #00ff41; font-family: monospace;');
        console.log(`%c║  Time: 2025-06-28 16:54:21 UTC                               ║`, 
                   'color: #00ff41; font-family: monospace;');
        console.log(`%c║  Current Theme: ${this.currentTheme.toUpperCase().padEnd(8)}                               ║`, 
                   'color: #00ff41; font-family: monospace;');
        console.log(`%c║  System Theme: ${this.getSystemTheme().toUpperCase().padEnd(8)}                                ║`, 
                   'color: #00ff41; font-family: monospace;');
        console.log(`%c║  Has User Preference: ${this.hasUserPreference() ? 'YES' : 'NO '}                           ║`, 
                   'color: #00ff41; font-family: monospace;');
        console.log('%c╚══════════════════════════════════════════════════════════════╝', 
                   'color: #00ff41; font-family: monospace;');
    }
    
    logThemeChange(newTheme) {
        const timestamp = new Date().toISOString();
        console.log(`%c[THEME CHANGE] ${this.currentTheme.toUpperCase()} → ${newTheme.toUpperCase()} | User: IT24102137 | Time: ${timestamp}`, 
                   'color: #ff0080; font-family: monospace; font-weight: bold;');
    }
    
    // Security audit log
    auditThemeAccess() {
        const auditData = {
            user: 'IT24102137',
            timestamp: '2025-06-28 16:54:21',
            currentTheme: this.currentTheme,
            systemTheme: this.getSystemTheme(),
            hasUserPreference: this.hasUserPreference(),
            userAgent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`
        };
        
        console.log('%c[SECURITY AUDIT] Theme system access logged', 
                   'color: #0080ff; font-family: monospace;', auditData);
        
        return auditData;
    }
}

// Advanced theme features
class AdvancedThemeFeatures {
    constructor(themeManager) {
        this.themeManager = themeManager;
        this.init();
    }
    
    init() {
        this.setupKeyboardShortcuts();
        this.setupAutoThemeSchedule();
        this.setupAccessibilityFeatures();
        this.setupThemePresets();
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl + Shift + T to toggle theme
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.themeManager.toggleTheme();
                this.showThemeToast();
            }
            
            // Ctrl + Shift + R to reset to system theme
            if (e.ctrlKey && e.shiftKey && e.key === 'R') {
                e.preventDefault();
                this.themeManager.resetToSystemTheme();
                this.showThemeToast('Reset to system theme');
            }
        });
    }
    
    setupAutoThemeSchedule() {
        // Auto theme based on time of day
        const hour = new Date().getHours();
        const isNightTime = hour < 6 || hour > 18;
        
        if (!this.themeManager.hasUserPreference()) {
            const autoTheme = isNightTime ? THEMES.DARK : THEMES.LIGHT;
            if (autoTheme !== this.themeManager.getCurrentTheme()) {
                console.log(`%c[AUTO THEME] Switching to ${autoTheme.toUpperCase()} based on time of day`, 
                           'color: #ffaa00; font-family: monospace;');
                this.themeManager.setTheme(autoTheme, false);
            }
        }
    }
    
    setupAccessibilityFeatures() {
        // High contrast mode detection
        if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
            document.documentElement.setAttribute('data-high-contrast', 'true');
            console.log('%c[ACCESSIBILITY] High contrast mode detected', 
                       'color: #ffaa00; font-family: monospace;');
        }
        
        // Reduced motion detection
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.setAttribute('data-reduced-motion', 'true');
            console.log('%c[ACCESSIBILITY] Reduced motion preference detected', 
                       'color: #ffaa00; font-family: monospace;');
        }
    }
    
    setupThemePresets() {
        // Future enhancement: Custom theme presets
        this.presets = {
            hacker: {
                primary: '#00ff41',
                secondary: '#ff0080',
                background: '#000000'
            },
            corporate: {
                primary: '#0080ff',
                secondary: '#ffffff',
                background: '#1a1a1a'
            },
            sunset: {
                primary: '#ff6b35',
                secondary: '#f7931e',
                background: '#2c1810'
            }
        };
    }
    
    showThemeToast(message = null) {
        const currentTheme = this.themeManager.getCurrentTheme();
        const toastMessage = message || `Theme switched to ${currentTheme.toUpperCase()}`;
        
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'theme-toast';
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-palette"></i>
                <span>${toastMessage}</span>
            </div>
        `;
        
        // Style the toast
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-secondary);
            color: var(--text-primary);
            padding: 12px 20px;
            border: 1px solid var(--primary-color);
            border-radius: 6px;
            font-family: var(--font-primary);
            font-size: 14px;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            box-shadow: var(--glow-sm);
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        });
        
        // Remove after delay
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 2000);
    }
}

// Initialize theme system
let themeManager;
let advancedFeatures;

document.addEventListener('DOMContentLoaded', () => {
    themeManager = new ThemeManager();
    advancedFeatures = new AdvancedThemeFeatures(themeManager);
    
    // Add theme change observer for matrix canvas
    themeManager.addObserver((newTheme, previousTheme) => {
        // Update matrix animation colors
        const matrixCanvas = document.getElementById('matrix-canvas');
        if (matrixCanvas && window.matrixCtx) {
            console.log(`%c[MATRIX] Updating colors for ${newTheme.toUpperCase()} theme`, 
                       'color: #00ff41; font-family: monospace;');
        }
        
        // Trigger security audit
        themeManager.auditThemeAccess();
    });
    
    // Global theme API
    window.cybersecTheme = {
        manager: themeManager,
        features: advancedFeatures,
        toggle: () => themeManager.toggleTheme(),
        setTheme: (theme) => themeManager.setTheme(theme),
        getCurrentTheme: () => themeManager.getCurrentTheme(),
        resetToSystem: () => themeManager.resetToSystemTheme()
    };
    
    console.log('%c[THEME] Advanced theme system ready - IT24102137', 
               'color: #00ff41; font-family: monospace;');
});

// CSS for theme transitions
const themeCSS = `
    .theme-transitioning * {
        transition: background-color ${THEME_TRANSITION_DURATION}ms ease,
                   color ${THEME_TRANSITION_DURATION}ms ease,
                   border-color ${THEME_TRANSITION_DURATION}ms ease,
                   box-shadow ${THEME_TRANSITION_DURATION}ms ease !important;
    }
    
    .theme-changed {
        animation: themePulse 0.5s ease-in-out;
    }
    
    @keyframes themePulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    .terminal-window.theme-transition {
        animation: terminalFlicker 0.3s ease-in-out;
    }
    
    @keyframes terminalFlicker {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
    }
`;

// Inject theme CSS
const style = document.createElement('style');
style.textContent = themeCSS;
document.head.appendChild(style);

console.log('%c[THEME] Theme toggle system loaded - 2025-06-28 16:54:21 UTC', 
           'color: #00ff41; font-family: monospace;');