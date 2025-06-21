# University of Rwanda Voting System

A secure voting system using Face++ facial recognition for voter verification.

## Face++ Configuration

1. Sign up for a Face++ account at [https://www.faceplusplus.com/](https://www.faceplusplus.com/)
2. Create a new application to get your API Key and API Secret
3. Create a `.env.local` file in the root directory with the following variables:
   ```env
   NEXT_PUBLIC_FACEPP_API_KEY=your_api_key_here
   NEXT_PUBLIC_FACEPP_API_SECRET=your_api_secret_here
   ```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Secure facial recognition using Face++ API
- Real-time face detection and verification
- User registration with face enrollment
- Secure voting system
- Admin dashboard for election management
- Real-time election results

## Tech Stack

- Next.js 13 App Router
- TypeScript
- Tailwind CSS
- Face++ API for facial recognition
- PostgreSQL database
- Prisma ORM 