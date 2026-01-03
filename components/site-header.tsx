"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./ui/mode-toggle";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

//Mapeando el header segun la ruta actual
const TITLE_MAP: Record<string, string> = {
  staff: "Personal",
  dashboard: "Dashboard",
};

export function SiteHeader() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const root = segments[0] ?? "";

  //Actualizando el titulo de forma optima
  const title = useMemo(() => {
    if (!root) return "Home";
    return TITLE_MAP[root] ?? "Home";
  }, [root]);
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <ModeToggle />
          </Button>
        </div>
      </div>
    </header>
  );
}
