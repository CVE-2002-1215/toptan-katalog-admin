import prismadb from "@/lib/prismadb";
import { SubCategoryForm } from "./components/subCategory-form";

const SubCategoryPage = async ({
    params
    }: {
        params: { subCategoryId: string }
    }) => {
    const SubCategory = await prismadb.subCategory.findUnique({
      where: {
        id: params.subCategoryId
      }
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SubCategoryForm initialData={SubCategory} />
            </div>
        </div>
    );
};

export default SubCategoryPage;

