"use client";

import { LucideIcon, ChevronLeft, ChevronRight, Power } from "lucide-react";
import { Modal, ModalContent, ModalTrigger } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface SidebarLink {
  title: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  openByDefault?: boolean;
  children?: SidebarLink[];
}

interface SidebarProps {
  title: string;
  icon: LucideIcon;
  links: SidebarLink[];
  extraComps?: React.ReactNode;
  onLogout: () => Promise<void>;
  error?: string;
  isPending?: boolean;
}

function getLinkState(
  link: SidebarLink,
  pathname: string
): "active" | "ancestor" | "inactive" {
  const isActive = link.exact
    ? pathname === link.href
    : pathname === link.href || pathname.startsWith(`${link.href}/`);

  if (isActive) return "active";

  if (link.children?.some((child) => getLinkState(child, pathname) !== "inactive")) {
    return "ancestor";
  }

  return "inactive";
}

export function GenericSidebar({
  title,
  links,
  error,
  onLogout,
  isPending,
  extraComps,
  icon: TitleIcon
}: SidebarProps) {
  const pathname = usePathname();

  const [logoutOpen, setLogoutOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [expandedLinks, setExpandedLinks] = useState<Record<string, boolean>>(
    {}
  );

  const navClass = (link: SidebarLink) => {
    const state = getLinkState(link, pathname);

    return cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-300",
      state === "active" && "bg-primary/10 text-primary font-medium",
      state === "ancestor" && "bg-primary/5 text-primary/70 font-medium",
      state === "inactive" &&
        "text-muted-foreground hover:bg-muted hover:text-foreground"
    );
  };

  const SidebarItem = ({
    link,
    level = 0
  }: {
    link: SidebarLink;
    level?: number;
  }) => {
    const hasChildren = !!link.children?.length;
    const isAncestor = getLinkState(link, pathname) === "ancestor";
    const isOpen =
      expandedLinks[link.href] ?? (link.openByDefault || isAncestor);
    const renderContent = () => (
      <>
        <link.icon className="h-5 w-5 shrink-0" />
        <span
          className={cn(
            "overflow-hidden whitespace-nowrap transition-all duration-300",
            collapsed ? "max-w-0 opacity-0" : "max-w-50 opacity-100"
          )}
        >
          {link.title}
        </span>
      </>
    );

    const commonStyles = !collapsed
      ? { paddingLeft: `${12 + level * 16}px` }
      : undefined;
    const commonClasses = cn(navClass(link), "w-full text-left");

    return (
      <>
        <div className="relative flex items-center">
          {hasChildren ? (
            <button
              type="button"
              className={commonClasses}
              title={link.title}
              style={commonStyles}
              onClick={() => {
                if (!collapsed) {
                  setExpandedLinks((prev) => ({
                    ...prev,
                    [link.href]: !isOpen
                  }));
                }
              }}
            >
              {renderContent()}
            </button>
          ) : (
            <Link
              href={link.href}
              className={commonClasses}
              title={link.title}
              style={commonStyles}
            >
              {renderContent()}
            </Link>
          )}

          {hasChildren && !collapsed && (
            <div className="text-muted-foreground pointer-events-none absolute right-2">
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isOpen && "rotate-90"
                )}
              />
            </div>
          )}
        </div>

        {hasChildren &&
          !collapsed &&
          isOpen &&
          link.children!.map((child) => (
            <SidebarItem key={child.href} link={child} level={level + 1} />
          ))}
      </>
    );
  };

  if (isPending) {
    return (
      <aside
        className={cn(
          "border-border bg-card/50 sticky top-0 flex h-screen animate-pulse flex-col border-r p-4 backdrop-blur-sm",
          collapsed ? "w-20" : "w-72"
        )}
      >
        <div className="bg-muted mb-6 h-6 w-32 rounded" />
        <div className="flex-1 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-muted h-9 w-full rounded-lg" />
          ))}
        </div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside
        className={cn(
          "border-border bg-card/50 sticky top-0 flex h-screen flex-col items-center justify-center border-r p-4 text-center backdrop-blur-sm",
          collapsed ? "w-20" : "w-72"
        )}
      >
        <p className="text-destructive px-2 text-xs font-medium">
          {collapsed ? "⚠️" : error}
        </p>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "border-border bg-card/50 sticky top-0 flex h-screen flex-col border-r backdrop-blur-sm transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Header */}
      <div className="border-border flex h-14 max-h-14 min-h-14 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2 overflow-hidden transition-all duration-300">
          <TitleIcon className="text-primary h-6 w-6 shrink-0" />

          <span
            className={cn(
              "font-bold tracking-tight whitespace-nowrap transition-all duration-300",
              collapsed
                ? "max-w-0 overflow-hidden opacity-0"
                : "max-w-50 opacity-100"
            )}
          >
            {title}
          </span>
        </div>

        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(true)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-2"
            onClick={() => setCollapsed(false)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {links.map((link) => (
          <SidebarItem key={link.href} link={link} />
        ))}
      </nav>

      {/* Footer */}
      <div className="flex flex-col gap-2 p-4">
        {!collapsed && extraComps}

        <Modal open={logoutOpen} setOpen={setLogoutOpen}>
          <ModalTrigger>
            <Button
              variant="destructive"
              className="flex w-full justify-center px-0 transition-all duration-300"
            >
              <Power className="size-4 shrink-0" />

              <span
                className={cn(
                  "overflow-hidden whitespace-nowrap transition-all duration-300",
                  collapsed
                    ? "w-0 max-w-0 opacity-0"
                    : "ml-2 max-w-30 opacity-100"
                )}
              >
                LOGOUT
              </span>
            </Button>
          </ModalTrigger>

          <ModalContent anchor grayscale>
            <div className="p-4">
              <p className="text-muted-foreground mb-4 text-sm">
                Are you sure you want to log out?
              </p>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setLogoutOpen(false)}>
                  Cancel
                </Button>

                <Button
                  variant="destructive"
                  onClick={async () => {
                    await onLogout();
                    setLogoutOpen(false);
                  }}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </ModalContent>
        </Modal>
      </div>
    </aside>
  );
}
