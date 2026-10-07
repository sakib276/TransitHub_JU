# TransitHub JU Backend

## Run

Configure the MySQL connection in `.env` using `.env.example`, then run:

```powershell
npm install
npm run dev
```

## API reference

With the server running, browse to `http://localhost:5000/api-docs/` for Swagger UI or request `http://localhost:5000/api-docs/swagger.json` for the OpenAPI document. Swagger is generated from the `@swagger` route comments in `src/features/ride-request/routes/ride-request-routes.js` and the health endpoint comment in `src/app.js`.

## JSDoc

Generate the backend source reference with:

```powershell
npm run docs
```

The generated HTML is written to `docs/jsdoc/`.

## Tests

```powershell
npm test
```

## Lint

Run ESLint across the backend source and tests:

```powershell
npm run lint
```
