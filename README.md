# BLACKSKY-MD WhatsApp Bot

A robust WhatsApp multi-device bot engineered to tackle complex network connectivity challenges with intelligent communication resilience.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/yourusername/your-repo-name)

## Key Features

- Multi-device WhatsApp bot using @whiskeysockets/baileys
- Advanced connection handling for cloud environments like Replit
- Intelligent error recovery and credential management
- Multiple connection methods for different usage scenarios
- Multiple deployment options (Docker, Aptfile, Standard)
- 490+ commands across 15 categories

## Connection System

This bot includes an enhanced connection system specifically designed to work around the "Connection Failure" issues common when running WhatsApp bots in cloud environments. We provide multiple connection methods:

1. **Standard Web Connection**
   - Default connection option with web QR interface
   - Automatically attempts to reconnect with optimized parameters

2. **Specialized QR Generator**
   - Alternative connection method for difficult environments
   - Uses a streamlined approach with fewer dependencies

3. **Terminal-only QR**
   - Most reliable connection method
   - No web interface required, works directly in the terminal

For detailed information about connection options, see [CONNECTION_README.md](CONNECTION_README.md).

## Quick Start

### Option 1: One-Click Quick Connect (Easiest)

```bash
node quick-connect.js
```

This script automatically tries all connection methods sequentially until one works:
- Starts with the standard connection method
- Tries terminal QR if standard fails
- Falls back to browser switching if needed
- Provides clear recommendations if all methods fail

### Option 2: Interactive Connection Tool (Recommended)

```bash
node connect-interactive.js
```

This user-friendly interactive tool provides:
- Auto mode that tries different connection methods until one works
- Easy access to all connection options
- Connection diagnostics and troubleshooting
- Credential management

### Option 3: Simple Connection Helper

```bash
node run-connection.js
```

A simpler interactive script that lets you select different connection methods.

### Option 4: Direct Connection Methods

```bash
# Standard web connection (default)
node src/index.js

# For connection issues, use the web QR generator
node src/qr-generator.js

# For the most reliable connection
node src/terminal-qr.js

# To try different browser configurations automatically
node try-alternate-browser.js

# To check connection status and troubleshoot issues
node check-connection.js
```

### After Connecting

1. Scan the QR code with your WhatsApp app:
   - Go to WhatsApp Settings → Linked Devices
   - Tap on "Link a Device"
   - Scan the QR code shown in the web interface or terminal

2. Once connected, the bot will automatically save credentials for future use
   - You should only need to scan the QR code once
   - Subsequent restarts will use the saved credentials

## Deployment Options

This bot supports multiple deployment methods:

### 1. Heroku One-Click Deploy 

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/yourusername/your-repo-name)

### 2. Local Deployment

1. Clone this repository
2. Install dependencies: `npm install`
3. Run the bot: `node quick-connect.js`

### 3. Heroku Manual Deployment

See our detailed guides for different deployment strategies:
- [Standard Deployment](HEROKU-DEPLOYMENT.md)
- [Docker-based Deployment](HEROKU-DOCKER-GUIDE.md) (for dependency issues)
- [Aptfile-based Deployment](HEROKU-APTFILE-GUIDE.md) (alternative approach)

For a complete overview of all deployment options, see [DEPLOYMENT_OPTIONS.md](DEPLOYMENT_OPTIONS.md).

## Troubleshooting

If you're experiencing connection issues:

1. Try the different connection methods mentioned above
2. Check [CONNECTION_README.md](CONNECTION_README.md) for detailed troubleshooting steps
3. Clear the authentication data (delete the `auth_info_baileys` folder)

## Important Notes

- WhatsApp may occasionally reject connections from cloud providers
- The connection system will automatically try different approaches
- If all methods fail, WhatsApp servers may be temporarily blocking the IP address
- For Heroku deployments, see [HEROKU-DEPLOYMENT.md](HEROKU-DEPLOYMENT.md)

## Command Usage

Once connected, the bot will automatically load and process commands.

For more information about available commands and features, see the source code in the `src/commands` directory.

## Credits

- @whiskeysockets/baileys library for WhatsApp Web API
- Contributors to this project for connection resilience enhancements