// Copyright (c) MiraiSubject. Licensed under the MIT Licence.
// See the LICENCE file in the repository root for full licence text.
// I don't really care about the Licensing but it's like open source so might as well add it

import { PDFDocument } from 'pdf-lib';
import { Buffer } from 'buffer';

async function getHTML(cookie: string, readerId: number): Promise<string> {
    const res = await fetch(`https://readeronline.leidenuniv.nl/reader/nodes/index/${readerId}`, {
        headers: {
            'Cookie': cookie,
            'Referer': `https://www.readeronline.leidenuniv.nl/reader/www/nodes/index/${readerId}`
        }
    });

    const html = await res.text();
    return html;
}


async function getPagesFromHTML(html: string): Promise<number> {
    const regex = /<span id="page_count" data-value="(\d+)">/;
    const match = html.match(regex);
    if (match && match[1]) {
        const pageCount = parseInt(match[1]);
        return pageCount;
    } else {
        throw new Error('Failed to extract page count');
    }
}


async function getReaderCodeFromHTML(html: string): Promise<string> {
    const regex = /<input type="hidden" id="reader_code" value="([^"]+)">/;
    const match = html.match(regex);
    if (match && match[1]) {
        const readerCode = match[1];
        return readerCode;
    } else {
        throw new Error('Failed to extract reader code');
    }
}


export async function downloadPdf(cookie: string, readerId: number): Promise<Uint8Array> {
    try {
        const html = await getHTML(cookie, readerId);
        const pages = await getPagesFromHTML(html);
        const readerCode = await getReaderCodeFromHTML(html);
        const pdf = await PDFDocument.create();
        for (let i = 1; i <= 2; i++) {
            console.log("Fetching page ", i);
            const res = await fetch(`https://readeronline.leidenuniv.nl/reader/nodes/nodes/get_pdf?reader_id=${readerId}&reader_code=${readerCode}&page_number=${i}`,
                {
                    headers: {
                        'Cookie': cookie,
                        'Referer': `https://www.readeronline.leidenuniv.nl/reader/www/nodes/index/${readerId}`
                    }
                });

            const data: any = await res.json()
            const buff = Buffer.from(data.file, 'base64');
            const pdfDoc = await PDFDocument.load(buff);
            const copiedPages = await pdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach((page) => pdf.addPage(page));
        }
        return await pdf.save();
    } catch (e) {
        throw e;
    }
}