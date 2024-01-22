# Reader Downloader for Leiden University (Webextension)

Easily download the PDF version of your purchased reader from Leiden Online Reader. I believe we should have access to our readers locally, digitally, but also offline without relying on the paper version.

## Download

- [Firefox](https://github.com/MiraiSubject/ReaderDownloader/releases/latest/download/readerdownloader_firefox.xpi)
- [Chrome](https://chromewebstore.google.com/detail/lureaderdownloader/cdkhbinafinpflnilehlgjmnebofkjcc)

## Why?

The online reader is very restrictive in what you can do: 

- Unable to select text
- Page navigation is slow
- Styling on the page is bad to the point that a small window makes the notes bigger than the actual PDF file. (Unusable)
- Cannot use the digital version offline

## Is this illegal?

No. You can only download the readers you own with this.

Here is what the code does: 
- Detect which reader you're viewing
- When you press the download button, your cookie will be used to authorize (as proof of ownership to the server)
- The extension pulls every page from the reader into memory (fun fact every page is its own PDF file)
- All the PDF files get combined into one big file.
- The resulting PDF file gets saved by your browser.

_Disclaimer: This extension is not affiliated with Leiden University and it may stop working at any time when they decide to change the way readers work. Ideally you should bother your course coordinators so they can bother the appropriate people to spend some resources to improve the situation. ONLY use this for creating a personal backup of your reader._

All of this happens locally on your computer and there is no middle man that comes in between, so it is also safe.

## Building & Development

### Requirements
- macOS, *nix (not Windows)
- [pnpm](https://pnpm.io)
- Node 18
- Some knowledge about TypeScript, the WebExtensions API and Svelte

Install the dependencies:

```bash
pnpm install
```

Start development server (starts a clean Chrome instance for dev):
```bash
pnpm dev
```

Or build it yourself, for firefox: 

```bash
pnpm install
pnpm build-firefox
```

Or chrome: 

```bash
pnpm install
pnpm build-chrome
```

## Technical Details

Tech used to build this extension: 
- [Svelte](https://svelte.dev/)
- [Vite](https://vitejs.dev/)
- [Vite Plugin Web Extension](https://vite-plugin-web-extension.aklinker1.io/)
- [TailwindCSS](https://tailwindcss.com/)

The PDF files on the server are served to the client encoded as base64. They have some sort of customised PDF handling library that decodes it and then gets rendered with a variant of pdfjs that has most of its features stripped out and disabled for the user. It's almost like they hate their users. Instead you have to deal with anno 2015 bootstrap with a really bad implementation of responsiveness and a proprietary (read: unexportable) note taking area.

They should strip out most of the features from the digital library and just have a good PDF reader for this. 
