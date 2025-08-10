const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, 'articles'); // articlesディレクトリのパス
const outputFilePath = path.join(__dirname, 'articles.json'); // 出力先のパス

// YYYYMMdd -> YYYY-MM-dd に変換するヘルパー関数
const formatToDateString = (yyyymmdd) => {
    const year = yyyymmdd.substring(0, 4);
    const month = yyyymmdd.substring(4, 6);
    const day = yyyymmdd.substring(6, 8);
    return `${year}-${month}-${day}`;
};

try {
    // articlesディレクトリ内のファイルを取得
    const files = fs.readdirSync(articlesDir)
        .filter(file => file.endsWith('.md'))
        .map(fileName => {
            const yyyymmdd = fileName.match(/^(\d{8})\.md$/)?.[1]; // YYYYMMdd形式の日付を抽出
            const title = yyyymmdd; // タイトルは日付部分

            return {
                title: title,
                // ファイル名から日付を生成
                date: new Date(formatToDateString(yyyymmdd)),
                fileName: fileName
            };
        });

    // 日付の降順でソート
    files.sort((a, b) => b.date - a.date);

    // JSONファイルとして書き出し
    fs.writeFileSync(outputFilePath, JSON.stringify(files, null, 2));

    console.log(`Successfully generated articles.json with ${files.length} articles.`);

} catch (error) {
    console.error('Error generating articles list:', error);
    process.exit(1);
}
