# Frontend Application

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration.

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
frontend/
├── app/          # Next.js 13+ app directory
├── components/   # Reusable UI components
├── lib/          # Utility functions and shared logic
├── public/       # Static assets
└── styles/       # Global styles and CSS modules
```

## Key Features

- Modern React with Next.js 13+
- TypeScript for type safety
- Tailwind CSS for styling
- Authentication system
- API integration with backend services

## Development Guidelines

- Follow the established folder structure
- Use TypeScript for all new components
- Follow component naming conventions
- Write unit tests for critical components

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## Deployment

The application is deployed on [Vercel Platform](https://vercel.com). For deployment details, check our [deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
