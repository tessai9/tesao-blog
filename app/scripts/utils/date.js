// format date string (yyyymmdd) to yyyy-mm-dd
export function formatToDateString(string) {
    if (!string || string.length !== 8) {
        throw new Error('Invalid date string format. Expected yyyymmdd.');
    }
    return `${string.slice(0, 4)}-${string.slice(4, 6)}-${string.slice(6, 8)}`;
}
