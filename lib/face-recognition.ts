import * as faceapi from 'face-api.js';

export async function loadModels() {
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models')
    ]);
    console.log('Face recognition models loaded');
  } catch (error) {
    console.error('Error loading face recognition models:', error);
    throw error;
  }
}

export async function detectFace(videoElement: HTMLVideoElement) {
  try {
    const detections = await faceapi.detectAllFaces(
      videoElement,
      new faceapi.TinyFaceDetectorOptions()
    ).withFaceLandmarks().withFaceDescriptors();

    return detections;
  } catch (error) {
    console.error('Error detecting face:', error);
    throw error;
  }
}

export async function compareFaces(faceDescriptor1: Float32Array, faceDescriptor2: Float32Array) {
  const distance = faceapi.euclideanDistance(faceDescriptor1, faceDescriptor2);
  // Lower distance means more similar faces
  return distance < 0.6; // Threshold for face matching
}

export function startVideo(videoElement: HTMLVideoElement) {
  return new Promise<void>((resolve, reject) => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoElement.srcObject = stream;
        resolve();
      })
      .catch(error => {
        console.error('Error accessing camera:', error);
        reject(error);
      });
  });
}

export function stopVideo(videoElement: HTMLVideoElement) {
  const stream = videoElement.srcObject as MediaStream;
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    videoElement.srcObject = null;
  }
} 