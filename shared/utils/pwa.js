/**
 * PWA utilities for algebrain.dev
 * Handles service worker registration and PWA install prompt
 */

const PWA = {
  deferredPrompt: null,
  isInstalled: false,

  /**
   * Initialize PWA functionality
   */
  init() {
    this.registerServiceWorker();
    this.setupInstallPrompt();
    this.checkInstallState();
  },

  /**
   * Register the service worker
   */
  async registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      console.log('[PWA] Service workers not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });

      console.log('[PWA] Service worker registered:', registration.scope);

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('[PWA] New service worker installing...');

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            console.log('[PWA] New version available');
            this.showUpdateNotification();
          }
        });
      });

    } catch (error) {
      console.error('[PWA] Service worker registration failed:', error);
    }
  },

  /**
   * Setup the install prompt handler
   */
  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (event) => {
      // Prevent the default browser prompt
      event.preventDefault();
      // Store the event for later use
      this.deferredPrompt = event;
      console.log('[PWA] Install prompt captured');

      // Show custom install button if desired
      this.showInstallButton();
    });

    // Track when app is installed
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App installed');
      this.deferredPrompt = null;
      this.isInstalled = true;
      this.hideInstallButton();
    });
  },

  /**
   * Check if app is already installed
   */
  checkInstallState() {
    // Check if running in standalone mode (installed PWA)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
      console.log('[PWA] Running as installed app');
    }

    // iOS doesn't support beforeinstallprompt, check differently
    if (window.navigator.standalone === true) {
      this.isInstalled = true;
      console.log('[PWA] Running as iOS installed app');
    }
  },

  /**
   * Trigger the install prompt
   */
  async promptInstall() {
    if (!this.deferredPrompt) {
      console.log('[PWA] No install prompt available');
      return false;
    }

    // Show the browser's install prompt
    this.deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await this.deferredPrompt.userChoice;
    console.log('[PWA] User choice:', outcome);

    // Clear the prompt reference
    this.deferredPrompt = null;

    return outcome === 'accepted';
  },

  /**
   * Show install button in UI (if element exists)
   */
  showInstallButton() {
    const button = document.getElementById('pwa-install-btn');
    if (button) {
      button.style.display = 'inline-block';
      button.addEventListener('click', () => this.promptInstall());
    }
  },

  /**
   * Hide install button
   */
  hideInstallButton() {
    const button = document.getElementById('pwa-install-btn');
    if (button) {
      button.style.display = 'none';
    }
  },

  /**
   * Show update notification (basic implementation)
   */
  showUpdateNotification() {
    // Check if there's an update notification element
    const notification = document.getElementById('pwa-update-notification');

    if (notification) {
      notification.style.display = 'block';
    } else {
      // Fallback: use console or create a simple notification
      console.log('[PWA] A new version is available. Refresh to update.');
    }
  },

  /**
   * Force update to new service worker
   */
  async update() {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  },

  /**
   * Clear all cached data
   */
  async clearCache() {
    if ('caches' in window) {
      const names = await caches.keys();
      await Promise.all(names.map(name => caches.delete(name)));
      console.log('[PWA] Cache cleared');
      return true;
    }
    return false;
  }
};

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PWA.init());
  } else {
    PWA.init();
  }
}

// Export for global access
window.PWA = PWA;
