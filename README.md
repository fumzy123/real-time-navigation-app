# Real-Time Navigation App

## Overview

**Real-Time Navigation App** is a frontend web application built in React and TypeScript for live, map-based navigation. It enables users to search locations, view interactive maps, and experience seamless route tracking through a modern interface. The architecture leverages efficient state management, data fetching, and routing to deliver real-time navigation features.

## Features

### 🌟 Core Features

- **Location Search:** Users can input and search locations, with autocomplete powered by Mapbox.
- **Interactive Map Display:** Visualizes user position, destinations, and routes on a responsive map.
- **Routing and Directions:** Calculates routes and updates them live as locations change.
- **Live Location Tracking:** Continuously tracks and displays user location updates.
- **Page Navigation:** Multi-page app structure for seamless transitions and feature separation.
- **State Synchronization:** Consistent data and UI state using Zustand and React Query.

---

## Technology Stack

- **Languages:** TypeScript, JavaScript
- **Framework:** React
- **Build Tool:** Vite
- **State Management:** Zustand, React Query
- **Map Service:** Mapbox
- **Routing:** React Router
- **Testing & Linting:** ESLint, TypeScript

---

## Dependency List for Real-Time Navigation App

The following packages are implemented in the codebase:

### Main Dependencies

| Package                            | Usage                                                        |
| ---------------------------------- | ------------------------------------------------------------ |
| **@mapbox/search-js-react**        | Location search & autocomplete in the UI (Mapbox-powered).   |
| **@tanstack/react-query**          | Data fetching and server state caching for API interactions. |
| **@tanstack/react-query-devtools** | React Query devtools for debugging data fetching and cache.  |
| **axios**                          | HTTP client for making API calls.                            |
| **react**                          | Main library for building UI components.                     |
| **react-dom**                      | Used for rendering React components into the DOM.            |
| **react-router**                   | Enables multi-page navigation within the single-page app.    |
| **zustand**                        | State management for UI and application state.               |

### DevDependencies

| Package                         | Usage                                                            |
| ------------------------------- | ---------------------------------------------------------------- |
| **@eslint/js**                  | ESLint functionality for linting JS/TS code.                     |
| **@types/node**                 | TypeScript types for Node.js APIs.                               |
| **@types/react**                | TypeScript types for React.                                      |
| **@types/react-dom**            | TypeScript types for React DOM.                                  |
| **@vitejs/plugin-react-swc**    | Vite plugin to optimize React compilation.                       |
| **eslint**                      | Linter for code style and quality.                               |
| **eslint-plugin-react-hooks**   | Additional ESLint rules for React Hooks.                         |
| **eslint-plugin-react-refresh** | ESLint integration for React Fast Refresh.                       |
| **globals**                     | Definitions for global JS variables.                             |
| **typescript**                  | Compiler for TypeScript.                                         |
| **typescript-eslint**           | Type-aware ESLint integration for TS.                            |
| **vite**                        | Build tool for fast development and optimized production builds. |

---

## How Dependencies Are Used

- **UI and State:** Built with React, Zustand for local state, and React Query for server state.
- **Routing:** Managed with React Router, allowing multi-page navigation.
- **Location Search:** Mapbox integration provides address lookup and geocoding.
- **API Calls:** axios is used for requesting remote resources.
- **Development Experience:** ESLint and plugins enforce code quality, Vite enables fast builds, and TypeScript gives strong typing.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18.x
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- (Optional) [Docker](https://www.docker.com/) for containerization

### Installation

```bash
git clone https://github.com/fumzy123/real-time-navigation-app.git
cd real-time-navigation-app
npm install
```

### Running the App

#### Development

```bash
npm run dev
```

#### Production

```bash
npm run build
npm run preview
```

### Environment Variables

Create a `.env` file in the project root, for example:

```
REACT_APP_MAP_API_KEY=your_map_api_key
REACT_APP_ENV=development
```

---

## Usage

1. Launch the app.
2. Search for a location.
3. View your route and navigation updates in real time.
4. Interact with the map and follow directions.

---

## Project Structure

```
real-time-navigation-app/
├── src/
│   ├── app/
│   ├── assets/
│   ├── entities/
│   ├── features/
│   ├── pages/
│   ├── shared/
│   └── main.tsx
├── package.json
└── README.md
```

---

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes.
4. Push to your branch (`git push origin feature/my-feature`)
5. Open a Pull Request.

See [CONTRIBUTING.md](CONTRIBUTING.md) if available.

---

## License

See [LICENSE](LICENSE) for details.

## Maintainers

- [fumzy123](https://github.com/fumzy123)

For feedback or support, open an [Issue](https://github.com/fumzy123/real-time-navigation-app/issues).

---
