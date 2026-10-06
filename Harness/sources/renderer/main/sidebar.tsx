import {
  Sidebar,
  SidebarFooter,
  SidebarList,
  SidebarListItem,
  Status,
} from "@glaze/core/components";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Blocks, Puzzle, Server } from "lucide-react";

import { api, TOOLS } from "../lib/api";

const SECTIONS = [
  { path: "/mcp", title: "MCP Servers", icon: Server, countKey: "mcp" as const },
  { path: "/skills", title: "Skills", icon: Puzzle, countKey: "skills" as const },
  { path: "/plugins", title: "Plugins", icon: Blocks, countKey: "plugins" as const },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const overview = useQuery({ queryKey: ["overview"], queryFn: api.overview });
  const skills = useQuery({ queryKey: ["skills"], queryFn: api.skills });
  const plugins = useQuery({ queryKey: ["plugins"], queryFn: api.plugins });

  const counts = {
    mcp: overview.data?.rows.length,
    skills: skills.data?.length,
    plugins: plugins.data?.length,
  };

  return (
    <Sidebar
      footer={
        <SidebarFooter>
          <div className="flex flex-col gap-1 px-3 pb-2">
            <p className="text-small text-tertiary">Tools</p>
            {TOOLS.map((tool) => {
              const status = overview.data?.tools.find((entry) => entry.id === tool.id);
              const installed = status?.installed ?? false;
              return (
                <div key={tool.id} className="flex items-center justify-between gap-2">
                  <span className="text-small text-secondary">{tool.label}</span>
                  <Status variant={installed ? "success" : "neutral"}>
                    {status?.error ? "Error" : installed ? "Found" : "Missing"}
                  </Status>
                </div>
              );
            })}
          </div>
        </SidebarFooter>
      }
    >
      <SidebarList>
        {SECTIONS.map((section) => (
          <SidebarListItem
            key={section.path}
            icon={<section.icon />}
            title={section.title}
            accessory={counts[section.countKey]}
            selected={pathname === section.path}
            onClick={() => navigate({ to: section.path })}
          />
        ))}
      </SidebarList>
    </Sidebar>
  );
}
