# RouteRight AI - Frontend

Professional decision-support frontend interface for IT service-desk incident reassignment risk prediction. Built as part of **IT3051 Fundamentals of Data Mining**.

## Stack & Architecture

- **Framework**: React 18 + Vite
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v6)
- **Form & Validation**: React Hook Form + Zod
- **Networking**: Axios
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library + Jest DOM
- **Code Quality**: ESLint + Prettier

## Prerequisites

- Node.js: `v20+` or `v22+` (LTS recommended)
- npm: `v10+`

## Getting Started

1. Navigate to the frontend directory:
   ```bash
   cd app/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   By default:
   - `VITE_API_BASE_URL=http://localhost:8000`
   - `VITE_API_BASE_URL=http://localhost:8000` (FastAPI backend URL)

4. Start development server:
   ```bash
   npm run dev
   ```

## Development Scripts

| Command | Description |
|---|---|
| `npm run dev` | Launch Vite local dev server with HMR |
| `npm run build` | Type-check and compile production bundle |
| `npm run preview` | Locally preview the production build |
| `npm run lint` | Run ESLint across TypeScript source files |
| `npm run format` | Auto-format source code with Prettier |
| `npm run format:check` | Verify formatting without modifying files |
| `npm test` | Run Vitest test suites once |
| `npm run test:watch` | Run Vitest in interactive watch mode |

## Directory Structure

```text
src/
├── api/          # HTTP client, prediction & options endpoints
├── components/   # Reusable UI elements
│   ├── common/   # Button, Card, FormField, ErrorBanner, LoadingSpinner
│   ├── form/     # SearchableSelect, Ticket sections
│   └── prediction/# PredictionForm, PredictionResult, PredictionSkeleton
├── hooks/        # Custom React hooks (usePrediction, useTicketOptions)
├── layouts/      # Application shell and responsive layout (AppLayout)
├── mocks/        # Centralized mock options and prediction responses
├── pages/        # Route pages (Home, Predict, About, NotFound)
├── schemas/      # Zod validation schemas
├── types/        # TypeScript contracts (PredictionFormData, API types)
└── utils/        # Error normalization and formatting utilities
```
