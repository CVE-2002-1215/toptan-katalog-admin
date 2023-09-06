"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CategoryColumn = {
  id: string;
  name: string;

  // Billboard Name
  billboardName: string;
  // Billboard Name

  // Billboard Name'den önce
    // billboardLabel: string;
  // Billboard Name'den önce
  
  createdAt: string;
}

export const columns: ColumnDef<CategoryColumn>[] = [
    {
        accessorKey: "name",
        header: "İsim",
    },

    // Billboard Name
    {
        accessorKey: "billboard",
        header: "Reklam Panosu",
        cell: ({ row }) => row.original.billboardName,
    },
    // Billboard Name

    // Billboard Name'den önce
        // {
        //     accessorKey: "billboard",
        //     header: "Reklam Panosu",
        //     cell: ({ row }) => row.original.billboardLabel,
        // },
    // Billboard Name'den önce
    {
        accessorKey: "createdAt",
        header: "Tarih",
    },
    {
        id:"actions",
        cell: ({ row }) => <CellAction data={row.original} />
    }
]

// Category Column değişkenlerinin olduğu component
