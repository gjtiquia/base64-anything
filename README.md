# base64 anything

a web app to encode any file into base64, or decode any base64 text back into any file format.

## features

- ✅ encode any file to base64 with a simple drag & drop
- ✅ decode base64 strings back to their original file format
- ✅ minimalistic, fast and simple interface
- ✅ works on both desktop and mobile devices
- ✅ dark mode support based on user preference
- ✅ drag and drop file uploads
- ✅ copy encoded base64 to clipboard
- ✅ download encoded base64 as text file
- ✅ download decoded files directly

## tech stack

- [vite](https://vitejs.dev/) - fast development & building
- [typescript](https://www.typescriptlang.org/) - type safety
- [pnpm](https://pnpm.io/) - fast, disk space efficient package manager

that's it! minimalistic, fast, and simple.

## development

```bash
# install dependencies
pnpm install

# start development server
pnpm dev

# build for production
pnpm build

# preview production build
pnpm preview
```

## how it works

the app uses the browser's built-in apis to handle file operations:

1. **encoding:** uses `FileReader` to read files and convert them to base64.
2. **decoding:** uses `atob` to decode base64 strings and creates downloadable files.
3. **dark mode:** detects system preference and allows manual toggle.

## side note

this was an excuse to play with cursor + claude 3.7 sonnet thinking model😂 amazed and had some fun

## license

MIT

