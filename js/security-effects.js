// Advanced Security Effects System for Cybersecurity Portfolio
// Author: IT24102137
// Current Time: 2025-06-28 17:18:32 UTC
// Last Updated: 2025-06-28 17:18:32

// Security Effects Configuration
const SECURITY_CONFIG = {
    SCAN: {
        DURATION: 3000,
        FREQUENCY: 0.1,
        INTENSITY: 0.8,
        COLORS: ['#00ff41', '#0080ff', '#ff0080']
    },
    INTRUSION: {
        ALERT_THRESHOLD: 5,
        DETECTION_WINDOW: 60000, // 1 minute
        LOCKOUT_DURATION: 300000 // 5 minutes
    },
    ENCRYPTION: {
        ALGORITHMS: ['AES-256', 'RSA-2048', 'ChaCha20', 'Blowfish'],
        KEY_LENGTH: 32,
        ROTATION_INTERVAL: 30000 // 30 seconds
    },
    MONITORING: {
        LOG_RETENTION: 86400000, // 24 hours
        THREAT_LEVELS: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        SCAN_INTERVAL: 5000 // 5 seconds
    }
};

// Advanced Security Effects Manager
class CyberSecurityEffects {
    constructor() {
        this.isInitialized = false;
        this.activeScans = new Set();
        this.threatLevel = 'LOW';
        this.encryptionKeys = new Map();
        this.intrusionAttempts = [];
        this.securityLogs = [];
        this.isLockdownActive = false;
        
        this.init();
        this.logSecuritySystem();
    }
    
    init() {
        try {
            this.setupSecurityScanning();
            this.setupIntrusionDetection();
            this.setupEncryptionSystem();
            this.setupThreatMonitoring();
            this.setupFirewallEffects();
            this.setupDataForensics();
            this.setupPenetrationTesting();
            this.initializeSecurityConsole();
            
            this.isInitialized = true;
            console.log('%c[SECURITY] Advanced security effects system initialized', 
                       'color: #00ff41; font-family: monospace; font-weight: bold;');
            
        } catch (error) {
            console.error('%c[SECURITY] Initialization failed', 
                         'color: #ff0040; font-family: monospace;', error);
        }
    }
    
    setupSecurityScanning() {
        // Network Security Scanner Effect
        this.createNetworkScanEffect();
        
        // Vulnerability Assessment Effect
        this.createVulnerabilityScanner();
        
        // Port Scanning Visualization
        this.createPortScanEffect();
        
        // Real-time threat detection
        setInterval(() => {
            this.performSecurityScan();
        }, SECURITY_CONFIG.MONITORING.SCAN_INTERVAL);
        
        console.log('%c[SCANNER] Security scanning systems active', 
                   'color: #00ff41; font-family: monospace;');
    }
    
    createNetworkScanEffect() {
        const scanLines = document.querySelectorAll('.network-scan, .cyber-scan');
        
        scanLines.forEach(element => {
            const scanLine = document.createElement('div');
            scanLine.className = 'security-scan-line';
            scanLine.style.cssText = `
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 2px;
                background: linear-gradient(
                    90deg,
                    transparent,
                    ${SECURITY_CONFIG.SCAN.COLORS[0]},
                    transparent
                );
                animation: securityScan ${SECURITY_CONFIG.SCAN.DURATION}ms linear infinite;
                pointer-events: none;
                z-index: 10;
            `;
            
            if (element.style.position !== 'absolute' && element.style.position !== 'relative') {
                element.style.position = 'relative';
            }
            
            element.appendChild(scanLine);
        });
    }
    
    createVulnerabilityScanner() {
        const vulnerabilityTargets = document.querySelectorAll('.project-card, .skill-category');
        
        vulnerabilityTargets.forEach((target, index) => {
            setTimeout(() => {
                this.scanForVulnerabilities(target);
            }, index * 1000);
        });
    }
    
    scanForVulnerabilities(element) {
        const vulnOverlay = document.createElement('div');
        vulnOverlay.className = 'vulnerability-overlay';
        vulnOverlay.innerHTML = `
            <div class="vuln-indicator">
                <i class="fas fa-shield-alt"></i>
                <span class="vuln-status">SCANNING...</span>
            </div>
        `;
        
        vulnOverlay.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background: rgba(0, 255, 65, 0.1);
            border: 1px solid var(--primary-color);
            border-radius: 4px;
            padding: 0.25rem 0.5rem;
            font-size: 0.7rem;
            color: var(--primary-color);
            z-index: 5;
            opacity: 0;
            animation: vulnScanAppear 0.5s ease-in-out forwards;
        `;
        
        element.style.position = 'relative';
        element.appendChild(vulnOverlay);
        
        // Simulate vulnerability scan
        setTimeout(() => {
            const status = vulnOverlay.querySelector('.vuln-status');
            const isSecure = Math.random() > 0.3; // 70% secure rate
            
            if (isSecure) {
                status.textContent = 'SECURE';
                vulnOverlay.style.background = 'rgba(46, 213, 115, 0.1)';
                vulnOverlay.style.borderColor = 'var(--success-color)';
                vulnOverlay.style.color = 'var(--success-color)';
            } else {
                status.textContent = 'VULNERABLE';
                vulnOverlay.style.background = 'rgba(255, 170, 0, 0.1)';
                vulnOverlay.style.borderColor = 'var(--warning-color)';
                vulnOverlay.style.color = 'var(--warning-color)';
                
                this.logSecurityEvent('VULNERABILITY_DETECTED', element);
            }
            
            // Remove after delay
            setTimeout(() => {
                vulnOverlay.style.animation = 'vulnScanDisappear 0.5s ease-in-out forwards';
                setTimeout(() => {
                    if (vulnOverlay.parentNode) {
                        vulnOverlay.parentNode.removeChild(vulnOverlay);
                    }
                }, 500);
            }, 3000);
            
        }, 2000);
    }
    
    createPortScanEffect() {
        const terminalWindows = document.querySelectorAll('.terminal-body');
        
        terminalWindows.forEach(terminal => {
            this.simulatePortScan(terminal);
        });
    }
    
    simulatePortScan(terminal) {
        const ports = [22, 23, 25, 53, 80, 110, 143, 443, 993, 995];
        const target = '192.168.1.100';
        
        const addPortScanLine = (port, status, delay) => {
            setTimeout(() => {
                const scanLine = document.createElement('div');
                scanLine.className = 'port-scan-line';
                scanLine.innerHTML = `
                    <span style="color: var(--primary-color);">nmap@cybersec:~$ </span>
                    <span style="color: var(--secondary-color);">PORT ${port}/tcp ${status} on ${target}</span>
                `;
                
                terminal.appendChild(scanLine);
                terminal.scrollTop = terminal.scrollHeight;
                
                if (status === 'OPEN') {
                    this.logSecurityEvent('OPEN_PORT_DETECTED', { port, target });
                }
            }, delay);
        };
        
        ports.forEach((port, index) => {
            const status = Math.random() > 0.7 ? 'OPEN' : 'CLOSED';
            addPortScanLine(port, status, index * 500);
        });
    }
    
    setupIntrusionDetection() {
        // Monitor for suspicious activity
        this.monitorMouseMovements();
        this.monitorKeyboardActivity();
        this.monitorNetworkRequests();
        this.monitorConsoleAccess();
        
        console.log('%c[IDS] Intrusion Detection System online', 
                   'color: #0080ff; font-family: monospace;');
    }
    
    monitorMouseMovements() {
        let rapidClicks = 0;
        let lastClickTime = 0;
        
        document.addEventListener('click', (e) => {
            const now = Date.now();
            if (now - lastClickTime < 100) {
                rapidClicks++;
                if (rapidClicks > 5) {
                    this.triggerIntrusionAlert('Rapid click detected - Possible automated activity');
                    rapidClicks = 0;
                }
            } else {
                rapidClicks = 0;
            }
            lastClickTime = now;
        });
    }
    
    monitorKeyboardActivity() {
        let keySequence = [];
        const suspiciousPatterns = ['sql', 'script', 'alert', 'eval', 'exec'];
        
        document.addEventListener('keydown', (e) => {
            keySequence.push(e.key.toLowerCase());
            if (keySequence.length > 10) {
                keySequence.shift();
            }
            
            const sequence = keySequence.join('');
            if (suspiciousPatterns.some(pattern => sequence.includes(pattern))) {
                this.triggerIntrusionAlert(`Suspicious keyboard pattern detected: ${sequence.slice(-20)}`);
                keySequence = [];
            }
            
            // Developer tools detection
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
                this.logSecurityEvent('DEVTOOLS_ACCESS', { timestamp: new Date().toISOString() });
            }
        });
    }
    
    monitorNetworkRequests() {
        // Override fetch to monitor network requests
        const originalFetch = window.fetch;
        
        window.fetch = async (...args) => {
            const url = args[0];
            this.logSecurityEvent('NETWORK_REQUEST', { url, timestamp: new Date().toISOString() });
            
            try {
                const response = await originalFetch(...args);
                this.logSecurityEvent('NETWORK_RESPONSE', { 
                    url, 
                    status: response.status,
                    timestamp: new Date().toISOString()
                });
                return response;
            } catch (error) {
                this.logSecurityEvent('NETWORK_ERROR', { url, error: error.message });
                throw error;
            }
        };
    }
    
    monitorConsoleAccess() {
        // Monitor console access attempts
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        
        console.log = (...args) => {
            this.logSecurityEvent('CONSOLE_ACCESS', { type: 'log', args });
            return originalLog.apply(console, args);
        };
        
        console.error = (...args) => {
            this.logSecurityEvent('CONSOLE_ACCESS', { type: 'error', args });
            return originalError.apply(console, args);
        };
        
        console.warn = (...args) => {
            this.logSecurityEvent('CONSOLE_ACCESS', { type: 'warn', args });
            return originalWarn.apply(console, args);
        };
    }
    
    triggerIntrusionAlert(message) {
        const alertId = this.generateAlertId();
        
        this.intrusionAttempts.push({
            id: alertId,
            message,
            timestamp: new Date().toISOString(),
            severity: 'HIGH'
        });
        
        this.showSecurityAlert('INTRUSION DETECTED', message);
        this.updateThreatLevel('HIGH');
        
        console.warn(`%c[SECURITY ALERT] ${message}`, 
                    'color: #ff0040; font-family: monospace; font-weight: bold;');
        
        // Check for lockdown threshold
        if (this.intrusionAttempts.length >= SECURITY_CONFIG.INTRUSION.ALERT_THRESHOLD) {
            this.initiateSecurityLockdown();
        }
    }
    
    setupEncryptionSystem() {
        this.generateEncryptionKeys();
        this.startKeyRotation();
        this.createEncryptionVisualizations();
        
        console.log('%c[ENCRYPTION] Advanced encryption system active', 
                   'color: #00ff41; font-family: monospace;');
    }
    
    generateEncryptionKeys() {
        SECURITY_CONFIG.ENCRYPTION.ALGORITHMS.forEach(algorithm => {
            const key = this.generateSecureKey(SECURITY_CONFIG.ENCRYPTION.KEY_LENGTH);
            this.encryptionKeys.set(algorithm, {
                key,
                generated: Date.now(),
                algorithm
            });
        });
        
        console.log('%c[ENCRYPTION] Keys generated for all algorithms', 
                   'color: #0080ff; font-family: monospace;');
    }
    
    generateSecureKey(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let key = '';
        
        for (let i = 0; i < length; i++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return key;
    }
    
    startKeyRotation() {
        setInterval(() => {
            this.rotateEncryptionKeys();
        }, SECURITY_CONFIG.ENCRYPTION.ROTATION_INTERVAL);
    }
    
    rotateEncryptionKeys() {
        this.encryptionKeys.forEach((keyData, algorithm) => {
            const newKey = this.generateSecureKey(SECURITY_CONFIG.ENCRYPTION.KEY_LENGTH);
            this.encryptionKeys.set(algorithm, {
                key: newKey,
                generated: Date.now(),
                algorithm,
                previous: keyData.key
            });
        });
        
        console.log('%c[ENCRYPTION] Keys rotated successfully', 
                   'color: #00ff41; font-family: monospace;');
        
        this.showEncryptionRotationEffect();
    }
    
    createEncryptionVisualizations() {
        const encryptionTargets = document.querySelectorAll('.secure-form, .terminal-window');
        
        encryptionTargets.forEach(target => {
            this.addEncryptionEffect(target);
        });
    }
    
    addEncryptionEffect(element) {
        const encryptionOverlay = document.createElement('div');
        encryptionOverlay.className = 'encryption-overlay';
        encryptionOverlay.innerHTML = `
            <div class="encryption-indicator">
                <i class="fas fa-lock"></i>
                <span class="encryption-text">AES-256 ENCRYPTED</span>
            </div>
        `;
        
        encryptionOverlay.style.cssText = `
            position: absolute;
            top: 0;
            right: 0;
            background: rgba(0, 255, 65, 0.1);
            border: 1px solid var(--primary-color);
            border-radius: 0 0 0 4px;
            padding: 0.25rem 0.5rem;
            font-size: 0.7rem;
            color: var(--primary-color);
            z-index: 100;
            animation: encryptionPulse 2s ease-in-out infinite;
        `;
        
        element.style.position = 'relative';
        element.appendChild(encryptionOverlay);
    }
    
    showEncryptionRotationEffect() {
        const rotationAlert = document.createElement('div');
        rotationAlert.className = 'encryption-rotation-alert';
        rotationAlert.innerHTML = `
            <div class="rotation-content">
                <i class="fas fa-sync-alt"></i>
                <span>ENCRYPTION KEYS ROTATED</span>
                <div class="rotation-timestamp">${new Date().toISOString()}</div>
            </div>
        `;
        
        rotationAlert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 255, 65, 0.1);
            border: 1px solid var(--primary-color);
            border-radius: 6px;
            padding: var(--spacing-sm);
            color: var(--primary-color);
            z-index: 10000;
            animation: slideInRight 0.5s ease-out, fadeOut 0.5s ease-out 3s forwards;
            font-family: var(--font-primary);
            font-size: 0.8rem;
        `;
        
        document.body.appendChild(rotationAlert);
        
        setTimeout(() => {
            if (rotationAlert.parentNode) {
                rotationAlert.parentNode.removeChild(rotationAlert);
            }
        }, 3500);
    }
    
    setupThreatMonitoring() {
        this.createThreatLevelIndicator();
        this.monitorSystemResources();
        this.setupRealTimeAlerts();
        
        console.log('%c[MONITOR] Threat monitoring system active', 
                   'color: #ffaa00; font-family: monospace;');
    }
    
    createThreatLevelIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'threat-level-indicator';
        indicator.innerHTML = `
            <div class="threat-content">
                <div class="threat-icon">
                    <i class="fas fa-shield-alt"></i>
                </div>
                <div class="threat-info">
                    <div class="threat-level">${this.threatLevel}</div>
                    <div class="threat-label">THREAT LEVEL</div>
                </div>
            </div>
        `;
        
        indicator.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            padding: var(--spacing-sm);
            z-index: 1000;
            font-family: var(--font-primary);
            font-size: 0.8rem;
            min-width: 120px;
            opacity: 0.9;
        `;
        
        document.body.appendChild(indicator);
        this.updateThreatLevelIndicator();
    }
    
    updateThreatLevel(level) {
        if (SECURITY_CONFIG.MONITORING.THREAT_LEVELS.includes(level)) {
            this.threatLevel = level;
            this.updateThreatLevelIndicator();
            this.logSecurityEvent('THREAT_LEVEL_CHANGED', { level, timestamp: new Date().toISOString() });
        }
    }
    
    updateThreatLevelIndicator() {
        const indicator = document.getElementById('threat-level-indicator');
        if (!indicator) return;
        
        const levelElement = indicator.querySelector('.threat-level');
        const iconElement = indicator.querySelector('.threat-icon i');
        
        levelElement.textContent = this.threatLevel;
        
        // Update colors based on threat level
        const colors = {
            'LOW': '#00ff41',
            'MEDIUM': '#ffaa00',
            'HIGH': '#ff6b35',
            'CRITICAL': '#ff0040'
        };
        
        const color = colors[this.threatLevel];
        indicator.style.borderColor = color;
        levelElement.style.color = color;
        iconElement.style.color = color;
        
        if (this.threatLevel === 'CRITICAL') {
            indicator.style.animation = 'criticalThreatPulse 1s ease-in-out infinite';
        } else {
            indicator.style.animation = 'none';
        }
    }
    
    setupFirewallEffects() {
        this.createFirewallVisualization();
        this.simulateTrafficFiltering();
        
        console.log('%c[FIREWALL] Firewall protection active', 
                   'color: #ff6b35; font-family: monospace;');
    }
    
    createFirewallVisualization() {
        const firewallContainer = document.createElement('div');
        firewallContainer.id = 'firewall-visualization';
        firewallContainer.innerHTML = `
            <div class="firewall-grid">
                ${Array.from({length: 16}, (_, i) => `<div class="firewall-cell" data-cell="${i}"></div>`).join('')}
            </div>
            <div class="firewall-status">
                <span class="status-text">FIREWALL ACTIVE</span>
                <span class="blocked-count">0 BLOCKED</span>
            </div>
        `;
        
        firewallContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--bg-secondary);
            border: 1px solid var(--primary-color);
            border-radius: 6px;
            padding: var(--spacing-sm);
            z-index: 1000;
            font-family: var(--font-primary);
            font-size: 0.7rem;
            min-width: 150px;
            opacity: 0.8;
        `;
        
        document.body.appendChild(firewallContainer);
        this.animateFirewallGrid();
    }
    
    animateFirewallGrid() {
        const cells = document.querySelectorAll('.firewall-cell');
        let blockedCount = 0;
        
        setInterval(() => {
            const randomCell = cells[Math.floor(Math.random() * cells.length)];
            const isBlocked = Math.random() > 0.8;
            
            if (isBlocked) {
                randomCell.style.background = '#ff0040';
                blockedCount++;
                
                setTimeout(() => {
                    randomCell.style.background = 'var(--primary-color)';
                }, 500);
                
                const blockedCountElement = document.querySelector('.blocked-count');
                if (blockedCountElement) {
                    blockedCountElement.textContent = `${blockedCount} BLOCKED`;
                }
            } else {
                randomCell.style.background = 'var(--success-color)';
                setTimeout(() => {
                    randomCell.style.background = 'var(--border-color)';
                }, 200);
            }
        }, 1000);
    }
    
    setupDataForensics() {
        this.createForensicsAnalysis();
        this.monitorDataIntegrity();
        
        console.log('%c[FORENSICS] Digital forensics system active', 
                   'color: #9c88ff; font-family: monospace;');
    }
    
    createForensicsAnalysis() {
        const forensicsTerminals = document.querySelectorAll('.terminal-body');
        
        forensicsTerminals.forEach(terminal => {
            setTimeout(() => {
                this.simulateForensicsAnalysis(terminal);
            }, Math.random() * 5000);
        });
    }
    
    simulateForensicsAnalysis(terminal) {
        const forensicsCommands = [
            'volatility -f memory.dmp imageinfo',
            'strings suspicious_file.exe | grep -i password',
            'dd if=/dev/sda1 of=evidence.img bs=512',
            'exiftool malware_sample.pdf',
            'hashdeep -r /evidence/ > hashes.txt',
            'foremost -i disk_image.dd -o recovered/',
            'binwalk firmware.bin'
        ];
        
        forensicsCommands.forEach((command, index) => {
            setTimeout(() => {
                const forensicsLine = document.createElement('div');
                forensicsLine.innerHTML = `
                    <span style="color: var(--warning-color);">forensics@lab:~$ </span>
                    <span style="color: var(--text-secondary);">${command}</span>
                `;
                
                terminal.appendChild(forensicsLine);
                terminal.scrollTop = terminal.scrollHeight;
                
                // Add analysis result
                setTimeout(() => {
                    const resultLine = document.createElement('div');
                    resultLine.innerHTML = `
                        <span style="color: var(--success-color); margin-left: 2rem;">Analysis complete - Evidence preserved</span>
                    `;
                    terminal.appendChild(resultLine);
                    terminal.scrollTop = terminal.scrollHeight;
                }, 1000);
                
            }, index * 2000);
        });
    }
    
    setupPenetrationTesting() {
        this.createPentestingInterface();
        this.simulateExploitAttempts();
        
        console.log('%c[PENTEST] Penetration testing framework active', 
                   'color: #ff0080; font-family: monospace;');
    }
    
    createPentestingInterface() {
        const pentestTerminals = document.querySelectorAll('.terminal-body');
        
        pentestTerminals.forEach(terminal => {
            this.addPentestingCommands(terminal);
        });
    }
    
    addPentestingCommands(terminal) {
        const pentestCommands = [
            'msfconsole -q',
            'use exploit/multi/handler',
            'set payload windows/meterpreter/reverse_tcp',
            'set lhost 192.168.1.100',
            'set lport 4444',
            'exploit -j',
            'sessions -l'
        ];
        
        pentestCommands.forEach((command, index) => {
            setTimeout(() => {
                const pentestLine = document.createElement('div');
                pentestLine.innerHTML = `
                    <span style="color: var(--error-color);">msf6 > </span>
                    <span style="color: var(--text-primary);">${command}</span>
                `;
                
                terminal.appendChild(pentestLine);
                terminal.scrollTop = terminal.scrollHeight;
                
            }, index * 1500);
        });
    }
    
    performSecurityScan() {
        const scanResults = {
            timestamp: new Date().toISOString(),
            threats_detected: Math.floor(Math.random() * 3),
            vulnerabilities: Math.floor(Math.random() * 2),
            intrusion_attempts: this.intrusionAttempts.length,
            system_integrity: Math.random() > 0.1 ? 'INTACT' : 'COMPROMISED'
        };
        
        this.logSecurityEvent('SECURITY_SCAN', scanResults);
        
        if (scanResults.threats_detected > 0) {
            this.updateThreatLevel('MEDIUM');
        }
        
        if (scanResults.system_integrity === 'COMPROMISED') {
            this.updateThreatLevel('HIGH');
            this.triggerIntrusionAlert('System integrity compromised');
        }
    }
    
    initiateSecurityLockdown() {
        if (this.isLockdownActive) return;
        
        this.isLockdownActive = true;
        this.updateThreatLevel('CRITICAL');
        
        const lockdownOverlay = document.createElement('div');
        lockdownOverlay.id = 'security-lockdown';
        lockdownOverlay.innerHTML = `
            <div class="lockdown-content">
                <div class="lockdown-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h2>SECURITY LOCKDOWN INITIATED</h2>
                <p>Multiple intrusion attempts detected</p>
                <p>System temporarily restricted</p>
                <div class="lockdown-timer">
                    <span id="lockdown-countdown">300</span> seconds remaining
                </div>
                <div class="lockdown-details">
                    <p>User: IT24102137</p>
                    <p>Time: 2025-06-28 17:18:32 UTC</p>
                    <p>Incidents: ${this.intrusionAttempts.length}</p>
                </div>
            </div>
        `;
        
        lockdownOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 0, 64, 0.1);
            backdrop-filter: blur(10px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: var(--font-primary);
            color: var(--error-color);
            text-align: center;
            animation: lockdownAlert 1s ease-in-out infinite;
        `;
        
        document.body.appendChild(lockdownOverlay);
        
        this.startLockdownCountdown();
        
        console.error('%c[CRITICAL] SECURITY LOCKDOWN INITIATED - IT24102137', 
                     'color: #ff0040; font-family: monospace; font-size: 16px; font-weight: bold;');
    }
    
    startLockdownCountdown() {
        let countdown = 300; // 5 minutes
        const countdownElement = document.getElementById('lockdown-countdown');
        
        const interval = setInterval(() => {
            countdown--;
            if (countdownElement) {
                countdownElement.textContent = countdown;
            }
            
            if (countdown <= 0) {
                clearInterval(interval);
                this.endSecurityLockdown();
            }
        }, 1000);
    }
    
    endSecurityLockdown() {
        this.isLockdownActive = false;
        this.intrusionAttempts = [];
        this.updateThreatLevel('LOW');
        
        const lockdownOverlay = document.getElementById('security-lockdown');
        if (lockdownOverlay) {
            lockdownOverlay.remove();
        }
        
        console.log('%c[SECURITY] Lockdown ended - System restored', 
                   'color: #00ff41; font-family: monospace; font-weight: bold;');
    }
    
    showSecurityAlert(title, message) {
        const alert = document.createElement('div');
        alert.className = 'security-alert';
        alert.innerHTML = `
            <div class="alert-content">
                <div class="alert-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="alert-text">
                    <div class="alert-title">${title}</div>
                    <div class="alert-message">${message}</div>
                    <div class="alert-timestamp">2025-06-28 17:18:32 UTC</div>
                </div>
                <button class="alert-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        alert.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(255, 0, 64, 0.1);
            border: 1px solid var(--error-color);
            border-radius: 6px;
            padding: var(--spacing-sm);
            z-index: 10000;
            max-width: 300px;
            font-family: var(--font-primary);
            color: var(--error-color);
            animation: alertSlideIn 0.5s ease-out, alertPulse 2s ease-in-out infinite;
        `;
        
        document.body.appendChild(alert);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.style.animation = 'alertSlideOut 0.5s ease-out forwards';
                setTimeout(() => alert.remove(), 500);
            }
        }, 10000);
    }
    
    initializeSecurityConsole() {
        // Add security console commands
        window.cybersec = {
            scan: () => this.performSecurityScan(),
            threats: () => console.table(this.securityLogs),
            lockdown: () => this.initiateSecurityLockdown(),
            status: () => ({
                threatLevel: this.threatLevel,
                intrusions: this.intrusionAttempts.length,
                isLocked: this.isLockdownActive,
                uptime: Date.now() - this.startTime
            }),
            clearLogs: () => {
                this.securityLogs = [];
                console.log('%c[SECURITY] Logs cleared', 'color: #00ff41; font-family: monospace;');
            }
        };
        
        console.log('%c[CONSOLE] Security console commands available: cybersec.scan(), cybersec.threats(), cybersec.status()', 
                   'color: #0080ff; font-family: monospace;');
    }
    
    logSecurityEvent(event, data = {}) {
        const logEntry = {
            id: this.generateAlertId(),
            event,
            data,
            timestamp: new Date().toISOString(),
            user: 'IT24102137',
            threatLevel: this.threatLevel
        };
        
        this.securityLogs.push(logEntry);
        
        // Maintain log size
        if (this.securityLogs.length > 1000) {
            this.securityLogs = this.securityLogs.slice(-500);
        }
        
        console.log(`%c[SECURITY LOG] ${event}`, 'color: #0080ff; font-family: monospace;', data);
    }
    
    generateAlertId() {
        return 'SEC_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
    
    logSecuritySystem() {
        this.startTime = Date.now();
        
        console.log('%c╔══════════════════════════════════════════════════════════════╗', 
                   'color: #ff0040; font-family: monospace;');
        console.log('%c║               SECURITY EFFECTS SYSTEM ONLINE                 ║', 
                   'color: #ff0040; font-family: monospace;');
        console.log('%c╠══════════════════════════════════════════════════════════════╣', 
                   'color: #ff0040; font-family: monospace;');
        console.log(`%c║  User: IT24102137                                             ║`, 
                   'color: #ff0040; font-family: monospace;');
        console.log(`%c║  Time: 2025-06-28 17:18:32 UTC                               ║`, 
                   'color: #ff0040; font-family: monospace;');
        console.log(`%c║  Threat Level: ${this.threatLevel.padEnd(8)}                                     ║`, 
                   'color: #ff0040; font-family: monospace;');
        console.log(`%c║  Systems Active: ALL                                          ║`, 
                   'color: #ff0040; font-family: monospace;');
        console.log(`%c║  ■ Network Scanner     ■ Intrusion Detection                 ║`, 
                   'color: #ff0040; font-family: monospace;');
        console.log(`%c║  ■ Encryption System   ■ Threat Monitoring                   ║`, 
                   'color: #ff0040; font-family: monospace;');
        console.log(`%c║  ■ Firewall Protection ■ Digital Forensics                   ║`, 
                   'color: #ff0040; font-family: monospace;');
        console.log(`%c║  ■ Penetration Testing ■ Security Console                    ║`, 
                   'color: #ff0040; font-family: monospace;');
        console.log('%c╚══════════════════════════════════════════════════════════════╝', 
                   'color: #ff0040; font-family: monospace;');
    }
}

// Initialize security effects system
let cyberSecurityEffects;

document.addEventListener('DOMContentLoaded', () => {
    cyberSecurityEffects = new CyberSecurityEffects();
    
    // Global security API
    window.cybersecSecurity = {
        effects: cyberSecurityEffects,
        scan: () => cyberSecurityEffects.performSecurityScan(),
        lockdown: () => cyberSecurityEffects.initiateSecurityLockdown(),
        threatLevel: () => cyberSecurityEffects.threatLevel,
        logs: () => cyberSecurityEffects.securityLogs
    };
    
    console.log('%c[SECURITY] Advanced security effects ready - IT24102137', 
               'color: #ff0040; font-family: monospace; font-weight: bold;');
});

// Security CSS injection
const securityCSS = `
    @keyframes securityScan {
        0% { left: -100%; opacity: 0; }
        50% { opacity: 1; }
        100% { left: 100%; opacity: 0; }
    }
    
    @keyframes vulnScanAppear {
        0% { opacity: 0; transform: scale(0.8); }
        100% { opacity: 1; transform: scale(1); }
    }
    
    @keyframes vulnScanDisappear {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.8); }
    }
    
    @keyframes encryptionPulse {
        0%, 100% { box-shadow: 0 0 5px var(--primary-color); }
        50% { box-shadow: 0 0 15px var(--primary-color); }
    }
    
    @keyframes criticalThreatPulse {
        0%, 100% { border-color: var(--error-color); background: rgba(255, 0, 64, 0.1); }
        50% { border-color: #ff4757; background: rgba(255, 71, 87, 0.2); }
    }
    
    @keyframes lockdownAlert {
        0%, 100% { background: rgba(255, 0, 64, 0.1); }
        50% { background: rgba(255, 0, 64, 0.2); }
    }
    
    @keyframes alertSlideIn {
        0% { transform: translateX(100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes alertSlideOut {
        0% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes alertPulse {
        0%, 100% { border-color: var(--error-color); }
        50% { border-color: #ff4757; }
    }
    
    @keyframes slideInRight {
        0% { transform: translateX(100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeOut {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }
    
    .firewall-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 2px;
        margin-bottom: 0.5rem;
    }
    
    .firewall-cell {
        width: 8px;
        height: 8px;
        background: var(--border-color);
        border-radius: 1px;
        transition: background 0.3s ease;
    }
    
    .lockdown-content {
        background: rgba(0, 0, 0, 0.9);
        border: 2px solid var(--error-color);
        border-radius: 8px;
        padding: 2rem;
        max-width: 400px;
    }
    
    .lockdown-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        animation: spin 2s linear infinite;
    }
    
    .lockdown-timer {
        background: rgba(255, 0, 64, 0.2);
        border: 1px solid var(--error-color);
        border-radius: 4px;
        padding: 0.5rem;
        margin: 1rem 0;
        font-size: 1.2rem;
        font-weight: bold;
    }
    
    .lockdown-details {
        font-size: 0.8rem;
        margin-top: 1rem;
        opacity: 0.8;
    }
`;

// Inject security CSS
const securityStyle = document.createElement('style');
securityStyle.textContent = securityCSS;
document.head.appendChild(securityStyle);

console.log('%c[SECURITY] Advanced security effects system loaded - 2025-06-28 17:18:32 UTC', 
           'color: #ff0040; font-family: monospace; font-weight: bold;');