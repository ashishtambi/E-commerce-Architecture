const fs = require('fs');
const path = require('path');

const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');

const normalizeUploadPath = (input = '') => {
  if (!input) return '';

  if (input.startsWith('http://') || input.startsWith('https://')) {
    try {
      return new URL(input).pathname;
    } catch (error) {
      return '';
    }
  }

  return input;
};

const toAbsoluteUploadPath = (inputPath = '') => {
  const normalized = normalizeUploadPath(inputPath).replace(/\\/g, '/').replace(/^\/+/, '');
  if (!normalized.startsWith('uploads/')) {
    return '';
  }

  const relativePath = normalized.slice('uploads/'.length);
  if (!relativePath) {
    return '';
  }

  const absolutePath = path.resolve(uploadDir, relativePath);
  const safePrefix = `${uploadDir}${path.sep}`;
  if (absolutePath !== uploadDir && !absolutePath.startsWith(safePrefix)) {
    return '';
  }

  return absolutePath;
};

const mapUploadResponse = (file) => ({
  filename: file.filename,
  path: `/uploads/${file.filename}`,
  size: file.size,
  mimetype: file.mimetype,
});

const uploadImage = async (req, res) => {
  const files = [];

  if (Array.isArray(req.files)) {
    files.push(...req.files);
  } else if (req.files && typeof req.files === 'object') {
    Object.values(req.files).forEach((fileGroup) => {
      if (Array.isArray(fileGroup)) files.push(...fileGroup);
    });
  } else if (req.file) {
    files.push(req.file);
  }

  if (!files.length) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  const payload = files.map(mapUploadResponse);

  return res.status(201).json({
    message: 'Image upload successful',
    files: payload,
    file: payload[0],
  });
};

const deleteUploadedImage = async (req, res) => {
  const inputPath = req.body?.path;
  if (!inputPath) {
    return res.status(400).json({ message: 'Image path is required' });
  }

  const absolutePath = toAbsoluteUploadPath(inputPath);
  if (!absolutePath) {
    return res.status(400).json({ message: 'Invalid upload path' });
  }

  if (!fs.existsSync(absolutePath)) {
    return res.status(404).json({ message: 'Image file not found' });
  }

  await fs.promises.unlink(absolutePath);

  return res.json({ message: 'Image deleted' });
};

module.exports = {
  uploadImage,
  deleteUploadedImage,
};
