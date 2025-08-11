const fs = require('fs');
const path = require('path');
const { markdown_to_html, init } = require('./scripts/lib/markdown_parser.js');

const articlesDir = path.join(__dirname, '..', 'articles');
const outputFilePath = path.join(__dirname, '..', 'articles.json');

async function generate() {
    await init();

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
