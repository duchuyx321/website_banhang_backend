import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const uploadMemoryFile = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (['.xlsx', '.xls', '.csv'].includes(ext)) return cb(null, true);
        cb(new Error('Chỉ chấp nhận file Excel (.xls/.xlsx) hoặc CSV'));
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default uploadMemoryFile;
