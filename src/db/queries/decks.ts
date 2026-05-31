import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { decksTable } from "@/db/schema";

export function getDecksByClerkUserId(clerkUserId: string) {
  return db
    .select({
      id: decksTable.id,
      name: decksTable.name,
      description: decksTable.description,
      createdAt: decksTable.createdAt,
    })
    .from(decksTable)
    .where(eq(decksTable.clerkUserId, clerkUserId))
    .orderBy(desc(decksTable.createdAt));
}
