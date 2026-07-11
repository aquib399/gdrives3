"use client";

import { AdminSseService } from "../service/admin";
import { SseData } from "@/types/sse";
import { useBaseSse } from "./base";

export const useAdminSse = () => {
  const state = useBaseSse<SseData<any>, AdminSseService>(AdminSseService);
  return state;
};
