// Camera utility functions only (Face++ integration removed)

export async function startVideo(videoElement: HTMLVideoElement) {
  return new Promise<void>((resolve, reject) => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoElement.srcObject = stream;
        videoElement.onloadedmetadata = () => resolve();
      })
      .catch(error => {
        console.error('Error accessing camera:', error);
        reject(error);
      });
  });
}

export async function stopVideo(videoElement: HTMLVideoElement) {
  const stream = videoElement.srcObject as MediaStream;
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    videoElement.srcObject = null;
  }
}

export async function captureImage(videoElement: HTMLVideoElement): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');
  ctx.drawImage(videoElement, 0, 0);
  return canvas.toDataURL('image/jpeg');
} 