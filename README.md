# Reddit Chat Shredder

A Chrome extension that allows you to bulk delete your chat messages from Reddit chat rooms. Perfect for cleaning up your chat history or removing messages from multiple rooms at once.

## 🚀 Features

- **Delete from Current Room**: Remove all your messages from the currently open chat room
- **Delete from All Rooms**: Bulk delete your messages from all joined chat rooms
- **Real-time Progress**: Live progress indicator showing deletion status
- **Safe & Selective**: Only deletes messages you sent, leaves others' messages intact
- **No Data Collection**: Zero data collection - your privacy is protected

## 📋 Prerequisites

- Google Chrome browser
- Active Reddit account with chat access
- Reddit chat room access (https://chat.reddit.com/)

## 🛠️ Installation

### Option 1: Manual Installation (Recommended)

1. **Download the Extension**

   ```bash
   git clone https://github.com/a0m0rajab/Reddit_Chat_Shredeer.git
   cd Reddit_Chat_Shredeer
   ```

2. **Load in Chrome**

   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `Reddit_Chat_Shredeer` folder

3. **Verify Installation**
   - The extension should appear in your extensions list
   - You'll see "Reddit Chat Shredder" in your Chrome toolbar

### Option 2: Chrome Web Store

_Coming soon - currently in development_

## 🎯 Usage

1. **Navigate to Reddit Chat**

   - Go to [https://chat.reddit.com/](https://chat.reddit.com/)
   - Join or open any chat room

2. **Use the Extension**

   - Once on a chat page, you'll see the Reddit Chat Shredder interface at the top
   - Choose from two options:
     - **"Delete This Room Messages"**: Removes all your messages from the current room
     - **"Delete All Messages"**: Removes all your messages from every room you've joined

3. **Monitor Progress**
   - Watch the real-time progress indicator
   - See how many messages are being processed
   - Get confirmation when deletion is complete

## ⚠️ Important Notes

- **Irreversible Action**: Deleted messages cannot be recovered
- **Your Messages Only**: The extension only deletes messages you sent
- **Rate Limiting**: The extension respects Reddit's API limits to avoid account issues
- **Authentication**: Uses your existing Reddit session - no additional login required

## 🔧 How It Works

The extension works by:

1. **Intercepting Authentication**: Captures your Reddit auth token from network requests
2. **Fetching Messages**: Retrieves your messages using Reddit's Matrix API
3. **Filtering**: Identifies only messages sent by your account
4. **Bulk Deletion**: Systematically deletes messages using Reddit's redaction API
5. **Progress Tracking**: Provides real-time feedback on deletion progress

## 📁 Project Structure

```
Reddit_Chat_Shredeer/
├── manifest.json      # Extension configuration
├── lib.js            # Main content script with deletion logic
├── injected.js       # Page script for auth token interception
├── privacy.md        # Privacy policy
└── README.md         # This file
```

## 🔒 Privacy & Security

- **No Data Collection**: We don't collect, store, or transmit any of your data
- **Local Processing**: All operations happen locally in your browser
- **Secure Authentication**: Uses your existing Reddit session tokens
- **Open Source**: Code is fully open for inspection and audit

## 🐛 Troubleshooting

### Extension Not Working

- Ensure you're on `https://chat.reddit.com/*`
- Refresh the page and try again
- Check that the extension is enabled in Chrome

### Messages Not Deleting

- Verify you're logged into Reddit
- Ensure you have permission to delete messages in the room
- Check browser console for error messages

### Performance Issues

- The extension processes messages in batches to respect API limits
- Large chat histories may take several minutes to process
- Don't close the tab while deletion is in progress

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/a0m0rajab/Reddit_Chat_Shredeer/issues)
- **Contact**: [GitHub Profile](https://github.com/a0m0rajab)

## ⚡ Version History

- **v0.0.1**: Initial release
  - Basic message deletion functionality
  - Support for single room and all rooms deletion
  - Progress tracking interface

---

**Disclaimer**: This extension is not affiliated with Reddit Inc. Use at your own discretion. Always ensure you want to permanently delete messages before using this tool.
