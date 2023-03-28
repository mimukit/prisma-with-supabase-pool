/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

import { pgTable, text, date } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

export const exampleTable = pgTable("Example", {
  id: text("id").primaryKey(),
  name: text("name"),
  createdAt: date("createdAt").defaultNow(),
  updatedAt: date("updatedAt"),
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany({ take: 100 });
  }),

  getSupa: publicProcedure.query(() => {
    return supabase.from("Example").select().limit(100);
  }),

  getDrizzle: publicProcedure.query(async () => {
    const drizzleClient = new Client({
      connectionString: process.env.DATABASE_URL,
    });

    await drizzleClient.connect();

    const db = drizzle(drizzleClient);

    return db.select().from(exampleTable).limit(100);
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
