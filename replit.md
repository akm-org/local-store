# LOCALSTORE — Nike-Inspired E-Commerce

## Overview

Full-stack e-commerce app (pnpm monorepo). Minimal Nike.in-inspired design, black & white palette, bold Inter typography.

## Architecture

- **Frontend**: React + Vite (`artifacts/localstore`) — TypeScript, shadcn/ui, Tailwind CSS, wouter routing
- **Backend**: Express 5 API (`artifacts/api-server`) — TypeScript, PostgreSQL, Drizzle ORM
- **API layer**: OpenAPI spec in `lib/api-spec/`, auto-generated React Query hooks in `lib/api-client-react/`

## Pages

| Route | Page |
|---|---|
| `/` | Homepage (hero, categories, featured products) |
| `/shop` | Shop with category filter, search, sort |
| `/product/:id` | Product detail |
| `/cart` | Cart with qty controls |
| `/checkout` | Address + QR payment + UTR submission |
| `/orders` | Order history + tracking |
| `/wishlist` | Saved products |
| `/login` / `/signup` | Auth |
| `/admin/login` | Admin login (`admin` / `webdeveloper`) |
| `/admin` | Dashboard (stats + recent orders) |
| `/admin/products` | CRUD products |
| `/admin/orders` | Update order status |
| `/admin/payment` | Configure QR code + UPI ID |

## Database (PostgreSQL + Drizzle)

Tables: `users`, `products`, `cart_items`, `orders`, `order_items`, `wishlist`, `settings`

## Auth

- Users: JWT stored in `localStorage` (`ls_token`, `ls_user`)
- Admin: hardcoded `username=admin`, `password=webdeveloper`
- Admin flag: `ls_admin=true`

## Categories

Dress, Lifestyle, Essentials, Electronics, Accessories

## Key Commands

- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Express 5, Drizzle ORM, Zod, Orval codegen, esbuild
