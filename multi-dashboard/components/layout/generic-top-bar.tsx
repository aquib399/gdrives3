"use client";

import { Sun, Moon, User, Check, Palette, LucideIcon } from "lucide-react";
import { Modal, ModalContent, ModalTrigger } from "@/components/modal";
import { usePalette } from "@/providers/palette";
import { Button } from "@/components/ui/button";
import { SearchBar } from "../search-bar";
import { useTheme } from "next-themes";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { RenderMedia } from "../render-media";
import { MimeType } from "@/types/domain/system/media";

interface TopBarProps {
  profileHref: string;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  profileIcon?: LucideIcon;
  extraComps?: React.ReactNode;
  avatarUrl?: string;
}

export function GenericTopBar(props: TopBarProps) {
  const {
    profileHref,
    searchPlaceholder = "Search...",
    onSearch,
    profileIcon: ProfileIcon = User,
    extraComps,
    avatarUrl
  } = props;

  const { resolvedTheme, setTheme } = useTheme();
  const { palette, setPalette, options } = usePalette();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const isDark = resolvedTheme === "dark";
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <header className="border-border bg-card/50 sticky top-0 z-10 flex h-14 max-h-14 min-h-14 shrink-0 items-center gap-3 border-b px-4 backdrop-blur-sm">
      {/* <div className="relative w-full max-w-md">
        <SearchBar
          setSearchTerm={(t) => setSearchTerm(t)}
          searchTerm={searchTerm}
          searchPlaceholder={searchPlaceholder}
          onEnter={() => onSearch?.(searchTerm)}
        />
      </div> */}

      <div className="ml-auto flex items-center gap-1">
        {extraComps}

        <Modal open={paletteOpen} setOpen={setPaletteOpen}>
          <ModalTrigger>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Choose palette"
              title="Choose palette"
            >
              <Palette className="h-4 w-4" />
            </Button>
          </ModalTrigger>

          <ModalContent anchor className="min-w-44 p-1">
            <ul className="flex flex-col">
              {options.map((opt) => {
                const active = palette === opt.value;
                return (
                  <li key={opt.value}>
                    <button
                      type="button"
                      onClick={() => {
                        setPalette(opt.value);
                        setPaletteOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted text-foreground"
                      )}
                    >
                      <span>{opt.name}</span>
                      {active && <Check className="h-4 w-4" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </ModalContent>
        </Modal>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Button variant="ghost" size="icon" asChild aria-label="Profile">
          <Link href={profileHref}>
            {avatarUrl ? (
              <RenderMedia
                fullUrl={avatarUrl}
                fullUrlMimeType={MimeType.PNG}
                aspectRatio="1/1"
                className="size-6"
              />
            ) : (
              <ProfileIcon className="h-4 w-4" />
            )}
          </Link>
        </Button>
      </div>
    </header>
  );
}
