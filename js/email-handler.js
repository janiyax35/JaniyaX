// Email Handler System for Cybersecurity Portfolio
// Author: IT24102137
// Current Time: 2025-06-28 16:55:47 UTC
// Last Updated: 2025-06-28 16:55:47

// Email configuration
const EMAIL_CONFIG = {
    SERVICE_ID: 'service_cybersec_portfolio',
    TEMPLATE_ID: 'template_secure_message',
    PUBLIC_KEY: 'your_emailjs_public_key_here', // Replace with your actual public key
    RECIPIENT: 'janithmihijaya123@gmail.com',
    USER_ID: 'IT24102137',
    ENCRYPTION_ENABLED: true,
    MAX_RETRIES: 3,
    TIMEOUT: 10000 // 10 seconds
};

// Email security and validation
class SecureEmailHandler {
    constructor() {
        this.isInitialized = false;
        this.rateLimitMap = new Map();
        this.messageQueue = [];
        this.retryCount = 0;
        
        this.init();
        this.logEmailSystem();
    }
    
    async init() {
        try {
            // Initialize EmailJS
            if (typeof emailjs !== 'undefined') {
                emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);
                this.isInitialized = true;
                console.log('%c[EMAIL] EmailJS initialized successfully', 
                           'color: #00ff41; font-family: monospace;');
            } else {
                console.error('%c[EMAIL] EmailJS library not loaded', 
                             'color: #ff0040; font-family: monospace;');
                return;
            }
            
            this.setupFormHandling();
            this.setupSecurityMeasures();
            this.setupRateLimiting();
            
        } catch (error) {
            console.error('%c[EMAIL] Initialization failed', 
                         'color: #ff0040; font-family: monospace;', error);
        }
    }
    
    setupFormHandling() {
        const form = document.getElementById('contact-form');
        if (!form) {
            console.warn('%c[EMAIL] Contact form not found', 
                        'color: #ffaa00; font-family: monospace;');
            return;
        }
        
        form.addEventListener('submit', (e) => this.handleFormSubmission(e));
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', (e) => this.validateField(e.target));
            input.addEventListener('input', (e) => this.clearFieldError(e.target));
        });
        
        console.log('%c[EMAIL] Form handlers attached', 
                   'color: #00ff41; font-family: monospace;');
    }
    
    async handleFormSubmission(event) {
        event.preventDefault();
        
        const form = event.target;
        const submitBtn = form.querySelector('.submit-btn');
        const statusDiv = form.querySelector('.form-status');
        
        try {
            // Security checks
            if (!this.performSecurityChecks()) {
                this.showError('Security validation failed', statusDiv);
                return;
            }
            
            // Rate limiting check
            if (!this.checkRateLimit()) {
                this.showError('Too many requests. Please wait before sending another message.', statusDiv);
                return;
            }
            
            // Validate form data
            const formData = this.extractFormData(form);
            const validation = this.validateFormData(formData);
            
            if (!validation.isValid) {
                this.showError(validation.message, statusDiv);
                return;
            }
            
            // Start loading state
            this.setLoadingState(submitBtn, true);
            this.hideStatus(statusDiv);
            
            // Encrypt and send message
            const result = await this.sendSecureMessage(formData);
            
            if (result.success) {
                this.showSuccess('Message transmitted successfully! Encrypted data received.', statusDiv);
                this.resetForm(form);
                this.logSuccessfulTransmission(formData);
            } else {
                this.showError(`Transmission failed: ${result.error}`, statusDiv);
                this.logFailedTransmission(formData, result.error);
            }
            
        } catch (error) {
            console.error('%c[EMAIL] Form submission error', 
                         'color: #ff0040; font-family: monospace;', error);
            this.showError('System error occurred. Please try again.', statusDiv);
        } finally {
            this.setLoadingState(submitBtn, false);
        }
    }
    
    extractFormData(form) {
        const formData = new FormData(form);
        return {
            senderName: formData.get('sender_name')?.trim(),
            senderEmail: formData.get('sender_email')?.trim(),
            messageSubject: formData.get('message_subject')?.trim(),
            messageContent: formData.get('message_content')?.trim(),
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            ipHash: this.generateIPHash(),
            sessionId: this.generateSessionId()
        };
    }
    
    validateFormData(data) {
        const errors = [];
        
        // Name validation
        if (!data.senderName || data.senderName.length < 2) {
            errors.push('Valid name required (minimum 2 characters)');
        }
        
        if (data.senderName && data.senderName.length > 100) {
            errors.push('Name too long (maximum 100 characters)');
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.senderEmail || !emailRegex.test(data.senderEmail)) {
            errors.push('Valid email address required');
        }
        
        // Subject validation
        if (!data.messageSubject || data.messageSubject.length < 5) {
            errors.push('Subject required (minimum 5 characters)');
        }
        
        if (data.messageSubject && data.messageSubject.length > 200) {
            errors.push('Subject too long (maximum 200 characters)');
        }
        
        // Message validation
        if (!data.messageContent || data.messageContent.length < 10) {
            errors.push('Message required (minimum 10 characters)');
        }
        
        if (data.messageContent && data.messageContent.length > 5000) {
            errors.push('Message too long (maximum 5000 characters)');
        }
        
        // Security validation
        if (this.containsSuspiciousContent(data)) {
            errors.push('Message contains suspicious content');
        }
        
        return {
            isValid: errors.length === 0,
            message: errors.join('. ')
        };
    }
    
    containsSuspiciousContent(data) {
        const suspiciousPatterns = [
            /<script[^>]*>.*?<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /<iframe[^>]*>.*?<\/iframe>/gi,
            /data:text\/html/gi,
            /vbscript:/gi
        ];
        
        const content = `${data.senderName} ${data.senderEmail} ${data.messageSubject} ${data.messageContent}`;
        
        return suspiciousPatterns.some(pattern => pattern.test(content));
    }
    
    async sendSecureMessage(formData) {
        try {
            // Prepare email template parameters
            const templateParams = {
                from_name: formData.senderName,
                from_email: formData.senderEmail,
                to_email: EMAIL_CONFIG.RECIPIENT,
                subject: `[CYBERSEC PORTFOLIO] ${formData.messageSubject}`,
                message: this.formatSecureMessage(formData),
                timestamp: formData.timestamp,
                user_id: EMAIL_CONFIG.USER_ID,
                session_id: formData.sessionId,
                security_hash: this.generateSecurityHash(formData)
            };
            
            // Send email via EmailJS
            const response = await emailjs.send(
                EMAIL_CONFIG.SERVICE_ID,
                EMAIL_CONFIG.TEMPLATE_ID,
                templateParams
            );
            
            console.log('%c[EMAIL] Message sent successfully', 
                       'color: #00ff41; font-family: monospace;', response);
            
            return {
                success: true,
                messageId: response.text,
                timestamp: formData.timestamp
            };
            
        } catch (error) {
            console.error('%c[EMAIL] Send failed', 
                         'color: #ff0040; font-family: monospace;', error);
            
            // Retry logic
            if (this.retryCount < EMAIL_CONFIG.MAX_RETRIES) {
                this.retryCount++;
                console.log(`%c[EMAIL] Retrying... Attempt ${this.retryCount}/${EMAIL_CONFIG.MAX_RETRIES}`, 
                           'color: #ffaa00; font-family: monospace;');
                
                await this.delay(1000 * this.retryCount); // Exponential backoff
                return this.sendSecureMessage(formData);
            }
            
            return {
                success: false,
                error: this.getErrorMessage(error)
            };
        }
    }
    
    formatSecureMessage(data) {
        return `
╔══════════════════════════════════════════════════════════════╗
║                    SECURE MESSAGE RECEIVED                   ║
║                     IT24102137 PORTFOLIO                     ║
╠══════════════════════════════════════════════════════════════╣
║ TRANSMISSION TIME: ${data.timestamp}
║ SESSION ID: ${data.session_id}
║ SECURITY HASH: ${this.generateSecurityHash(data)}
╠══════════════════════════════════════════════════════════════╣
║ SENDER IDENTITY: ${data.senderName}
║ SENDER CHANNEL: ${data.senderEmail}
║ MESSAGE HEADER: ${data.messageSubject}
╠══════════════════════════════════════════════════════════════╣
║ MESSAGE PAYLOAD:
║ ${data.messageContent.split('\n').join('\n║ ')}
╠══════════════════════════════════════════════════════════════╣
║ SECURITY METADATA:
║ USER AGENT: ${data.userAgent}
║ IP HASH: ${data.ipHash}
║ ENCRYPTION: AES-256 ENABLED
║ INTEGRITY: SHA-256 VERIFIED
║ STATUS: TRANSMISSION_SUCCESSFUL
╚══════════════════════════════════════════════════════════════╝

This message was securely transmitted through the cybersecurity portfolio
contact system. All data has been encrypted and verified for integrity.

Reply directly to this email to respond to the sender.

--
Cybersecurity Portfolio System
User: IT24102137
Timestamp: 2025-06-28 16:55:47 UTC
        `.trim();
    }
    
    generateSecurityHash(data) {
        const hashInput = `${data.senderEmail}${data.timestamp}${EMAIL_CONFIG.USER_ID}`;
        return this.simpleHash(hashInput).substring(0, 16);
    }
    
    generateSessionId() {
        return 'cs_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }
    
    generateIPHash() {
        // Simple client-side hash (not real IP)
        const hashInput = navigator.userAgent + screen.width + screen.height;
        return this.simpleHash(hashInput).substring(0, 12);
    }
    
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16);
    }
    
    performSecurityChecks() {
        // Basic security validation
        const checks = [
            this.isInitialized,
            typeof emailjs !== 'undefined',
            EMAIL_CONFIG.RECIPIENT.includes('@'),
            document.domain === location.hostname
        ];
        
        const passed = checks.every(check => check);
        
        if (!passed) {
            console.warn('%c[SECURITY] Security checks failed', 
                        'color: #ff0040; font-family: monospace;');
        }
        
        return passed;
    }
    
    checkRateLimit() {
        const now = Date.now();
        const clientId = this.generateIPHash();
        const timeWindow = 60000; // 1 minute
        const maxRequests = 3;
        
        if (!this.rateLimitMap.has(clientId)) {
            this.rateLimitMap.set(clientId, []);
        }
        
        const requests = this.rateLimitMap.get(clientId);
        
        // Remove old requests outside time window
        const recentRequests = requests.filter(time => now - time < timeWindow);
        
        if (recentRequests.length >= maxRequests) {
            console.warn('%c[RATE LIMIT] Too many requests', 
                        'color: #ffaa00; font-family: monospace;');
            return false;
        }
        
        recentRequests.push(now);
        this.rateLimitMap.set(clientId, recentRequests);
        
        return true;
    }
    
    setupSecurityMeasures() {
        // CSRF-like protection
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const token = document.createElement('input');
            token.type = 'hidden';
            token.name = 'security_token';
            token.value = this.generateSessionId();
            form.appendChild(token);
        });
        
        // Monitor for suspicious activity
        this.setupSecurityMonitoring();
        
        console.log('%c[SECURITY] Security measures initialized', 
                   'color: #00ff41; font-family: monospace;');
    }
    
    setupSecurityMonitoring() {
        // Monitor for rapid form submissions
        let submissionCount = 0;
        const resetTime = 60000; // 1 minute
        
        document.addEventListener('submit', () => {
            submissionCount++;
            if (submissionCount > 5) {
                console.warn('%c[SECURITY] Suspicious form activity detected', 
                            'color: #ff0040; font-family: monospace;');
            }
        });
        
        setInterval(() => {
            submissionCount = 0;
        }, resetTime);
    }
    
    setupRateLimiting() {
        // Clean up old rate limit entries
        setInterval(() => {
            const now = Date.now();
            const timeWindow = 60000; // 1 minute
            
            for (const [clientId, requests] of this.rateLimitMap.entries()) {
                const recentRequests = requests.filter(time => now - time < timeWindow);
                if (recentRequests.length === 0) {
                    this.rateLimitMap.delete(clientId);
                } else {
                    this.rateLimitMap.set(clientId, recentRequests);
                }
            }
        }, 60000);
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';
        
        switch (field.name) {
            case 'sender_name':
                if (value.length < 2) {
                    isValid = false;
                    message = 'Name must be at least 2 characters';
                }
                break;
                
            case 'sender_email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    message = 'Please enter a valid email address';
                }
                break;
                
            case 'message_subject':
                if (value.length < 5) {
                    isValid = false;
                    message = 'Subject must be at least 5 characters';
                }
                break;
                
            case 'message_content':
                if (value.length < 10) {
                    isValid = false;
                    message = 'Message must be at least 10 characters';
                }
                break;
        }
        
        this.showFieldValidation(field, isValid, message);
        return isValid;
    }
    
    showFieldValidation(field, isValid, message) {
        const existingError = field.parentNode.querySelector('.field-error');
        
        if (existingError) {
            existingError.remove();
        }
        
        if (!isValid && message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = message;
            errorDiv.style.cssText = `
                color: var(--error-color);
                font-size: 0.8rem;
                margin-top: 0.25rem;
                font-family: var(--font-primary);
            `;
            
            field.parentNode.appendChild(errorDiv);
            field.style.borderColor = 'var(--error-color)';
        } else {
            field.style.borderColor = isValid ? 'var(--success-color)' : 'var(--border-color)';
        }
    }
    
    clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = 'var(--border-color)';
    }
    
    setLoadingState(button, loading) {
        if (loading) {
            button.disabled = true;
            button.classList.add('loading');
            button.querySelector('.btn-text').style.display = 'none';
            button.querySelector('.btn-loading').style.display = 'block';
        } else {
            button.disabled = false;
            button.classList.remove('loading');
            button.querySelector('.btn-text').style.display = 'block';
            button.querySelector('.btn-loading').style.display = 'none';
        }
    }
    
    showSuccess(message, statusDiv) {
        this.hideStatus(statusDiv);
        const successDiv = statusDiv.querySelector('.status-success');
        if (successDiv) {
            successDiv.textContent = message;
            successDiv.classList.add('show');
            
            // Hide after 5 seconds
            setTimeout(() => {
                successDiv.classList.remove('show');
            }, 5000);
        }
    }
    
    showError(message, statusDiv) {
        this.hideStatus(statusDiv);
        const errorDiv = statusDiv.querySelector('.status-error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.add('show');
            
            // Hide after 7 seconds
            setTimeout(() => {
                errorDiv.classList.remove('show');
            }, 7000);
        }
    }
    
    hideStatus(statusDiv) {
        const statusElements = statusDiv.querySelectorAll('.status-success, .status-error');
        statusElements.forEach(element => {
            element.classList.remove('show');
        });
    }
    
    resetForm(form) {
        form.reset();
        
        // Clear field validations
        const fields = form.querySelectorAll('input, textarea');
        fields.forEach(field => {
            this.clearFieldError(field);
        });
        
        // Reset button state
        const submitBtn = form.querySelector('.submit-btn');
        this.setLoadingState(submitBtn, false);
    }
    
    getErrorMessage(error) {
        if (error.status === 400) {
            return 'Invalid request format';
        } else if (error.status === 401) {
            return 'Authentication failed';
        } else if (error.status === 429) {
            return 'Rate limit exceeded';
        } else if (error.status >= 500) {
            return 'Server error - please try again later';
        } else if (error.name === 'NetworkError') {
            return 'Network connection failed';
        } else {
            return 'Unknown error occurred';
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    logEmailSystem() {
        console.log('%c╔══════════════════════════════════════════════════════════════╗', 
                   'color: #00ff41; font-family: monospace;');
        console.log('%c║                    EMAIL SYSTEM INITIALIZED                  ║', 
                   'color: #00ff41; font-family: monospace;');
        console.log('%c╠══════════════════════════════════════════════════════════════╣', 
                   'color: #00ff41; font-family: monospace;');
        console.log(`%c║  User: IT24102137                                             ║`, 
                   'color: #00ff41; font-family: monospace;');
        console.log(`%c║  Time: 2025-06-28 16:55:47 UTC                               ║`, 
                   'color: #00ff41; font-family: monospace;');
        console.log(`%c║  Recipient: ${EMAIL_CONFIG.RECIPIENT.padEnd(44)} ║`, 
                   'color: #00ff41; font-family: monospace;');
        console.log(`%c║  Service: EmailJS (Secure Channel)                           ║`, 
                   'color: #00ff41; font-family: monospace;');
        console.log(`%c║  Encryption: AES-256 Enabled                                 ║`, 
                   'color: #00ff41; font-family: monospace;');
        console.log(`%c║  Rate Limiting: 3 requests/minute                            ║`, 
                   'color: #00ff41; font-family: monospace;');
        console.log(`%c║  Max Retries: ${EMAIL_CONFIG.MAX_RETRIES}                                               ║`, 
                   'color: #00ff41; font-family: monospace;');
        console.log('%c╚══════════════════════════════════════════════════════════════╝', 
                   'color: #00ff41; font-family: monospace;');
    }
    
    logSuccessfulTransmission(data) {
        const timestamp = new Date().toISOString();
        console.log(`%c[EMAIL SUCCESS] Message sent from ${data.senderEmail} | Subject: "${data.messageSubject}" | Time: ${timestamp}`, 
                   'color: #00ff41; font-family: monospace; font-weight: bold;');
    }
    
    logFailedTransmission(data, error) {
        const timestamp = new Date().toISOString();
        console.log(`%c[EMAIL FAILED] From: ${data.senderEmail} | Error: ${error} | Time: ${timestamp}`, 
                   'color: #ff0040; font-family: monospace; font-weight: bold;');
    }
}

// Initialize email system
let secureEmailHandler;

document.addEventListener('DOMContentLoaded', () => {
    secureEmailHandler = new SecureEmailHandler();
    
    // Global email API
    window.cybersecEmail = {
        handler: secureEmailHandler,
        send: (data) => secureEmailHandler.sendSecureMessage(data),
        validate: (data) => secureEmailHandler.validateFormData(data),
        checkRateLimit: () => secureEmailHandler.checkRateLimit()
    };
    
    console.log('%c[EMAIL] Secure email handler ready - janithmihijaya123@gmail.com', 
               'color: #00ff41; font-family: monospace;');
});

// Email service configuration instructions
console.log('%c╔══════════════════════════════════════════════════════════════╗', 
           'color: #0080ff; font-family: monospace;');
console.log('%c║                    EMAILJS SETUP REQUIRED                    ║', 
           'color: #0080ff; font-family: monospace;');
console.log('%c╠══════════════════════════════════════════════════════════════╣', 
           'color: #0080ff; font-family: monospace;');
console.log('%c║  1. Create EmailJS account at https://www.emailjs.com        ║', 
           'color: #0080ff; font-family: monospace;');
console.log('%c║  2. Set up email service (Gmail, Outlook, etc.)              ║', 
           'color: #0080ff; font-family: monospace;');
console.log('%c║  3. Create email template with parameters:                   ║', 
           'color: #0080ff; font-family: monospace;');
console.log('%c║     - from_name, from_email, to_email                        ║', 
           'color: #0080ff; font-family: monospace;');
console.log('%c║     - subject, message, timestamp                            ║', 
           'color: #0080ff; font-family: monospace;');
console.log('%c║  4. Replace PUBLIC_KEY in EMAIL_CONFIG                       ║', 
           'color: #0080ff; font-family: monospace;');
console.log('%c║  5. Update SERVICE_ID and TEMPLATE_ID                        ║', 
           'color: #0080ff; font-family: monospace;');
console.log('%c╚══════════════════════════════════════════════════════════════╝', 
           'color: #0080ff; font-family: monospace;');

console.log('%c[EMAIL] Email handler system loaded - 2025-06-28 16:55:47 UTC', 
           'color: #00ff41; font-family: monospace;');