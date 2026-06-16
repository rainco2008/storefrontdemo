# Storefront Demo

这是一个基于 Astro + React 的商城前端示例项目，目标运行环境是 Cloudflare Workers。

当前项目默认使用本地 mock 商城数据，因此不依赖 Payload CMS、原始 Storefront API 或其他后端服务，也可以完成本地开发、测试、构建和部署。数据访问被收敛在 `storefront:client` 这个别名后面，后续接入 Payload CMS 或其他 Commerce API 时，只需要替换这个客户端实现。

## 技术栈

- Astro `6.4.6`，使用 server output
- React `19.2.7`，用于局部交互组件
- TanStack React Query `5.101.0`，用于购物车侧的客户端状态和 mutation
- Tailwind CSS `3.4.19`
- `@astrojs/cloudflare` `13.7.0`，用于 Cloudflare Workers 适配
- Wrangler `4.100.0`
- Stripe `22.2.1`，用于可选 checkout 流程
- Zod `4.4.3`
- Biome、Astro Check、TypeScript、Vitest、Playwright

要求 Node.js `22.12.0` 或更高版本。包管理器固定为 `pnpm@9.10.0`。

## 当前状态

项目默认使用 `src/lib/client.mock.ts` 作为数据来源。这个配置位于 `tsconfig.json`：

```json
{
	"compilerOptions": {
		"paths": {
			"storefront:client": ["./src/lib/client.mock.ts"]
		}
	}
}
```

mock client 提供商品、集合、客户和订单数据。商品列表、集合页、商品详情页、购物车交互和订单成功页都可以在没有后端服务的情况下运行。

checkout 是可选能力。如果没有配置 Stripe 环境变量，checkout API 会返回 `503`，但不会阻塞站点构建或部署。

## 项目结构

```text
public/                 静态资源
src/actions/            Astro actions
src/components/         通用布局和 UI 组件
src/features/cart/      购物车 actions、queries、store 和 React islands
src/features/product/   商品展示和轮播相关 islands
src/lib/                数据客户端、schema、工具函数和测试
src/pages/              Astro 文件路由和 API 路由
src/styles.css          全局样式
astro.config.ts         Astro integrations 和 Cloudflare adapter 配置
playwright.config.ts    E2E 测试配置
wrangler.toml           Cloudflare Workers 项目配置
```

## 路由

- `/` - 首页
- `/products/[product]` - 商品详情页
- `/collections/[collection]` - 集合详情页
- `/orders/[order]` - 订单成功页
- `/api/checkout` - Stripe checkout session 接口
- `/api/checkout/success` - checkout 成功回调
- `/404` 和 `/500` - 错误页

## 本地开发

安装依赖：

```sh
pnpm install
```

启动开发服务器：

```sh
pnpm dev
```

运行主要检查：

```sh
pnpm lint
pnpm vitest run
pnpm build
```

运行 Playwright E2E 测试：

```sh
pnpm test:e2e
```

在新的 Linux 或 WSL 环境中，Playwright 可能还需要安装浏览器和系统依赖：

```sh
pnpm exec playwright install
sudo pnpm exec playwright install-deps
```

## 常用脚本

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动 Astro 开发服务器 |
| `pnpm build` | 构建 Cloudflare Workers 输出 |
| `pnpm deploy:workers` | 构建并通过 Wrangler 部署 |
| `pnpm lint` | 运行 Astro sync、Biome、Astro Check 和 TypeScript build |
| `pnpm vitest run` | 运行一次单元测试 |
| `pnpm test:e2e` | 运行 Playwright 测试 |
| `pnpm format` | 运行 Biome 和 Prettier 格式化 |

## 环境变量

mock storefront 不需要任何环境变量即可构建。

Stripe checkout：

| 变量名 | 说明 |
| --- | --- |
| `STRIPE_SECRET_KEY` | Stripe 服务端密钥 |
| `US_SHIPPING_RATE_ID` | 美国订单配送费率 |
| `INTERNATIONAL_SHIPPING_RATE_ID` | 非美国订单配送费率 |

交易邮件：

| 变量名 | 说明 |
| --- | --- |
| `LOOPS_API_KEY` | Loops API key |
| `LOOPS_SHOP_TRANSACTIONAL_ID` | 客户订单邮件模板 |
| `LOOPS_FULFILLMENT_TRANSACTIONAL_ID` | 履约通知邮件模板 |
| `LOOPS_FULFILLMENT_EMAIL` | 履约通知收件邮箱 |

地图和统计：

| 变量名 | 说明 |
| --- | --- |
| `GOOGLE_GEOLOCATION_SERVER_KEY` | 服务端 geolocation key |
| `PUBLIC_GOOGLE_MAPS_BROWSER_KEY` | 浏览器端 Google Maps key |
| `PUBLIC_FATHOM_SITE_ID` | Fathom analytics site ID |

只有以 `PUBLIC_` 开头的变量会暴露给浏览器端代码。

## Cloudflare 部署

项目通过 `@astrojs/cloudflare` 配置为 Cloudflare Workers 应用。

本地通过 Wrangler 登录并部署：

```sh
pnpm wrangler login
pnpm deploy:workers
```

Cloudflare Git 集成建议配置：

| 配置项 | 值 |
| --- | --- |
| Build command | `pnpm build` |
| Deploy command | `pnpm deploy:workers` |
| Node.js version | `22.12.0` 或更高 |

部署脚本会先执行 `pnpm build`，然后使用 Astro 生成的 Workers 配置部署：

```sh
wrangler deploy --config dist/server/wrangler.json
```

## Wrangler Punycode 补丁

当某个包加载 Node 内置的 `punycode` 模块时，Node.js 会输出 `[DEP0040]` deprecation warning。本项目中的警告来自 `wrangler@4.100.0`，它打包的 CLI 中包含旧版 `whatwg-url` 和 `tr46` 代码，这些代码会调用 `require("punycode")`。

仓库中包含 pnpm patch：`patches/wrangler@4.100.0.patch`。这个补丁将 Wrangler 打包代码里的 deprecated `punycode` 调用替换为一个基于 Node 稳定 `node:url` 域名转换 API 的兼容对象。这样可以在不全局屏蔽 warning 的前提下，消除 `pnpm build` 阶段的 Node deprecation warning。

如果后续升级 Wrangler，需要重新运行 `pnpm build` 验证。如果上游已经移除 deprecated 调用，可以删除这个本地 patch。

## 替换 Mock 数据

应用代码应继续通过 `storefront:client` 访问数据。接入 Payload CMS 或其他后端时，可以新增一个兼容客户端，例如：

```text
src/lib/client.payload.ts
```

然后更新 alias：

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

替换客户端需要保持页面和 server actions 当前依赖的函数接口，包括商品、集合、客户和订单相关操作。
