#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const ProgressBar = require('progress');

async function convertPngToWebp(inputDir, outputDir, batchSize) {
    try {
        const files = await fs.readdir(inputDir);
        const pngFiles = files.filter(file => path.extname(file).toLowerCase() === '.png');

        if (pngFiles.length === 0) {
            console.log('No .png files found in the specified directory.');
            return;
        }

        let done = 0;
        const bar = new ProgressBar(' Converting [:bar] :percent :etas (:done / :total)', {
            complete: '=',
            incomplete: ' ',
            width: 80,
            total: pngFiles.length
        });

        for (let i = 0; i < pngFiles.length; i += batchSize) {
            const batch = pngFiles.slice(i, i + batchSize);

            await Promise.all(batch.map(async file => {
                const inputFilePath = path.join(inputDir, file);
                const outputFilePath = path.join(outputDir, `${path.basename(file, '.png')}.webp`);

                try {
                    await sharp(inputFilePath)
                        .webp({ quality: 100 })
                        .toFile(outputFilePath);
                } catch (error) {
                    console.error(`Error converting file ${file}:`, error);
                }

                bar.tick({ done: ++done });
            }));
        }

    } catch (error) {
        console.error('Error converting files:', error);
    }
}

const argv = yargs(hideBin(process.argv))
    .option('input', {
        alias: 'i',
        describe: 'Input directory containing .png files',
        type: 'string',
        demandOption: true
    })
    .option('output', {
        alias: 'o',
        describe: 'Output directory for .webp files',
        type: 'string',
        demandOption: true
    })
    .option('batch', {
        alias: 'b',
        describe: 'Number of files to process in each batch',
        type: 'number',
        default: 100
    })
    .argv;

if (!argv.input || !argv.output) {
    console.error('Please provide both input and output directories using the --input and --output options.');
    process.exit(1);
}

fs.ensureDir(argv.output)
    .then(() => convertPngToWebp(argv.input, argv.output, argv.batch))
    .catch(err => console.error('Error ensuring output directory:', err));
