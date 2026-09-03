import fs from "fs";
import path from "path";
import multer from "multer";

const uploadDirectory = path.resolve("uploads", "priority-proofs");
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
	destination: (_req, _file, callback) => callback(null, uploadDirectory),
	filename: (_req, file, callback) => {
		const extension = path.extname(file.originalname).toLowerCase();
		callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
	},
});

const fileFilter = (_req, file, callback) => {
	const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
	callback(null, allowedTypes.includes(file.mimetype));
};

export default multer({
	storage,
	fileFilter,
	limits: { fileSize: 5 * 1024 * 1024 },
});
