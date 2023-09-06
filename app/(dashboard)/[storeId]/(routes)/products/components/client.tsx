"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { ProductColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface ProductClientProps {
    data: ProductColumn[];
}

export const ProductClient: React.FC<ProductClientProps> = ({
    data
}) => {
    const params = useParams();
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-between">
            <Heading
                title={`Ürünler (${data.length})`} 
                description="Mağazanız için ürünleri yönetin" 
            />
            <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
                <Plus className="mr-2 h-4 w-4" /> 
                Yeni Ekle
            </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data} />
            <Heading title="API" description="Ürünler için API Calls" />
            <Separator />
            <ApiList entityName="products" entityIdName="productId"/>
        </>
    );
};

// Ürünler Sayfasına ait 

// searchKey kısmını ne yaparsan ona göre filtreleme yapıyor. createdAt dersen tarihe göre arama yaptırabilirsin. 