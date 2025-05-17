import multer from 'multer';
import path from 'path';

// const upload = multer({
//   dest: 'uploads/',
//   limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
//   fileFilter: (req, file, cb) => {
//     if (
//       file.mimetype !== 'text/csv' ||
//       path.extname(file.originalname).toLowerCase() !== '.csv'
//     ) {
//       return cb(new Error('Only CSV files are allowed'), false);
//     }
//     cb(null, true);
//   },
// });

const uploadStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random())
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
  })
// const uploadStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/')
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random())
//       cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
//     }
//   })

const upload = multer({ storage: uploadStorage });

export default upload;
