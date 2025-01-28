# Cyclon

A Git stats application with Clerk authentication.

## Prerequisites

- Node.js (v18 or higher)
- pnpm

## Setup

1. Clone the repository:

```bash
git clone https://github.com/thewbuk/gitstats
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

## Authentication Options

GitStats offers two authentication methods:

### 1. Clerk Authentication (Recommended)

- Navigate to `/` to use Clerk authentication
- Sign up/Sign in with your email or social providers
- Provides full user management and security features

### 2. GitHub Token Authentication

- Navigate to `/github-auth` to use GitHub token authentication
- You'll need to create a Personal Access Token (PAT) from GitHub
- Required token scopes:
  - `repo` - For repository access
  - `read:user` - For user profile information
  - `read:org` - For organization data

To create a GitHub PAT:

1. Go to [GitHub Settings > Developer Settings > Personal Access Tokens](https://github.com/settings/tokens/new)
2. Generate a new token with the required scopes
3. Copy the token and paste it in the GitStats token input field

Note: The GitHub token is stored securely in your browser's localStorage. Clear your browser data to remove it.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run linting
