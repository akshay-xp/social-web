import { RouterProvider } from "@tanstack/react-router";
import { useAuth } from "./hooks/use-auth";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function Trunk() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
}
