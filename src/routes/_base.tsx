import { Navbar } from "@/components/blocks/navbar";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_base")({
  component: GeneralLayout,
});

function GeneralLayout() {
  return (
    <div className="flex flex-col min-h-dvh">
      <Navbar />
      <div className="max-w-2xl mx-auto flex-1 w-full">
        <Outlet />
      </div>
    </div>
  );
}
