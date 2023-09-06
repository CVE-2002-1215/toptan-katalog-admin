"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { SubCategoryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface SubCategoryClientProps {
    data: SubCategoryColumn[];
}

export const SubCategoryClient: React.FC<SubCategoryClientProps> = ({
    data
}) => {
    const params = useParams();
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-between">
            <Heading
                title={`Alt Kategoriler (${data.length})`} 
                description="Mağazanız için alt kategorileri yönetin" 
            />
            <Button onClick={() => router.push(`/${params.storeId}/subCategories/new`)}>
                <Plus className="mr-2 h-4 w-4" /> 
                Yeni Ekle
            </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data} />
            <Heading title="API" description="Alt kategoriler için API Calls" />
            <Separator />
            <ApiList entityName="subCategories" entityIdName="subCategoryId"/>
        </>
    );
};


// searchKey kısmını ne yaparsan ona göre filtreleme yapıyor. createdAt dersen tarihe göre arama yaptırabilirsin. 