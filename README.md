# Job Finder Application

A Next.js application for job searching and applying. Built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- Job search and filtering
- User authentication
- Job applications
- Internationalization (Turkish/English)
- Responsive design with Tailwind CSS
- Server-side rendering with Next.js

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- Git

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/enesbugrac/job-finder.git
cd job-finder
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://novel-project-ntj8t.ampt.app/api
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Testing

Run the end-to-end tests:

```bash
npm run test:e2e
# or
yarn test:e2e
```

## Project Structure

```
job-finder/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── [locale]/         # Localized routes
│   └── layout.tsx        # Root layout
├── components/            # React components
├── lib/                   # Utility functions and configurations
│   ├── api.ts            # Client-side API functions
│   ├── server/           # Server-side utilities
│   ├── store/           # Zustand store configurations
│   └── i18n/             # Internationalization setup
├── public/               # Static files
└── types/                # TypeScript type definitions
```

## Key Technologies

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Testing**: Playwright
- **Internationalization**: i18next
- **HTTP Client**: Axios
