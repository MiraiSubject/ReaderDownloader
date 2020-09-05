# Reader Downloader for Leiden University

Downloads all the PDF pages from Leiden's Reader Online service, decodes the base64 of them and them merges it into one nice PDF file.

## Why?

The online reader is very restrictive in what you can do: 

- Unable to select text
- Page navigation is slow
- CSS on webpage is bad to the point that a small window makes the notes bigger than the actual PDF file

There's also no native way to download the PDF to use it offline.

## How to use

Since I don't really intend on documenting this you're going to have to  make do with the comments I made in the 4 constants in the top.
You only really need to change those 4 to get it working. It should be very simple.

1. Install dependencies with `yarn` or `npm install`
2. Change constants in `index.ts` as needed.
3. run it with `yarn start` or `npm start`. It will take a while to download all the files and merge them together. 

