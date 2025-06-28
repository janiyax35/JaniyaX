// Service Worker for Cybersecurity Portfolio PWA
// Author: IT24102137
// Current Time: 2025-06-28 17:26:00 UTC
// Last Updated: 2025-06-28 17:26:00

const CACHE_NAME = 'cybersec-portfolio-v1.2.3';
const CACHE_VERSION = '1.2.3';
const CURRENT_USER = 'IT24102137';
const SW_VERSION = '2025-06-28 17:26:00';

// Cache Strategy Configuration
const CACHE_CONFIG = {
    STATIC_CACHE_DURATION: 86400000, // 24 hours
    DYNAMIC_CACHE_DURATION: 3600000, // 1 hour
    MAX_CACHE_SIZE: 50, // Maximum cached items
    OFFLINE_FALLBACK_ENABLED: true,
    BACKGROUND_SYNC_ENABLED: true
};

// Files to cache immediately (App Shell)
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/css/animations.css',
    '/css/skills.css',
    '/css/responsive.css',
    '/css/components.css',
    '/js/main.js',
    '/js/theme-toggle.js',
    '/js/email-handler.js',
    '/js/animations.js',
    '/js/security-effects.js',
    '/manifest.json'
];

// Dynamic cache patterns
const DYNAMIC_CACHE_PATTERNS = [
    /\.(?:js|css|html)$/,
    /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
    /\.(?:woff|woff2|ttf|eot)$/,
    /api\//,
    /cdn\./
];

// Network-first patterns (always try network first)
const NETWORK_FIRST_PATTERNS = [
    /api\/live/,
    /\.json$/,
    /analytics/,
    /tracking/
];

// Offline fallback resources
const OFFLINE_FALLBACKS = {
    page: '/offline.html',
    image: '/assets/offline-image.svg',
    font: '/assets/fonts/fallback.woff2'
};

// Security and monitoring
let securityLogs = [];
let performanceMetrics = {
    cacheHits: 0,
    cacheMisses: 0,
    networkRequests: 0,
    offlineRequests: 0,
    errors: 0
};

// Install Event - Cache static assets
self.addEventListener('install', (event) => {
    console.log(`[SW] Installing service worker v${CACHE_VERSION} for ${CURRENT_USER}`);
    console.log(`[SW] Timestamp: ${SW_VERSION}`);
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching app shell and static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('[SW] Static assets cached successfully');
                logSecurityEvent('SW_INSTALL', { version: CACHE_VERSION, timestamp: SW_VERSION });
                
                // Force activation
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[SW] Failed to cache static assets:', error);
                performanceMetrics.errors++;
                logSecurityEvent('SW_INSTALL_ERROR', { error: error.message });
            })
    );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
    console.log(`[SW] Activating service worker v${CACHE_VERSION}`);
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log(`[SW] Deleting old cache: ${cacheName}`);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            
            // Take control of all clients
            self.clients.claim()
        ])
        .then(() => {
            console.log('[SW] Service worker activated and ready');
            logSecurityEvent('SW_ACTIVATE', { version: CACHE_VERSION });
            
            // Initialize background sync if supported
            if ('sync' in self.registration) {
                console.log('[SW] Background sync supported');
            }
            
            // Initialize push notifications if supported
            if ('pushManager' in self.registration) {
                console.log('[SW] Push notifications supported');
            }
        })
        .catch((error) => {
            console.error('[SW] Activation failed:', error);
            performanceMetrics.errors++;
        })
    );
});

// Fetch Event - Handle all network requests
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip non-GET requests and chrome-extension requests
    if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
        return;
    }
    
    // Increment network request counter
    performanceMetrics.networkRequests++;
    
    // Log security-relevant requests
    if (url.pathname.includes('admin') || url.pathname.includes('api')) {
        logSecurityEvent('SENSITIVE_REQUEST', { 
            url: url.href, 
            method: request.method,
            user: CURRENT_USER,
            timestamp: new Date().toISOString()
        });
    }
    
    event.respondWith(
        handleRequest(request)
            .catch((error) => {
                console.error('[SW] Request handling failed:', error);
                performanceMetrics.errors++;
                return handleOfflineFallback(request);
            })
    );
});

// Main request handling logic
async function handleRequest(request) {
    const url = new URL(request.url);
    
    // Network-first strategy for specific patterns
    if (NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url.href))) {
        return handleNetworkFirst(request);
    }
    
    // Cache-first strategy for static assets
    if (STATIC_ASSETS.includes(url.pathname) || 
        DYNAMIC_CACHE_PATTERNS.some(pattern => pattern.test(url.href))) {
        return handleCacheFirst(request);
    }
    
    // Stale-while-revalidate for dynamic content
    return handleStaleWhileRevalidate(request);
}

// Cache-first strategy
async function handleCacheFirst(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        performanceMetrics.cacheHits++;
        console.log(`[SW] Cache hit: ${request.url}`);
        
        // Check if cache is stale
        const dateHeader = cachedResponse.headers.get('date');
        if (dateHeader) {
            const cacheDate = new Date(dateHeader);
            const now = new Date();
            const age = now - cacheDate;
            
            if (age > CACHE_CONFIG.STATIC_CACHE_DURATION) {
                // Cache is stale, update in background
                updateCacheInBackground(request);
            }
        }
        
        return cachedResponse;
    }
    
    performanceMetrics.cacheMisses++;
    console.log(`[SW] Cache miss: ${request.url}`);
    
    // Fetch from network and cache
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
        console.log(`[SW] Cached new resource: ${request.url}`);
    }
    
    return networkResponse;
}

// Network-first strategy
async function handleNetworkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Cache successful responses
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log(`[SW] Network failed, trying cache: ${request.url}`);
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            performanceMetrics.cacheHits++;
            return cachedResponse;
        }
        
        throw error;
    }
}

// Stale-while-revalidate strategy
async function handleStaleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    // Always try to fetch from network in background
    const networkResponsePromise = fetch(request)
        .then(response => {
            if (response.ok) {
                cache.put(request, response.clone());
                console.log(`[SW] Updated cache: ${request.url}`);
            }
            return response;
        })
        .catch(error => {
            console.log(`[SW] Network update failed: ${request.url}`, error);
        });
    
    // Return cached version immediately if available
    if (cachedResponse) {
        performanceMetrics.cacheHits++;
        return cachedResponse;
    }
    
    // Wait for network if no cache available
    performanceMetrics.cacheMisses++;
    return networkResponsePromise;
}

// Update cache in background
async function updateCacheInBackground(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, response);
            console.log(`[SW] Background cache update: ${request.url}`);
        }
    } catch (error) {
        console.log(`[SW] Background update failed: ${request.url}`, error);
    }
}

// Handle offline fallbacks
async function handleOfflineFallback(request) {
    const url = new URL(request.url);
    performanceMetrics.offlineRequests++;
    
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // Return appropriate offline fallback
    if (request.destination === 'document') {
        console.log('[SW] Serving offline page fallback');
        return caches.match(OFFLINE_FALLBACKS.page) || 
               new Response(generateOfflinePage(), {
                   headers: { 'Content-Type': 'text/html' }
               });
    }
    
    if (request.destination === 'image') {
        console.log('[SW] Serving offline image fallback');
        return caches.match(OFFLINE_FALLBACKS.image) ||
               new Response(generateOfflineImage(), {
                   headers: { 'Content-Type': 'image/svg+xml' }
               });
    }
    
    // Generic offline response
    return new Response('Offline - Resource unavailable', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain' }
    });
}

// Generate offline page
function generateOfflinePage() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Offline - Cybersecurity Portfolio</title>
    <style>
        :root {
            --primary-color: #00ff41;
            --bg-primary: #0a0a0a;
            --text-primary: #ffffff;
            --font-primary: 'Fira Code', monospace;
        }
        
        body {
            font-family: var(--font-primary);
            background: var(--bg-primary);
            color: var(--text-primary);
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            text-align: center;
        }
        
        .offline-container {
            max-width: 500px;
            padding: 2rem;
        }
        
        .offline-icon {
            font-size: 4rem;
            color: var(--primary-color);
            margin-bottom: 1rem;
            animation: pulse 2s infinite;
        }
        
        .offline-title {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: var(--primary-color);
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .offline-message {
            font-size: 1rem;
            line-height: 1.6;
            margin-bottom: 2rem;
            opacity: 0.8;
        }
        
        .offline-info {
            background: rgba(0, 255, 65, 0.1);
            border: 1px solid var(--primary-color);
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 2rem;
        }
        
        .retry-btn {
            background: var(--primary-color);
            color: var(--bg-primary);
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            font-family: var(--font-primary);
            font-weight: 600;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: opacity 0.3s ease;
        }
        
        .retry-btn:hover {
            opacity: 0.8;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .system-info {
            position: fixed;
            bottom: 20px;
            right: 20px;
            font-size: 0.8rem;
            opacity: 0.6;
        }
    </style>
</head>
<body>
    <div class="offline-container">
        <div class="offline-icon">⚡</div>
        <h1 class="offline-title">Connection Lost</h1>
        <div class="offline-message">
            You are currently offline. The cybersecurity portfolio is not available
            without an internet connection. Please check your network connection and try again.
        </div>
        <div class="offline-info">
            <strong>System Status:</strong><br>
            • Network: Disconnected<br>
            • Service Worker: Active<br>
            • Cache: Limited Resources Available<br>
            • User: ${CURRENT_USER}<br>
            • Time: ${new Date().toISOString()}
        </div>
        <button class="retry-btn" onclick="window.location.reload()">
            Retry Connection
        </button>
    </div>
    <div class="system-info">
        SW v${CACHE_VERSION} | ${SW_VERSION}
    </div>
</body>
</html>`;
}

// Generate offline image placeholder
function generateOfflineImage() {
    return `
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#0a0a0a"/>
    <rect x="1" y="1" width="398" height="298" fill="none" stroke="#00ff41" stroke-width="2"/>
    <text x="200" y="130" font-family="monospace" font-size="16" fill="#00ff41" text-anchor="middle">
        IMAGE OFFLINE
    </text>
    <text x="200" y="150" font-family="monospace" font-size="12" fill="#00ff41" text-anchor="middle">
        Network connection required
    </text>
    <text x="200" y="180" font-family="monospace" font-size="10" fill="#666" text-anchor="middle">
        IT24102137 | SW v${CACHE_VERSION}
    </text>
</svg>`;
}

// Background Sync Event
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync triggered:', event.tag);
    
    if (event.tag === 'portfolio-sync') {
        event.waitUntil(handleBackgroundSync());
    }
    
    if (event.tag === 'security-logs-sync') {
        event.waitUntil(syncSecurityLogs());
    }
});

// Handle background sync
async function handleBackgroundSync() {
    try {
        console.log('[SW] Performing background sync');
        
        // Sync any pending data
        const pendingRequests = await getPendingRequests();
        
        for (const request of pendingRequests) {
            try {
                await fetch(request.url, request.options);
                console.log(`[SW] Synced: ${request.url}`);
            } catch (error) {
                console.error(`[SW] Sync failed: ${request.url}`, error);
            }
        }
        
        // Clear pending requests
        await clearPendingRequests();
        
        logSecurityEvent('BACKGROUND_SYNC', { 
            synced: pendingRequests.length,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('[SW] Background sync failed:', error);
        performanceMetrics.errors++;
    }
}

// Push Event - Handle push notifications
self.addEventListener('push', (event) => {
    console.log('[SW] Push notification received');
    
    let notificationData = {
        title: 'Cybersecurity Portfolio',
        body: 'New security alert or update available',
        icon: '/assets/icon-192x192.png',
        badge: '/assets/badge-72x72.png',
        tag: 'portfolio-notification',
        data: {
            url: '/',
            timestamp: new Date().toISOString(),
            user: CURRENT_USER
        }
    };
    
    if (event.data) {
        try {
            const payload = event.data.json();
            notificationData = { ...notificationData, ...payload };
        } catch (error) {
            console.error('[SW] Failed to parse push payload:', error);
        }
    }
    
    // Security check for notifications
    if (notificationData.type === 'security-alert') {
        notificationData.requireInteraction = true;
        notificationData.actions = [
            { action: 'view', title: 'View Alert' },
            { action: 'dismiss', title: 'Dismiss' }
        ];
    }
    
    event.waitUntil(
        self.registration.showNotification(notificationData.title, notificationData)
    );
    
    logSecurityEvent('PUSH_NOTIFICATION', notificationData);
});

// Notification Click Event
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event.notification.tag);
    
    event.notification.close();
    
    const urlToOpen = event.notification.data?.url || '/';
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Check if portfolio is already open
                for (const client of clientList) {
                    const clientUrl = new URL(client.url);
                    if (clientUrl.origin === self.location.origin) {
                        return client.focus();
                    }
                }
                
                // Open new window
                return clients.openWindow(urlToOpen);
            })
    );
    
    logSecurityEvent('NOTIFICATION_CLICK', {
        tag: event.notification.tag,
        action: event.action || 'default',
        timestamp: new Date().toISOString()
    });
});

// Message Event - Handle messages from main thread
self.addEventListener('message', (event) => {
    console.log('[SW] Message received:', event.data);
    
    if (event.data && event.data.type) {
        switch (event.data.type) {
            case 'SKIP_WAITING':
                self.skipWaiting();
                break;
                
            case 'GET_CACHE_STATUS':
                event.ports[0].postMessage({
                    cacheSize: performanceMetrics.cacheHits + performanceMetrics.cacheMisses,
                    metrics: performanceMetrics,
                    version: CACHE_VERSION
                });
                break;
                
            case 'CLEAR_CACHE':
                clearAllCaches().then(() => {
                    event.ports[0].postMessage({ success: true });
                });
                break;
                
            case 'SECURITY_LOG':
                logSecurityEvent(event.data.event, event.data.data);
                break;
                
            default:
                console.log('[SW] Unknown message type:', event.data.type);
        }
    }
});

// Cache management functions
async function clearAllCaches() {
    try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        console.log('[SW] All caches cleared');
        performanceMetrics = {
            cacheHits: 0,
            cacheMisses: 0,
            networkRequests: 0,
            offlineRequests: 0,
            errors: 0
        };
    } catch (error) {
        console.error('[SW] Failed to clear caches:', error);
    }
}

async function getPendingRequests() {
    // In a real implementation, this would read from IndexedDB
    return [];
}

async function clearPendingRequests() {
    // In a real implementation, this would clear IndexedDB
    return true;
}

async function syncSecurityLogs() {
    try {
        if (securityLogs.length > 0) {
            // In a real implementation, sync logs to server
            console.log(`[SW] Syncing ${securityLogs.length} security logs`);
            securityLogs = [];
        }
    } catch (error) {
        console.error('[SW] Failed to sync security logs:', error);
    }
}

// Security and logging functions
function logSecurityEvent(event, data = {}) {
    const logEntry = {
        event,
        data,
        timestamp: new Date().toISOString(),
        user: CURRENT_USER,
        swVersion: CACHE_VERSION,
        userAgent: self.navigator.userAgent
    };
    
    securityLogs.push(logEntry);
    
    // Maintain log size
    if (securityLogs.length > 1000) {
        securityLogs = securityLogs.slice(-500);
    }
    
    console.log(`[SW Security] ${event}:`, data);
}

// Performance monitoring
setInterval(() => {
    console.log('[SW Performance]', {
        ...performanceMetrics,
        cacheEfficiency: performanceMetrics.cacheHits / 
                        (performanceMetrics.cacheHits + performanceMetrics.cacheMisses) * 100,
        uptime: Date.now() - (self.swStartTime || Date.now())
    });
}, 300000); // Every 5 minutes

// Error handling
self.addEventListener('error', (event) => {
    console.error('[SW] Global error:', event.error);
    performanceMetrics.errors++;
    logSecurityEvent('SW_ERROR', {
        message: event.error?.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
    });
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('[SW] Unhandled promise rejection:', event.reason);
    performanceMetrics.errors++;
    logSecurityEvent('SW_UNHANDLED_REJECTION', {
        reason: event.reason?.toString()
    });
});

// Initialize service worker
self.swStartTime = Date.now();

console.log(`
╔══════════════════════════════════════════════════════════════╗
║                 SERVICE WORKER INITIALIZED                   ║
╠══════════════════════════════════════════════════════════════╣
║  User: ${CURRENT_USER.padEnd(51)} ║
║  Version: ${CACHE_VERSION.padEnd(47)} ║
║  Timestamp: ${SW_VERSION.padEnd(45)} ║
║  Cache Strategy: Advanced Multi-tier                         ║
║  Security: Enhanced logging and monitoring                   ║
║  PWA Features: Offline support, Background sync, Push       ║
╚══════════════════════════════════════════════════════════════╝
`);

// Export for debugging in DevTools
self.cybersecSW = {
    version: CACHE_VERSION,
    metrics: performanceMetrics,
    logs: securityLogs,
    clearCache: clearAllCaches,
    config: CACHE_CONFIG
};