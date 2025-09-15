import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const uploadMemoryFile = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        // Danh sách phần mở rộng cho phép
        const allowedExt = [
            '.jpg',
            '.jpeg',
            '.png',
            '.webp',
            '.gif', // ảnh
            '.xlsx',
            '.xls',
            '.csv', // excel/csv
        ];

        if (allowedExt.includes(ext)) return cb(null, true);
        cb(new Error('File not accepted!'));
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default uploadMemoryFile;
