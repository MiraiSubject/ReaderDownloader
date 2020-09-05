// Copyright (c) MiraiSubject. Licensed under the MIT Licence.
// See the LICENCE file in the repository root for full licence text.
// I don't really care about the Licensing but it's like open source so might as well add it

import axios from 'axios';
import path from 'path';
import PDFMerger from 'pdf-merger-js';
import * as fs from 'fs';

const cookie = 'insert response cookie field here' // Can be found under the F12 tools and under network after reloading the page
const readerId = '1234'; // it's in the address bar at the end
const readerCode = 'LettersAndNumbers'; // the bar code at the bottom of the first page
const pages: number = 98; // The number of pages the reader has

const merger = new PDFMerger();

async function downloadPdf(pages: number) {

    for (let i = 1; i <= pages; i++) {
        const response = await axios.get(`https://www.readeronline.leidenuniv.nl/reader/www/nodes/nodes/get_pdf?reader_id=${readerId}&reader_code=${readerCode}&page_number=${i}`,
            {
                headers: {
                    'Cookie': cookie,
                    'Referer': `https://www.readeronline.leidenuniv.nl/reader/www/nodes/index/${readerId}`
                }
            });

        const dir = path.resolve('output', `download-${i}.pdf`);
        const data: any = response.data
        const buff = Buffer.from(data.file, 'base64')
        fs.writeFileSync(dir, buff);
        merger.add(dir);
    }

    await merger.save('final-reader.pdf')
}

downloadPdf(pages);
