const multer = require("multer");
const path = require("path");

// konfigurasi penyimpanan dengan nama file random
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// konfigurasi penyimpanan dengan nama file original
const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname);
  },
});

// fungsi filter untuk mengizinkan hanya file gambar
const imageFilter = function (req, file, cb) {
  const fileSize = parseInt(req.headers["content-length"]);
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    // return cb(new Error("Hanya file gambar yang di izinkan"));
    req.fileValidationError = "Hanya file gambar yang di izinkan";
    cb(null, false);
    return;
  } else if (fileSize > 1024 * 1024 * 2) {
    req.fileValidationError = "Ukuran file melebihi 2mb";
  } else {
    cb(null, true);
    return;
  }
};

exports.upload = multer({
  storage: storage2,
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
  fileFilter: imageFilter,
});
