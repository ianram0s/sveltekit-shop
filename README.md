# sveltekit-shop

> ⚠️ **Demo project with basic functionality and not production‑ready.**
>
> Intended for demos and learning; not a full real‑world online shop. It omits many production features (payments, security hardening, scalability, edge cases).

## Tech Stack

- **SvelteKit** - the framework
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) and components by [shadcn-svelte](https://ui.shadcn.com/)
- **Authentication:** [better-auth](https://github.com/ianram0s/better-auth) (with Drizzle adapter)
- **Database:** [drizzle-orm](https://orm.drizzle.team/) + PostgreSQL
- **Utils:** [Superforms](https://superforms.rocks/) and [zod](https://zod.dev/) for synced client/server-side form validation

> **The design is inspired by this [Figma e-commerce template](https://www.figma.com/community/file/1273571982885059508/e-commerce-website-template-freebie).**

---

## Getting Started

Follow these steps to get your local environment up and running:

1. **Copy and configure environment variables:**

    ```bash
    cp .env.example .env
    # Edit .env and update:
    # - DATABASE_URL
    # - BETTER_AUTH_SECRET
    # - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
    ```

2. **Install dependencies and start the database:**

    ```bash
    pnpm install         # Install project dependencies
    pnpm run db:start    # Start PostgreSQL via Docker Compose
    ```

3. **Run database migrations and seeders:**

    ```bash
    pnpm run db:migrate  # Run database migrations
    pnpm run db:seed     # Seed the database with initial data
    ```

4. **Start the development server:**

    ```bash
    pnpm run dev         # Start the dev server
    ```

> Or use `npm`/`yarn` if you prefer!

## Building

To create a production build:

```bash
pnpm run build
```

Preview it with:

```bash
pnpm run preview
```

## License

MIT (see [LICENSE](./LICENSE))
