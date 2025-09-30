import * as XLSX from 'xlsx';

export const convertXlsxToJson = (buffer: Buffer) => {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
};

type PrimitiveType = 'string' | 'number' | 'boolean';
export const getValueByType = (
    obj: Record<string, unknown>,
    key: string,
    type: PrimitiveType,
) => (typeof obj[key] === type ? obj[key] : null);
