"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { SubCategory } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast} from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
    name: z.string().min(1),
});

type SubCategoryFormValues = z.infer<typeof formSchema>;

interface SubCategoryFormProps {
    initialData: SubCategory | null;
}

export const SubCategoryForm: React.FC<SubCategoryFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Alt kategoriyi düzenle' : 'Alt kategori oluştur';
    const description = initialData ? 'Alt kategoriyi düzenle.' : 'Yeni bir alt kategori oluştur.';
    const toastMessage = initialData ? 'Alt kategori güncellendi.' : 'Yeni bir alt kategori oluşturuldu.';
    const action = initialData ? 'Değişiklikleri Kaydet' : 'Oluştur';

    const form = useForm<SubCategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name:'',
          }
    });

    const onSubmit = async (data: SubCategoryFormValues) => { 
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/subCategories/${params.subCategoryId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/subCategories`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/subCategories`)
            toast.success(toastMessage);
        } catch (error) {
            toast.error('Bir şeyler ters gitti.');
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/subCategories/${params.subCategoryId}`);
            router.refresh();
            router.push(`/${params.storeId}/subCategories`);
            toast.success('Alt kategori silindi.');
        } catch (error) {
            toast.error('Önce bu alt kategoriyi kullanan tüm ürünleri kaldırdığınızdan emin olun');
        } finally {
            setLoading(false);
            setOpen(false);
        }
      }

    return (
        <>
            <AlertModal
                description="Alt Kategoriyi silmek üzeresiniz bu işlem geri alınamaz."
                isOpen={open} 
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading
                    title={title}
                    description={description}
                />
                {initialData && (
                <Button
                    disabled={loading}
                    variant="destructive"
                    size="icon"
                    onClick={() => setOpen(true)}
                >
                    <Trash className="h-4 w-4" />
                </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Alt Kategori</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Alt Kategori ismi" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    );
};

// Alt Kategori +yeni ekle  ve ... -> güncelle kısmına ait