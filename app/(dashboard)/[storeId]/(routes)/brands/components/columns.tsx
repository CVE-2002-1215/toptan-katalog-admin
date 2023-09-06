"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BrandColumn = {
  id: string;
  name: string;
  createdAt: string;
}

export const columns: ColumnDef<BrandColumn>[] = [
    {
        accessorKey: "name",
        header: "İsim",
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
