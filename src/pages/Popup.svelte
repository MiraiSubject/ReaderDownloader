<script lang="ts">
  import { onMount } from "svelte";
  import browser from "webextension-polyfill";
  import { downloadPdf } from "../lib/GetPDF";
  import { progress } from "../lib";

  let tabs: browser.Tabs.Tab[] = [];
  let cookieString = "";
  let readerId: number;
  onMount(async () => {
    const cookieOpts = {
      domain: ".readeronline.leidenuniv.nl",
    };

    const cookies = await browser.cookies.getAll(cookieOpts);
    cookieString = cookies.map((v) => `${v.name}=${v.value}`).join("; ");
    tabs = await browser.tabs.query({ active: true, currentWindow: true });
    console.log(tabs);

    tabs.forEach(async (tab) => {
      if (!tab.id) return;
      if (!tab.url) return;
      if (!tab.url.includes("readeronline.leidenuniv.nl")) return;

      const maybeRId = tab.url.split("/").pop();

      if (isNaN(Number(maybeRId))) return;

      readerId = Number(maybeRId);
    });
  });

  async function download(readerId: number) {
    const tab = tabs[0];
    if (!tab) return;
    if (!tab.id) return;

    const reader = await downloadPdf(cookieString, readerId);
    let output = URL.createObjectURL(
      new Blob([reader.pdf], { type: "application/pdf" }),
    );
    await browser.downloads.download({
      url: output,
      filename: `Reader${reader.id}_${reader.code}_LU.pdf`,
    });
    URL.revokeObjectURL(output);
    progress.reset();
  }
</script>

<div>
  <h1>vite-plugin-web-extension</h1>
  {#if readerId}
    <p>Detected Reader: {readerId}</p>
    <button on:click={() => download(readerId)}>Download</button>
  {/if}
  {#if $progress.status === "running"}
    <p>Downloading... (page {$progress.progress} / {$progress.total})</p>
    <progress value={$progress.progress} max={$progress.total}></progress>
  {/if}
</div>

<style>
</style>
