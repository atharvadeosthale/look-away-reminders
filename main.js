const { app, BrowserWindow, Tray, ipcMain, screen, nativeImage } = require('electron');
const path = require('path');

let tray = null;
let window = null;
let reminderTimer = null;
let countdownInterval = null;
let timerEndTime = null;
let settings = {
  enabled: true,
  interval: 20 * 60 * 1000, // 20 minutes in milliseconds
  showTimer: true
};

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

app.dock.hide(); // Hide from dock on macOS

app.whenReady().then(() => {
  createTray();
  startTimer();
});

app.on('window-all-closed', (e) => {
  e.preventDefault(); // Prevent app from quitting
});

function createTray() {
  // Create a simple 16x16 empty icon and use title text instead
  const canvas = nativeImage.createEmpty();
  tray = new Tray(canvas);

  // Use emoji/text as the menu bar icon
  updateTrayTitle();
  tray.setToolTip('Look Away Reminder');

  tray.on('click', () => {
    toggleWindow();
  });

  tray.on('right-click', () => {
    toggleWindow();
  });
}

function updateTrayTitle() {
  if (!tray) return;

  if (!settings.enabled || !settings.showTimer || !timerEndTime) {
    tray.setTitle('👁️');
    return;
  }

  const now = Date.now();
  const remaining = Math.max(0, timerEndTime - now);

  if (remaining === 0) {
    tray.setTitle('👁️');
    return;
  }

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  if (minutes > 0) {
    tray.setTitle(`👁️ ${minutes}m`);
  } else {
    tray.setTitle(`👁️ ${seconds}s`);
  }
}

function startCountdown() {
  stopCountdown();

  if (settings.enabled && settings.showTimer) {
    updateTrayTitle();
    countdownInterval = setInterval(updateTrayTitle, 1000);
  } else {
    updateTrayTitle();
  }
}

function stopCountdown() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

function createWindow() {
  const trayBounds = tray.getBounds();
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - 160);
  const y = Math.round(trayBounds.y + trayBounds.height + 4);

  window = new BrowserWindow({
    width: 320,
    height: 320,
    x: x,
    y: y,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  window.loadFile('index.html');

  window.on('blur', () => {
    if (!window.webContents.isDevToolsOpened()) {
      closeWindow();
    }
  });

  window.once('ready-to-show', () => {
    window.show();
  });
}

function closeWindow() {
  if (window) {
    window.destroy();
    window = null;
  }
}

function toggleWindow() {
  if (window && !window.isDestroyed()) {
    closeWindow();
  } else {
    createWindow();
  }
}

function showWindow() {
  if (window && !window.isDestroyed()) {
    closeWindow();
  }
  createWindow();
}

function startTimer() {
  stopTimer();

  if (settings.enabled && settings.interval > 0) {
    timerEndTime = Date.now() + settings.interval;
    reminderTimer = setTimeout(() => {
      showReminder();
    }, settings.interval);
    startCountdown();
  } else {
    timerEndTime = null;
    updateTrayTitle();
  }
}

function stopTimer() {
  if (reminderTimer) {
    clearTimeout(reminderTimer);
    reminderTimer = null;
  }
  stopCountdown();
  timerEndTime = null;
}

function showReminder() {
  if (window && !window.isDestroyed()) {
    closeWindow();
  }
  createWindow();

  // Send reminder message once window is ready
  if (window && window.webContents) {
    window.webContents.once('did-finish-load', () => {
      window.webContents.send('show-reminder');
    });
  }

  // Restart timer after showing reminder
  startTimer();
}

// IPC handlers
ipcMain.on('get-settings', (event) => {
  event.reply('settings-data', settings);
});

ipcMain.on('update-settings', (event, newSettings) => {
  settings = { ...settings, ...newSettings };

  // If only showTimer changed, just update the countdown
  if (newSettings.showTimer !== undefined && Object.keys(newSettings).length === 1) {
    if (settings.showTimer) {
      startCountdown();
    } else {
      stopCountdown();
      updateTrayTitle();
    }
  } else {
    startTimer(); // Restart timer with new settings
  }

  event.reply('settings-updated', settings);
});

ipcMain.on('dismiss-reminder', () => {
  closeWindow();
});

ipcMain.on('quit-app', () => {
  app.quit();
});
