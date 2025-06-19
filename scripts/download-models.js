const https = require('https');
const fs = require('fs');
const path = require('path');

const MODELS_DIR = path.join(__dirname, '../public/models');
const BASE_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';

const modelFiles = [
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  'face_recognition_model-weights_manifest.json',
  'face_recognition_model-shard1',
  'face_recognition_model-shard2',
  'face_expression_model-weights_manifest.json',
  'face_expression_model-shard1'
];

// Create models directory if it doesn't exist
if (!fs.existsSync(MODELS_DIR)) {
  fs.mkdirSync(MODELS_DIR, { recursive: true });
}

function downloadFile(filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(MODELS_DIR, filename);
    const file = fs.createWriteStream(filePath);

    https.get(`${BASE_URL}/${filename}`, (response) => {
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file if there was an error
      reject(err);
    });
  });
}

async function downloadAllModels() {
  console.log('Starting model downloads...');
  
  for (const file of modelFiles) {
    try {
      await downloadFile(file);
    } catch (error) {
      console.error(`Error downloading ${file}:`, error.message);
    }
  }
  
  console.log('All models downloaded successfully!');
}

downloadAllModels(); 