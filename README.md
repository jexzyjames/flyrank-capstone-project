# flyrank-capstone-project

## About

FlyRank is a capstone project. Its frontend is planned with React, Vite, Tailwind CSS, and TypeScript, with setup scheduled for FE-04.

## Profile settings

The React settings page lets users update their name and email, and optionally
set a new password. Email addresses must be valid; new passwords must be at
least 12 characters and include an uppercase letter, a lowercase letter, a
number, and a symbol. Passwords are left unchanged when the field is blank.

The form exposes profile loading, save progress, success, and error states.
Each field is controlled and has an explicit label and an accessible name.

## Development

- `npm run dev` starts the Vite development server.
- `npm test` runs validation unit tests and settings form integration tests.
- `npm run build` type-checks the application and creates a production build.