# Trello Clone Server

This is a node server written in Typescript using Express responsible for the CRUD operations for the core Kanban board logic.

## Getting Started

1. Add a `.env` file based off the `.env.example`
2. Add a `.env.test` file and add the following values

   ```
   DATABASE_URL="postgresql://prisma:prisma@localhost:5433/tests"
   PORT=5000
   ```

3. Make sure you have run `yarn` and `yarn tsc` from the root of the monorepo

4. Make sure your local database is running

5. Run migrations `yarn migrate`

6. Run `yarn dev`

## Building the app

Run `yarn build` to create a `build` folder compiled Javascript.

## Testing

1. Make sure you have Docker desktop running
2. Make sure your `.env.test` is configured correctluy
3. Run `yarn test`
