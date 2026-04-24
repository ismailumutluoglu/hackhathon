import { Order } from '../models/Order';

export async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await Order.countDocuments();
  const padded = String(count + 1).padStart(5, '0');
  return `TAZE-${year}-${padded}`;
}
