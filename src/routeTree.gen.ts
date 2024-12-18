/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as DateImport } from './routes/$date'
import { Route as IndexImport } from './routes/index'
import { Route as PlanIndexImport } from './routes/plan/index'

// Create/Update Routes

const DateRoute = DateImport.update({
  id: '/$date',
  path: '/$date',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const PlanIndexRoute = PlanIndexImport.update({
  id: '/plan/',
  path: '/plan/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/$date': {
      id: '/$date'
      path: '/$date'
      fullPath: '/$date'
      preLoaderRoute: typeof DateImport
      parentRoute: typeof rootRoute
    }
    '/plan/': {
      id: '/plan/'
      path: '/plan'
      fullPath: '/plan'
      preLoaderRoute: typeof PlanIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/$date': typeof DateRoute
  '/plan': typeof PlanIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/$date': typeof DateRoute
  '/plan': typeof PlanIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/$date': typeof DateRoute
  '/plan/': typeof PlanIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/$date' | '/plan'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/$date' | '/plan'
  id: '__root__' | '/' | '/$date' | '/plan/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  DateRoute: typeof DateRoute
  PlanIndexRoute: typeof PlanIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  DateRoute: DateRoute,
  PlanIndexRoute: PlanIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/$date",
        "/plan/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/$date": {
      "filePath": "$date.tsx"
    },
    "/plan/": {
      "filePath": "plan/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
