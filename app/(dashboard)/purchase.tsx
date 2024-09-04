import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { SelectPurchase } from '@/lib/db';
import {
  deletePurchase,
  deliverPurchase,
  pendingPurchase,
  printPurchase,
  shipPurchase
} from './actions';

export function Purchase({ purchase }: { purchase: SelectPurchase }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{purchase.email}</TableCell>
      <TableCell className="font-medium hidden md:table-cell">
        {purchase.name}
      </TableCell>
      <TableCell className="font-medium hidden md:table-cell">
        {purchase.stripe_transaction_id}
      </TableCell>
      <TableCell className="font-medium hidden md:table-cell">
        {purchase.shipping_address}
      </TableCell>
      <TableCell className="font-medium hidden md:table-cell">
        {purchase.purchase_date.toLocaleDateString()}
      </TableCell>
      <TableCell className="font-medium">
        {' '}
        <Badge variant="outline" className="capitalize">
          {purchase.shipping_status}
        </Badge>
      </TableCell>
      <TableCell className="font-medium md:table-cell">
        {purchase.shipping_date?.toLocaleDateString()}
      </TableCell>

      <TableCell></TableCell>
      {/* <TableCell className="hidden md:table-cell">{`$${purchase.price}`}</TableCell>
      <TableCell className="hidden md:table-cell">{purchase.stock}</TableCell>
      <TableCell className="hidden md:table-cell">
        {purchase.availableAt.toLocaleDateString('en-US')}
      </TableCell> */}
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <form action={printPurchase}>
                <input type="hidden" name="id" value={purchase.id} />
                <button type="submit">Print</button>
              </form>
            </DropdownMenuItem>
            <DropdownMenuLabel>Set status:</DropdownMenuLabel>
            <DropdownMenuItem>
              <form action={pendingPurchase}>
                <input type="hidden" name="id" value={purchase.id} />
                <button type="submit">Pending</button>
              </form>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <form action={shipPurchase}>
                <input type="hidden" name="id" value={purchase.id} />
                <button type="submit">Shipped</button>
              </form>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <form action={deliverPurchase}>
                <input type="hidden" name="id" value={purchase.id} />
                <button type="submit">Delivered</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
