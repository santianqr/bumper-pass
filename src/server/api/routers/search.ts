import { z } from "zod";

import {
  createTRPCRouter,
  //protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

const searchInput = z.object({
  vehicleType: z
    .string()
    .refine((value) => value === "AUTO" || value === "MOTO", {
      message: "Vehicle type must be either 'auto' or 'motorcycle'.",
    }),
  plate: z.string(),
});

const vgInput = z.object({
  plateLength: z.string(),
  plateType: z.string(),
  spaces: z.boolean(),
  symbols: z.boolean(),
  description: z.string().min(20).max(180),
});

export const searchRouter = createTRPCRouter({
  searchPlate: publicProcedure.input(searchInput).query(async ({ input }) => {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    const data = await response.text();

    return data;
  }),

  generations: publicProcedure.input(vgInput).query(async ({ input }) => {
    const response = await fetch("/api/vg-main", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    const data = await response.text();

    return data;
  }),
});
