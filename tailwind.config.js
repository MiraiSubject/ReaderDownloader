/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
export default {
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // From: https://github.com/tailwindlabs/tailwindcss/discussions/3921#discussioncomment-8116139
    // adds .progress-bar-[color] and .progress-value-[color] classes
    plugin(function ({addVariant}) {
      addVariant('progress-unfilled', ['&::-webkit-progress-bar', '&']);
      addVariant('progress-filled', ['&::-webkit-progress-value', '&::-moz-progress-bar']); 
  })
  ],
}

