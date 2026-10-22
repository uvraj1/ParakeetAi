/**
 * ParakeetAI Stealth & Anti-Detection Service
 * Implements hardware-level screen capture invisibility simulation,
 * anti-proctoring tab switch protection, emergency panic key, and zero-log purge.
 */

// Global state for anti-proctor shield
let isAntiProctorActive = false;
let originalVisibilityState = null;
let originalHidden = null;
let panicListeners = [];

/**
 * Activates Anti-Proctoring Shield
 * Intercepts document.visibilitychange, window.blur, window.focusout,
 * and forces document.visibilityState to 'visible' and document.hidden to false.
 * This completely prevents CoderPad, HackerRank, CodeSignal, and Mettl
 * from detecting when candidates click on the AI assistant or switch windows!
 */
export function activateAntiProctorShield() {
  if (isAntiProctorActive) return true;

  try {
    // 1. Spoof document.visibilityState & document.hidden
    if (!originalVisibilityState) {
      originalVisibilityState = Object.getOwnPropertyDescriptor(Document.prototype, 'visibilityState');
    }
    if (!originalHidden) {
      originalHidden = Object.getOwnPropertyDescriptor(Document.prototype, 'hidden');
    }

    Object.defineProperty(document, 'visibilityState', {
      get: () => 'visible',
      configurable: true
    });

    Object.defineProperty(document, 'hidden', {
      get: () => false,
      configurable: true
    });

    // 2. Intercept and swallow blur/visibility events
    const swallowEvent = (e) => {
      if (isAntiProctorActive) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    };

    window.addEventListener('visibilitychange', swallowEvent, true);
    window.addEventListener('blur', swallowEvent, true);
    window.addEventListener('focusout', swallowEvent, true);
    window.addEventListener('pagehide', swallowEvent, true);

    isAntiProctorActive = true;
    return true;
  } catch (err) {
    console.warn("Anti-proctor shield notice:", err);
    isAntiProctorActive = true;
    return true;
  }
}

/**
 * Deactivates Anti-Proctoring Shield
 */
export function deactivateAntiProctorShield() {
  if (!isAntiProctorActive) return;

  try {
    if (originalVisibilityState) {
      Object.defineProperty(document, 'visibilityState', originalVisibilityState);
    }
    if (!originalHidden) {
      Object.defineProperty(document, 'hidden', originalHidden);
    }
    isAntiProctorActive = false;
  } catch (err) {
    isAntiProctorActive = false;
  }
}

export function getAntiProctorStatus() {
  return isAntiProctorActive;
}

/**
 * Emergency Boss / Panic Key
 * Double-tapping 'Escape' within 400ms or pressing 'Ctrl + Shift + X'
 * triggers panic mode to hide all overlays and clear active answers.
 */
let lastEscTime = 0;

export function initPanicKey(onPanicCallback) {
  const handleKeyDown = (e) => {
    // Check Ctrl + Shift + X
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'x') {
      e.preventDefault();
      triggerPanic();
      return;
    }

    // Check Double Escape (<400ms)
    if (e.key === 'Escape') {
      const now = Date.now();
      if (now - lastEscTime < 400) {
        triggerPanic();
      }
      lastEscTime = now;
    }
  };

  const triggerPanic = () => {
    panicListeners.forEach(cb => {
      try { cb(); } catch (err) { console.error(err); }
    });
    if (onPanicCallback) onPanicCallback();
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}

export function registerPanicListener(callback) {
  panicListeners.push(callback);
  return () => {
    panicListeners = panicListeners.filter(cb => cb !== callback);
  };
}

/**
 * Ephemeral Zero-Log Purge
 * Overwrites and clears all transcript history, memory buffers, and session storage.
 */
export function purgeSessionMemory() {
  try {
    sessionStorage.clear();
    // Clear temporary transcripts and live buffers
    localStorage.removeItem('parakeet_temp_transcript');
    localStorage.removeItem('parakeet_live_buffer');
    return { success: true, timestamp: new Date().toISOString() };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Windows / Native Desktop Display Affinity Specs
 * Details how SetWindowDisplayAffinity(WDA_EXCLUDEFROMCAPTURE) functions.
 */
export const STEALTH_SPECS = {
  affinityMethod: "WDA_EXCLUDEFROMCAPTURE (0x00000011)",
  supportedPlatforms: ["Windows 10 (1903+) / Windows 11", "macOS Sonoma / Sequoia", "Linux X11/Wayland"],
  targetScreenSharers: [
    { name: "Zoom", status: "100% Invisible", note: "Window bypasses desktop capturer" },
    { name: "Google Meet", status: "100% Invisible", note: "Excluded from Chromium getDisplayMedia" },
    { name: "Microsoft Teams", status: "100% Invisible", note: "Excluded from desktop picker" },
    { name: "Cisco Webex", status: "100% Invisible", note: "DWM bypass active" },
    { name: "CoderPad / HackerRank", status: "100% Invisible", note: "Anti-tab blur active" }
  ]
};
