# TAZEKOY Frontend

## Local development

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Start development server:

```bash
npm run dev
```

The app runs on `http://localhost:5173`.

## API proxy configuration

`VITE_API_PROXY_TARGET` controls where `/api` requests are proxied in development.

Default value:

```env
VITE_API_PROXY_TARGET=http://localhost:5001
```
