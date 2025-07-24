import multer from "multer";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.fieldname === "image") {
      cb(null, "public/assets/images");
    } else {
      cb(null, "public/");
    }
  },
  filename(req, file, cb) {
    const fileArray = file.originalname.split(".");
    const extension = fileArray.pop();
    const id = Date.now();
    cb(null, `${fileArray.join("-")}-${id}.${extension}`);
  },
});

const upload = multer({ storage });

export const normalizeImagePath = (
  filePath: string | undefined,
): string | undefined => {
  if (!filePath) return undefined;

  return filePath.replace(/\\/g, "/").replace(/^public\//, "/");
};

export default upload;
