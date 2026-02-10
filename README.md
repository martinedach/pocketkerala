## PocketKerala

Next.js app scaffolded for PocketKerala, with a small Linear API demo endpoint.

## Getting Started

### 1) Install

```bash
npm install
```

### 2) Configure env

Copy `.env.example` to `.env.local` and set:

- `LINEAR_API_KEY`

### 3) Run dev server

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Linear demo

- `GET /api/linear/me` returns the authenticated Linear viewer (uses `LINEAR_API_KEY`).
- Visit `/linear` to see the JSON rendered.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
