export const convertStringToJson = <T = unknown>(
    raw: string | null,
): T | null => {
    if (!raw) return null;
    const fixedStringToJson: string = raw.replace(
        /([{,]\s*)(\w+)\s*:/g,
        '$1"$2":',
    );
    return JSON.parse(fixedStringToJson) as T | null;
};
