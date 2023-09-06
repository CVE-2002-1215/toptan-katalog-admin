"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BillboardColumn = {
  id: string;
  // Name
  name: string;
  // Name
  label: string;
  createdAt: string;
}

export const columns: ColumnDef<BillboardColumn>[] = [
    // Name
    {
        accessorKey: "name",
        header: "İsim",
    },
    // Name
    {
        accessorKey: "label",
        header: "Etiket",
    },
    {
        accessorKey: "createdAt",
        header: "Tarih",
    },
    {
        id:"actions",
        cell: ({ row }) => <CellAction data={row.original} />
    }
]

// Column değişkenlerinin olduğu component
