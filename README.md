# Look Away Reminder

A simple macOS menu bar app that reminds you to look away from your screen at regular intervals to reduce eye strain.

## Features

- Lives in the menu bar (top right of your Mac)
- Countdown timer in menu bar showing time until next reminder
- Customizable reminder intervals (5, 10, 15, 20, 30, 45, or 60 minutes)
- Toggle reminders on/off
- Show/hide countdown timer
- Minimal, clean popover interface
- Follows the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run the app:
```bash
npm start
```

## Usage

1. Click the 👁️ icon in the menu bar to open the settings popover
2. Toggle reminders on/off using the switch
3. Toggle the countdown timer display on/off
4. Select your preferred reminder interval
5. When a reminder appears, click "Got it!" to dismiss it

The app will automatically remind you at your chosen interval to take a break and look away from the screen. The menu bar shows a countdown (e.g., "👁️ 15m") when the timer is enabled.

## Building for Distribution

To build the app:

```bash
npm run dist
```

This creates a packaged app in `dist/`. Note: Building a DMG requires Xcode license acceptance. Alternatively, use the built .app file directly from `dist/mac-arm64/`.

## Quit the App

Click the "Quit App" button in the popover, or use Activity Monitor to force quit if needed.

## License

MIT
