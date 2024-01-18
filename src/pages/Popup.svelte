<script lang="ts">
  import { onMount } from "svelte";
  import browser from "webextension-polyfill";
    import { downloadPdf } from "../lib/GetPDF";

  let cookies: any[] = [];
  let tabs: browser.Tabs.Tab[] = [];
  let cookieString = ""

  onMount(async () => {
    // getTab = await browser.tabs.query({ active: true, currentWindow: true });
    // console.log(getTab)

    const cookieOpts = {
      domain: ".readeronline.leidenuniv.nl",
    };

    cookies = await browser.cookies.getAll(cookieOpts);
    cookieString = cookies.map((v) => `${v.name}=${v.value}`).join('; ');
    tabs = await browser.tabs.query({ active: true, currentWindow: true })
    console.log(tabs)
  });

  async function download(readerId: number) {
    const tab = tabs[0];
    if (!tab) return;
    if (!tab.id) return;

    const file = await downloadPdf(cookieString, readerId)
    let output = URL.createObjectURL(new Blob([file], { type: "application/pdf" }));
    await browser.downloads.download({
      url: output,
      filename: ".pdf",
    });
  
    URL.revokeObjectURL(output);
  }
</script>

<div>
  <img src="/icon-with-shadow.svg" alt="" />
  <h1>vite-plugin-web-extension</h1>
  <button on:click={() => download(1339)}>Download</button>

  <p>Tab: {tabs.map((v) => v.url)}</p>
  <p>Cookies:</p>
  <p>{cookies.map((v) => `${v.name}=${v.value}`).join('; ')}</p>
</div>

<style>
</style>
