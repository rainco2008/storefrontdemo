# Storefront Demo

Astro + React storefront demo targeting Cloudflare Workers.

The app is currently wired to local mock commerce data so it can run, test, build, and deploy without a backend service. The data boundary is intentionally kept behind the `storefront:client` alias, which makes it straightforward to replace the mock client with Payload CMS or another commerce API later.

## Stack

- Astro `6.4.6` with server output
- React `19.2.7` for interactive islands
- TanStack React Query `5.101.0` for cart-side client state and mutations
- Tailwind CSS `3.4.19`
- Cloudflare Workers via `@astrojs/cloudflare` `13.7.0`
- Wrangler `4.100.0`
- Stripe `22.2.1` for optional checkout
- Zod `4.4.3`
- Biome, Astro Check, TypeScript, Vitest, and Playwright

Node.js `22.12.0` or newer is expected. The package manager is pinned to `pnpm@9.10.0`.

## Current Behavior

The storefront uses `src/lib/client.mock.ts` by default. This is configured in `tsconfig.json`:

```json
{
	"compilerOptions": {
		"paths": {
			"storefront:client": ["./src/lib/client.mock.ts"]
		}
	}
}
```

The mock client provides products, collections, customers, and orders. Product listing, collection pages, product detail pages, cart interactions, and the order success page can all work without Payload CMS or a separate Storefront API.

Checkout is optional. If Stripe environment variables are not configured, the checkout API returns `503` instead of blocking build or deployment.

## Project Layout

```text
public/                 Static assets
src/actions/            Astro actions
src/components/         Shared layout and UI components
src/features/cart/      Cart actions, queries, store, and React islands
src/features/product/   Product display and carousel islands
src/lib/                Data clients, schemas, utilities, and tests
src/pages/              Astro file routes and API routes
src/styles.css          Global styles
astro.config.ts         Astro integrations and Cloudflare adapter
playwright.config.ts    E2E test configuration
wrangler.toml           Cloudflare Workers project configuration
```

## Routes

- `/` - home page
- `/products/[product]` - product detail
- `/collections/[collection]` - collection detail
- `/orders/[order]` - order success page
- `/api/checkout` - Stripe checkout session endpoint
- `/api/checkout/success` - checkout success callback
- `/404` and `/500` - error pages

## Development

Install dependencies:

```sh
pnpm install
```

Start the local dev server:

```sh
pnpm dev
```

Run the main checks:

```sh
pnpm lint
pnpm vitest run
pnpm build
```

Run Playwright E2E tests:

```sh
pnpm test:e2e
```

On a fresh Linux or WSL machine, Playwright may also need browser and system dependencies:

```sh
pnpm exec playwright install
sudo pnpm exec playwright install-deps
```

## Scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start Astro dev server |
| `pnpm build` | Build the Cloudflare Workers output |
| `pnpm deploy:workers` | Build and deploy with Wrangler |
| `pnpm lint` | Run Astro sync, Biome, Astro Check, and TypeScript build |
| `pnpm vitest run` | Run unit tests once |
| `pnpm test:e2e` | Run Playwright tests |
| `pnpm format` | Run Biome and Prettier formatting |

## Environment Variables

No environment variables are required for the mock storefront to build.

Stripe checkout:

| Variable | Purpose |
| --- | --- |
| `STRIPE_SECRET_KEY` | Stripe server secret key |
| `US_SHIPPING_RATE_ID` | Stripe shipping rate for US orders |
| `INTERNATIONAL_SHIPPING_RATE_ID` | Stripe shipping rate for non-US orders |

Transactional email:

| Variable | Purpose |
| --- | --- |
| `LOOPS_API_KEY` | Loops API key |
| `LOOPS_SHOP_TRANSACTIONAL_ID` | Customer order email template |
| `LOOPS_FULFILLMENT_TRANSACTIONAL_ID` | Fulfillment notification template |
| `LOOPS_FULFILLMENT_EMAIL` | Fulfillment recipient email |

Maps and analytics:

| Variable | Purpose |
| --- | --- |
| `GOOGLE_GEOLOCATION_SERVER_KEY` | Server-side geolocation key |
| `PUBLIC_GOOGLE_MAPS_BROWSER_KEY` | Browser Google Maps key |
| `PUBLIC_FATHOM_SITE_ID` | Fathom analytics site ID |

Only variables prefixed with `PUBLIC_` are exposed to browser code.

## Cloudflare Deployment

The app is configured for Cloudflare Workers through `@astrojs/cloudflare`.

Deploy from a local authenticated Wrangler session:

```sh
pnpm wrangler login
pnpm deploy:workers
```

Cloudflare Git integration settings:

| Setting | Value |
| --- | --- |
| Build command | `pnpm build` |
| Deploy command | `pnpm deploy:workers` |
| Node.js version | `22.12.0` or newer |

The deploy script runs `pnpm build` first, then deploys the generated Workers config:

```sh
wrangler deploy --config dist/server/wrangler.json
```

## Wrangler Punycode Patch

Node.js emits `[DEP0040]` when a package loads the built-in `punycode` module. In this project the warning came from `wrangler@4.100.0`, whose bundled CLI includes old `whatwg-url` and `tr46` code that calls `require("punycode")`.

The repository carries a pnpm patch at `patches/wrangler@4.100.0.patch` that replaces those bundled calls with a small compatibility object backed by Node's stable `node:url` domain conversion APIs. This removes the Node deprecation warning during `pnpm build` without suppressing warnings globally.

If Wrangler is upgraded, re-test `pnpm build`. If upstream has removed the deprecated call, the local patch can be dropped.

## Replacing Mock Data

Keep application code pointed at `storefront:client`. To connect Payload CMS or another backend, add a compatible client such as:

```text
src/lib/client.payload.ts
```

Then update the alias:

```diff
{
	"compilerOptions": {
		"paths": {
-			"storefront:client": ["./src/lib/client.mock.ts"]
+			"storefront:client": ["./src/lib/client.payload.ts"]
		}
	}
}
```

The replacement client should preserve the functions currently used by pages and server actions, including product, collection, customer, and order operations.
