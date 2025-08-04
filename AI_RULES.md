# AI Rules for Equidade+ Application

This document outlines the technical stack and guidelines for developing the Equidade+ web application.

## Tech Stack Overview

*   **React:** A JavaScript library for building user interfaces.
*   **TypeScript:** A superset of JavaScript that adds static typing, enhancing code quality and maintainability.
*   **React Router:** Used for declarative routing within the single-page application.
*   **Supabase:** Our backend-as-a-service, providing authentication, a PostgreSQL database, and file storage.
*   **React Query (`@tanstack/react-query`):** Manages server state, simplifying data fetching, caching, and synchronization.
*   **Tailwind CSS:** A utility-first CSS framework for rapid and consistent styling.
*   **shadcn/ui:** A collection of reusable UI components built with Radix UI and styled with Tailwind CSS, providing accessibility and a consistent look.
*   **Lucide React (`lucide-react`):** A library of beautiful and customizable open-source icons.
*   **React Hook Form & Zod:** For efficient form management and robust schema-based validation.
*   **Sonner & shadcn/ui Toast:** For elegant and accessible toast notifications.
*   **date-fns:** A modern JavaScript date utility library for parsing, validating, manipulating, and formatting dates.

## Library Usage Guidelines

To maintain consistency, performance, and best practices, please adhere to the following rules when developing:

*   **Core UI:** Always use **React** for building components.
*   **Type Safety:** All new code should be written in **TypeScript**.
*   **Routing:** Use **React Router** for all navigation and route definitions (keep main routes in `src/App.tsx`).
*   **Backend Interaction:** Interact with the backend exclusively through **Supabase**.
*   **Data Management:** For all data fetching, caching, and synchronization with Supabase, use **React Query**.
*   **Styling:** Apply all styling using **Tailwind CSS** classes. Avoid writing custom CSS unless it's for global styles in `src/App.css` or `src/index.css`.
*   **UI Components:** Prioritize using components from **shadcn/ui**. If a component needs customization, create a new component that wraps or extends the `shadcn/ui` component, rather than modifying the original `src/components/ui` files.
*   **Icons:** Use icons from **Lucide React**.
*   **Forms & Validation:** Implement forms using **React Hook Form** and validate inputs with **Zod** schemas.
*   **Notifications:** For transient messages (success, error, info), use the **Sonner** library and the **shadcn/ui Toast** component (via `useToast` hook).
*   **Date Manipulation:** Use **date-fns** for any date-related operations.
*   **File Structure:**
    *   Source code must reside in the `src` folder.
    *   Pages should be placed in `src/pages/`.
    *   Reusable components should be placed in `src/components/`.
    *   New components should always be created in their own dedicated files. Avoid adding new components to existing files.
    *   Directory names must be all lower-case.
*   **Responsiveness:** All designs must be responsive, utilizing Tailwind CSS utilities for different screen sizes.
*   **Error Handling:** Do not use `try/catch` blocks for API calls unless specifically requested. Errors should be allowed to bubble up for centralized handling and debugging.
*   **Simplicity:** Prioritize simple and elegant solutions. Avoid over-engineering.