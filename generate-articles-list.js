import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import init, { markdown_to_html, initSync } from './scripts/lib/markdown_parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, 'articles');
const outputFilePath = path.join(__dirname, 'articles.json');

async function generate() {
    // Initialize WASM module synchronously by reading the file
    const wasmPath = path.join(__dirname, 'scripts', 'lib', 'markdown_parser_bg.wasm');
    const wasmBuffer = fs.readFileSync(wasmPath);
    initSync(wasmBuffer);

    try {
        const files = fs.readdirSync(articlesDir)
            .filter(file => file.endsWith('.md'))
            .map(fileName => {
                const filePath = path.join(articlesDir, fileName);
                const markdown = fs.readFileSync(filePath, 'utf-8');
                const result = markdown_to_html(markdown);
                const frontmatter = result.frontmatter;

                return {
                    title: frontmatter.Title,
                    date: new Date(frontmatter.Date),
                    fileName: fileName
                };
            });

        files.sort((a, b) => b.date - a.date);

        fs.writeFileSync(outputFilePath, JSON.stringify(files, null, 2));

        console.log(`Successfully generated articles.json with ${files.length} articles.`);
    } catch (error) {
        console.error('Error generating articles list:', error);
        process.exit(1);
    }
}

generate();
