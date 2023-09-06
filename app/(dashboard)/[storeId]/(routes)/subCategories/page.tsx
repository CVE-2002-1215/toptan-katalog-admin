import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { SubCategoryClient } from "./components/client";
import { SubCategoryColumn } from "./components/columns";

const subCategoriesPage = async ({
    params
}: {
    params: { storeId: string }
}) => {
  const subCategories = await prismadb.subCategory.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      name: 'asc'
    }
  });

  const formattedsubCategories: SubCategoryColumn[] = subCategories.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubCategoryClient data={formattedsubCategories} />
      </div>
    </div>
  );
}

export default subCategoriesPage;