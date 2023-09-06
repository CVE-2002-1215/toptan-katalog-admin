import prismadb from "@/lib/prismadb";
import {  CategoryForm } from "./components/category-form";

const CategoryPage = async ({
    params
    }: {
        params: { categoryId: string, storeId: string }
    }) => {
    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId
      }
    });

    const billboards = await prismadb.billboard.findMany({
        // sorting the billborads
        orderBy: {
            name: 'asc'
        },
        // sorting the billboards 
        // prismadb.billboards'tan gelen bilgileri name property'sine göre alfabeye göre baştan sona göre sırala asc="ascending" desc="descending"
        where: {
          storeId: params.storeId
        }
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryForm 
                    billboards={billboards} 
                    initialData={category} 
                />
            </div>
        </div>
    );
}

export default CategoryPage;

