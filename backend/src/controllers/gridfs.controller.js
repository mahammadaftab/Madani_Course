const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { Readable } = require('stream');
const logger = require('../utils/logger');

// Initialize GridFS
let gfs;
const conn = mongoose.connection;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Upload file to GridFS
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      logger.warn('File upload error: No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Create a readable stream from buffer
    const readableStream = new Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null);

    // Create write stream to GridFS
    const filename = `${Date.now()}-${req.file.originalname}`;
    const writeStream = gfs.createWriteStream({
      filename,
      contentType: req.file.mimetype,
      metadata: {
        uploadedBy: req.user.id,
        uploadedAt: new Date()
      }
    });

    // Pipe the readable stream to GridFS
    readableStream.pipe(writeStream);

    writeStream.on('close', (file) => {
      logger.info(`File uploaded to GridFS: ${file.filename}`);
      res.status(200).json({
        success: true,
        data: {
          id: file._id,
          filename: file.filename,
          url: `/api/uploads/${file._id}`
        }
      });
    });

    writeStream.on('error', (error) => {
      logger.error('GridFS upload error:', error);
      res.status(500).json({ message: 'Error uploading file' });
    });
  } catch (error) {
    logger.error('File upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get file from GridFS
const getFile = async (req, res) => {
  try {
    const file = await gfs.files.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
    
    if (!file) {
      logger.warn(`File not found: ${req.params.id}`);
      return res.status(404).json({ message: 'File not found' });
    }

    // Set content type
    res.set('Content-Type', file.contentType);
    
    // Create read stream
    const readStream = gfs.createReadStream({ _id: file._id });
    
    // Pipe stream to response
    readStream.pipe(res);
    
    readStream.on('error', (error) => {
      logger.error('File read error:', error);
      res.status(500).json({ message: 'Error reading file' });
    });
  } catch (error) {
    logger.error('Get file error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete file from GridFS
const deleteFile = async (req, res) => {
  try {
    const file = await gfs.files.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
    
    if (!file) {
      logger.warn(`File not found for deletion: ${req.params.id}`);
      return res.status(404).json({ message: 'File not found' });
    }

    await gfs.files.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) });
    
    logger.info(`File deleted from GridFS: ${req.params.id}`);
    
    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    logger.error('Delete file error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  uploadFile,
  getFile,
  deleteFile
};