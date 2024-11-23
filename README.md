# Local-only calories tracker app

> You can read a full overview of the project: [Local-only calories tracker app](https://www.typeonce.dev/course/calories-tracker-local-only-app)

A new paradigm of building apps is coming to the web: **Local-first**.

One of the key components of a local-first app is having a **local data store**. [PGlite](https://pglite.dev/) brings the database to the client, allowing you to build apps completely offline.

In this project template we implement the first step before local-first: **Local-only**.

The project is a Vite app completely on the client. It uses PGlite as local `postgres` database to make the app work end-to-end on the user device.

## Tech stack
The project is built with **TanStack Router**, which offers complete type-safe routing on the client for React.

A local `postgres` database is created and managed using PGlite in combination with `drizzle` as ORM. The app includes the `live` extension of PGlite, which allow writing **reactive queries as normal React hooks**.

> `drizzle` is also responsible to manage migrations for local databases using `drizzle-kit`

The state of the app is managed using `xstate`. Each functionality is defined in a separate machine. The app makes heavy use of the **actor model** to combine reusable actors.

The structure and logic of the app is implemented using `effect`. All the logic is contained in isolated services that are combined inside layers and executed as part of TanStack Router `loaders` and `xstate` actors.

All the validation and serialization logic is also implemented using `Schema` from `effect`.

The app is styled using `tailwindcss` (v4). The components are based on `react-aria-components`, and the styles are applied using a combination of `clsx` and `class-variance-authority`. The icons in the app are from `lucide-react`.

***

The app can be built using `vite`. The `vite-plugin-pwa` plugin generates the required assets and service worker for the app to be **installable as a PWA on the device and work offline**.

## Project structure
The project is an overview of the app implementation. It highlights the most relevant details about each dependency and how to combine them to implement a client-only app.

Each module describes how a specific section of the app is structured:
- **Local database**: PGlite and `drizzle` form the data layer, together with `Schema` from `effect`
- **Live queries**: `live` extension of PGlite to read the database with real-time updates
- **Routing**: TanStack Router with type-safe routes and loaders
- **State management**: `xstate` using the actor model
- **UI**: `react-aria-components` in combination with `tailwindcss`

### What's missing to make the app local-first?
For an app to be local-first the implementation must start from the client.

> This project defines the first step: making the app independent of the server and completely functional on the client even without internet access.

The last step is *multi-device and collaboration support*. This could be achieved using a **sync engine**, which could be added to this project to sync the local database with a other devices.


***

## Prerequisites
The project used TypeScript as programming language, so at least a **basic knowledge of the language is required**.

Other than that, there are no special requirements. 

The app is client-side and works completely in the browser, so there is no complex configuration involved.

> In fact, the app is contained in a single `app` folder, without any server-side code.

A basic knowledge of `effect` is recommended to understand how the code is organized.

> You can take a quick look at the [Effect: Beginners Complete Getting Started course](https://www.typeonce.dev/course/effect-beginners-complete-getting-started) to get familiar with the basics of `effect`.

The local database setup using PGlite is explained in the course, so no previous knowledge is required.

All other components are mostly optional and interchangeable, so the course just briefly explains their benefits without assuming any prior knowledge. In fact, you could swap any of the other components with your own preferred libraries.