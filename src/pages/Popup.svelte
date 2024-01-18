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
    progress.done();
  }
</script>

<div class="bg-[#001158] h-full">
  <div class="flex justify-center flex-col h-full gap-2 p-4 text-white">
    <h1 class="text-3xl font-bold">Reader Downloader</h1>
    {#if readerId}
      <p class="text-xl">Detected a Reader on the page! ({readerId})</p>
      <p>Press the download button to save it to your computer as a PDF.</p>
      <button
        class="bg-green-700 px-4 py-2 w-full rounded-sm shadow-lg hover:bg-green-500 transition-all disabled:opacity-50 {$progress.status ===
        'running'
          ? 'cursor-progress'
          : ''}"
        disabled={$progress.status === "running"}
        on:click={() => download(readerId)}>Download</button
      >
    {:else}
      <p>
        Navigate to a page that has a reader displayed to be able to download
        it.
      </p>
      <a
        class="bg-indigo-900 px-4 py-2 rounded-xl"
        href="https://readeronline.leidenuniv.nl/"
        target="_blank"
        rel="noopener noreferrer"
        >Open Leiden University Reader Online in a new tab</a
      >
    {/if}
    {#if $progress.status === "running"}
      <p>
        Downloading... This will take a couple of minutes. Do not close the
        extension. (page {$progress.progress} / {$progress.total})
      </p>
      <progress
        class="w-full cursor-progress progress-unfilled:bg-slate-300 progress-filled:bg-pink-500 transition-all progress-unfilled:rounded-xl progress-filled:rounded-xl"
        value={$progress.progress}
        max={$progress.total}
      ></progress>
    {/if}
    {#if $progress.status === "done"}
      <p>Downloaded! Your browser will take it over from here.</p>
    {/if}
    {#if $progress.status === "error"}
      <p>Something went wrong. Please try again later.</p>
      <p>Detailed error message: {$progress.error}</p>
    {/if}
  </div>
</div>

<style lang="postcss">
</style>
