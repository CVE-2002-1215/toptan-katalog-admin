"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
  id: string;
  name: string;
  minqty: string; // price formatted yapılınca string oldu o yüzden string yazdı. Sıkıntı yaşarsan formatted olayına dön.
  category: string;
  brand: string;
  subCategory: string;
  isFeatured: boolean;
  isArchived: boolean;
  code: string;
  // info eklemeli miyiz?
  createdAt: string;
}

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "name",
        header: "İsim",
    },
    {
        accessorKey: "code",
        header: "Stok Kodu",
    },
    {
        accessorKey: "isArchived",
        header: "Arşivlendi",
    },
    {
        accessorKey: "isFeatured",
        header: "Öne Çıkarıldı",
    },
    {
        accessorKey: "category",
        header: "Kategori",
    },
    {
        accessorKey: "subCategory",
        header: "Alt Kategori",
    },
    {
        accessorKey: "brand",
        header: "Marka",
    },
    {
        accessorKey: "minqty",
        header: "Minimum Sipariş Adedi",
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
