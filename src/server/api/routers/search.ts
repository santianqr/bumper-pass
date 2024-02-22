import { z } from "zod";

import {
  createTRPCRouter,
  //protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

const SearchInput = z.object({
  vehicleType: z
    .string()
    .refine((value) => value === "AUTO" || value === "MOTO", {
      message: "Vehicle type must be either 'auto' or 'motorcycle'.",
    }),
  plate: z.string(),
});

export const searchRouter = createTRPCRouter({
  searchPlate: publicProcedure.input(SearchInput).query(async ({ input }) => {
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
});