# University of Rwanda Voting System

A secure online voting system for the University of Rwanda, featuring facial recognition for voter verification using AWS Rekognition.

## Face Verification

This application uses AWS Rekognition for face verification. Voters are required to verify their identity using their webcam before accessing the voting dashboard. The captured image is sent to the backend, which uses AWS Rekognition to compare the live image with the user's registered face image.

### How Face Verification Works
- When a user logs in, the system activates their webcam and displays a live video feed.
- After a short countdown, the system automatically captures an image from the webcam.
- The captured image is sent to the backend (`/api/verify-face`), where it is compared against the user's registered face image using AWS Rekognition.
- If the face matches, the user is authenticated and granted access to the dashboard. If not, the process restarts and the user is prompted to try again.

### Requirements for Running Locally or in Production
- **AWS Account:** You must have an AWS account with Rekognition enabled and the necessary credentials configured.
- **Webcam Access:** Users must allow access to their device's webcam for face verification to work.
- **Browser Support:** The application requires a modern browser that supports the MediaDevices API (most recent versions of Chrome, Firefox, Edge, and Safari).
- **Node.js Environment:** The backend face verification logic runs in a Node.js environment and communicates with AWS Rekognition.
- **Image Storage:** Registered face images are stored securely on the server or in an AWS S3 bucket.
- **HTTPS:** For production deployments, HTTPS is required to access the webcam and ensure user privacy and security.
- **Environment Variables:** You must configure your AWS credentials and S3 bucket information in your environment variables.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

2. Set up your AWS credentials and S3 bucket information in a `.env.local` file:
   ```env
   AWS_ACCESS_KEY_ID=your_access_key_id
   AWS_SECRET_ACCESS_KEY=your_secret_access_key
   AWS_REGION=your_aws_region
   S3_BUCKET_NAME=your_s3_bucket_name
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Secure facial recognition using AWS Rekognition
- Real-time face detection and automatic verification during login
- User registration with face enrollment
- Secure, role-based voting system
- Admin dashboard for election management
- Real-time election results and analytics

## Tech Stack

- Next.js 13 App Router
- TypeScript
- Tailwind CSS
- AWS Rekognition for face verification
- AWS S3 for image storage
- PostgreSQL database
- Prisma ORM
