# Cyclon

A Git stats application with Clerk authentication.

## Prerequisites

- Node.js (v18 or higher)
- pnpm

## Setup

1. Clone the repository:

```bash
git clone <https://github.com/thewbuk/gitstats>
cd gitstats
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env.local` file in the root directory with the following Clerk environment variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/signin
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
```

4. Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Authentication Flow

- Sign Up: `/signup`
- Sign In: `/signin`
- SSO Callback: `/signup#/sso-callback`

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run linting
