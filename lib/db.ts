import 'server-only';

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import {
  pgTable,
  text,
  numeric,
  integer,
  timestamp,
  pgEnum,
  serial
} from 'drizzle-orm/pg-core';
import { count, eq, ilike } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

export const db = drizzle(neon(process.env.POSTGRES_URL!));

export enum ShippingStatus {
  Pending = 'pending',
  Shipped = 'shipped',
  Delivered = 'delivered'
}

const shippingStatus = pgEnum('shipping_status', [
  ShippingStatus.Pending,
  ShippingStatus.Shipped,
  ShippingStatus.Delivered
]);

export const purchases = pgTable('purchases', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  stripe_transaction_id: text('stripe_transaction_id').notNull(),
  shipping_address: text('shipping_address').notNull(),
  purchase_date: timestamp('purchase_date').notNull(),
  shipping_status: shippingStatus('shipping_status').notNull(),
  shipping_date: timestamp('shipping_date')
});

export type SelectPurchase = typeof purchases.$inferSelect;
export const insertPurchaseSchema = createInsertSchema(purchases);

export async function getPurchases(
  search: string,
  offset: number
): Promise<{
  purchases: SelectPurchase[];
  newOffset: number | null;
  totalPurchases: number;
}> {
  // Always search the full table, not per page
  if (search) {
    return {
      purchases: await db
        .select()
        .from(purchases)
        .where(ilike(purchases.name, `%${search}%`))
        .limit(1000),
      newOffset: null,
      totalPurchases: 0
    };
  }

  if (offset === null) {
    return { purchases: [], newOffset: null, totalPurchases: 0 };
  }

  let totalPurchases = await db.select({ count: count() }).from(purchases);
  let morePurchases = await db.select().from(purchases).limit(5).offset(offset);
  let newOffset = morePurchases.length >= 5 ? offset + 5 : null;

  return {
    purchases: morePurchases,
    newOffset,
    totalPurchases: totalPurchases[0].count
  };
}

export async function deletePurchaseById(id: number) {
  await db.delete(purchases).where(eq(purchases.id, id));
}

export async function modifyPurchase(id: number, status: ShippingStatus) {
  // Create an object to store the updates
  const updates: Partial<{
    shipping_status: ShippingStatus;
    shipping_date: Date | null;
  }> = {
    shipping_status: status
  };

  // Add shipping_date update logic based on status
  if (status === ShippingStatus.Shipped) {
    // Set shipping_date to the current date when status is 'shipped'
    updates.shipping_date = new Date();
  } else if (status === ShippingStatus.Pending) {
    // Clear shipping_date when status is 'pending'
    updates.shipping_date = null;
  }

  // Perform the update operation with the prepared updates
  await db
    .update(purchases)
    .set(updates) // Set the shipping_status and/or shipping_date based on the updates object
    .where(eq(purchases.id, id)); // Update where the purchase ID matches the provided ID

  console.log('modified purchase', id);
}
