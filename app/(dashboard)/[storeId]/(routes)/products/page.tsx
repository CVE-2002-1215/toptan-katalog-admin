import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";

const ProductsPage = async ({
    params
}: {
    params: { storeId: string }
}) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      category: true,
      brand: true,
      subCategory: true, // ?
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    minqty: item.minqty, // 6.30.30 civarında formatter kullanacığını söylüyor. minqty ile alakalı bir sıkıntı yaşarsan buraya dön.
    category: item.category.name,
    subCategory: item.subCategory.name,
    brand: item.brand.name,
    code: item.code, // stock code'u ekledik.
    // info ekleyemeli miyiz ?
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
}

export default ProductsPage;