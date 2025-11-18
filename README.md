# Look Away Reminder

A simple macOS menu bar app that reminds you to look away from your screen at regular intervals to reduce eye strain.

## Features

- Lives in the menu bar (top right of your Mac)
- Customizable reminder intervals (5, 10, 15, 20, 30, 45, or 60 minutes)
- Toggle reminders on/off
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

1. Click the icon in the menu bar to open the settings popover
2. Toggle reminders on/off using the switch
3. Select your preferred reminder interval
4. When a reminder appears, click "Got it!" to dismiss it

The app will automatically remind you at your chosen interval to take a break and look away from the screen.

## Customization

### Icon
The app includes a basic placeholder icon. You can replace `iconTemplate.png` with your own 22x22px icon. For best results on macOS:
- Use a monochrome (black) icon
- Include transparency
- Name it `iconTemplate.png` (the "Template" suffix tells macOS to treat it as a template icon)

## Building for Distribution

To package the app for distribution:

1. Install electron-builder:
```bash
npm install --save-dev electron-builder
```

2. Add to package.json:
```json
"build": {
  "appId": "com.lookaway.reminder",
  "mac": {
    "category": "public.app-category.healthcare-fitness",
    "target": "dmg"
  }
},
"scripts": {
  "dist": "electron-builder"
}
```

3. Build:
```bash
npm run dist
```

## Quit the App

Click the "Quit App" button in the popover, or use Activity Monitor to force quit if needed.

## License

MIT
