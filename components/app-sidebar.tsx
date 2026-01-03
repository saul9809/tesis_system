"use client";
import * as React from "react";
import {
  IconDashboard,
  IconHelp,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
{
  /* --- Datos del Usuario --- */
}

{
  /*Ttrayendo al usuario actual en un props*/
}

{
  /* --- Datos del Usuario --- */
}

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Personal a procesar",
      url: "./staff",
      icon: IconUser,
    },
    /* {
      title: "Estados",
      url: "/status",
      icon: IconListLetters,
    },*/
  ],

  navSecondary: [
    //Ultima implementacion

    {
      title: "Configuraciones",
      url: "/staff",
      icon: IconSettings,
    },
    {
      //Pasar correo a soporte con problematica
      title: "Necesita ayuda?",
      url: "#",
      icon: IconHelp,
    },
  ],
  tools: [
    /* {
      name: "Clasificador de CVs",
      url: "/classifier-csv",
      icon: IconRobot,
    },*/
    {
      name: "Dashboard General",
      url: "/dashboard",
      icon: IconDashboard,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/dashboard">
                <img src="/logo.jpg" className="size-5!" />
                <span className="text-base font-semibold">
                  Selección & Contratación
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.tools} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
