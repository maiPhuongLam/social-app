import multer from "multer";

export const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads"); // The 'uploads/' directory where files will be stored
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname); // Unique file name
    },
  }),
  fileFilter: (req, file: Express.Multer.File, cb: any) => {
    // Define the allowed file types
    const allowedFileTypes = ["image/jpeg", "image/png", "image/gif"];

    // Check if the uploaded file's MIME type is in the allowed types array
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      cb(null, false); // Reject the file
    }
  },
}).single("avatar");
