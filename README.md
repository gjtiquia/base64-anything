# Base64 Anything

A web app to encode any file into base64, or decode any base64 text back into any file format.

## Features

- ✅ Encode any file to base64 with a simple drag & drop
- ✅ Decode base64 strings back to their original file format
- ✅ Minimalistic, fast and simple interface
- ✅ Works on both desktop and mobile devices
- ✅ Dark mode support based on user preference
- ✅ Drag and drop file uploads
- ✅ Copy encoded base64 to clipboard
- ✅ Download encoded base64 as text file
- ✅ Download decoded files directly

## Tech Stack

- [Vite](https://vitejs.dev/) - Fast development & building
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [PNPM](https://pnpm.io/) - Fast, disk space efficient package manager

That's it! Minimalistic, fast, and simple.

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## How It Works

The app uses the browser's built-in APIs to handle file operations:

1. **Encoding:** Uses `FileReader` to read files and convert them to base64.
2. **Decoding:** Uses `atob` to decode base64 strings and creates downloadable files.
3. **Dark Mode:** Detects system preference and allows manual toggle.

## License

MIT

