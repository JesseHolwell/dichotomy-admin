'use server';

import { deletePurchaseById, modifyPurchase, ShippingStatus } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function deletePurchase(formData: FormData) {
  // let id = Number(formData.get('id'));
  // await deletePurchaseById(id);
  // revalidatePath('/');
}

export async function printPurchase(formData: FormData) {
  // let id = Number(formData.get('id'));
  // await deletePurchaseById(id);
  // revalidatePath('/');
}

export async function pendingPurchase(formData: FormData) {
  let id = Number(formData.get('id'));
  console.log('setting pending', id);
  await modifyPurchase(id, ShippingStatus.Pending);
  revalidatePath('/');
}

export async function shipPurchase(formData: FormData) {
  let id = Number(formData.get('id'));
  await modifyPurchase(id, ShippingStatus.Shipped);
  revalidatePath('/');
}

export async function deliverPurchase(formData: FormData) {
  let id = Number(formData.get('id'));
  await modifyPurchase(id, ShippingStatus.Delivered);
  revalidatePath('/');
}
