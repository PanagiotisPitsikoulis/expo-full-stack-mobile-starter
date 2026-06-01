import { DataTable } from "../..";
import type { ColumnDef } from "../data-table";

type Payment = {
  amount: number;
  email: string;
  status: "failed" | "paid" | "pending";
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    cell: ({ value }: { value: unknown }) => `$${Number(value ?? 0).toFixed(2)}`,
    header: "Amount",
  },
];

const data: Payment[] = [
  { amount: 316, email: "ken99@example.com", status: "paid" },
  { amount: 242, email: "abe45@example.com", status: "pending" },
  { amount: 837, email: "monserrat44@example.com", status: "failed" },
];

export function Default() {
  return <DataTable columns={columns} data={data} pageSize={2} />;
}
