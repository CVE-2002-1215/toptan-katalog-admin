"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { Brand } from "@prisma/client";
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

const formSchema = z.object({
    name: z.string().min(1),
});

type BrandFormValues = z.infer<typeof formSchema>;

interface BrandFormProps {
    initialData: Brand | null;
}

export const BrandForm: React.FC<BrandFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Markayı düzenle' : 'Marka oluştur';
    const description = initialData ? 'Markayı düzenle.' : 'Yeni bir marka oluştur.';
    const toastMessage = initialData ? 'Marka güncellendi.' : 'Yeni bir marka oluşturuldu.';
    const action = initialData ? 'Değişiklikleri Kaydet' : 'Oluştur';

    const form = useForm<BrandFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name:'',
          }
    });

    const onSubmit = async (data: BrandFormValues) => { 
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/brands/${params.brandId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/brands`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/brands`)
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
            await axios.delete(`/api/${params.storeId}/brands/${params.brandId}`);
            router.refresh();
            router.push(`/${params.storeId}/brands`);
            toast.success('Marka silindi.');
        } catch (error) {
            toast.error('Önce bu alt markayı kullanan tüm ürünleri kaldırdığınızdan emin olun');
        } finally {
            setLoading(false);
            setOpen(false);
        }
      }

    return (
        <>
            <AlertModal
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
                                <FormLabel>Marka</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Marka ismi" {...field} />
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