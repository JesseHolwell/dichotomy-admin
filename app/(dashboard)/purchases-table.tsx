'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Purchase } from './purchase';
import { SelectPurchase } from '@/lib/db';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PurchasesTable({
  purchases,
  offset,
  totalPurchases
}: {
  purchases: SelectPurchase[];
  offset: number;
  totalPurchases: number;
}) {
  let router = useRouter();
  let purchasesPerPage = 5;

  function prevPage() {
    router.back();
  }

  function nextPage() {
    router.push(`/?offset=${offset}`, { scroll: false });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchases</CardTitle>
        <CardDescription>
          Manage your purchases and view their sales performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">Name</TableHead>
              <TableHead className="hidden md:table-cell">Stripe ID</TableHead>
              <TableHead className="hidden md:table-cell">
                Shipping Address
              </TableHead>
              <TableHead className="hidden md:table-cell">
                Purchase Date
              </TableHead>
              <TableHead>Shipping status</TableHead>
              <TableHead className="hidden md:table-cell">
                Shipping Date
              </TableHead>
              {/* <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases.map((purchase) => (
              <Purchase key={purchase.id} purchase={purchase} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <form className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            Showing{' '}
            <strong>
              {Math.min(offset - purchasesPerPage, totalPurchases) + 1}-{offset}
            </strong>{' '}
            of <strong>{totalPurchases}</strong> purchases
          </div>
          <div className="flex">
            <Button
              formAction={prevPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={offset === purchasesPerPage}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Prev
            </Button>
            <Button
              formAction={nextPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={offset + purchasesPerPage > totalPurchases}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}
