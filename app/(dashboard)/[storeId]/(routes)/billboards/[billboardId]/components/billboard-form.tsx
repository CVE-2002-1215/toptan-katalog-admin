"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { Billboard, Imageforbillboard } from "@prisma/client";
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
    // Name
    name: z.string().min(1),
    // Name
    label: z.string().min(0), // 1'di billboardda yazı direk resimde olabilsin diye 0 yaptım.
    images: z.object({ url: z.string() }).array(),
});

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
    initialData: Billboard & {
        images: Imageforbillboard[]
    } | null;
}

export const BillboardForm: React.FC<BillboardFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Reklam panosunu düzenle' : 'Reklam panosu oluştur';
    const description = initialData ? 'Reklam panosunu düzenle.' : 'Yeni bir reklam panosu oluştur.';
    const toastMessage = initialData ? 'Reklam panosu güncellendi.' : 'Yeni bir reklam panosu oluşturuldu.';
    const action = initialData ? 'Değişiklikleri Kaydet' : 'Oluştur';

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: '',
            // Name
            name:'',
            // Name
            images: [], 
          }
    });

    const onSubmit = async (data: BillboardFormValues) => { 
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/billboards`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/billboards`)
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
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
            router.refresh();
            router.push(`/${params.storeId}/billboards`);
            toast.success('Reklam panosu silindi.');
        } catch (error) {
            toast.error('Önce bu reklam panosunu kullanan tüm kategorileri kaldırdığınızdan emin olun');
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
                description="Reklam panosunu silmek üzeresiniz bu işlem geri alınamaz."
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
                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Arka plan resmi</FormLabel>
                            <FormControl>
                                <ImageUpload 
                                value={field.value.map((image) => image.url)} 
                                disabled={loading} 
                                onChange={(url) => field.onChange([...field.value, { url }])}
                                onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                    )}
                    />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Reklam Panosu Etiket</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Reklam panosu etiket" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {/* Name */}
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Reklam Panosu İsim</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Reklam panosu isim" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {/* Name */}
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    );
};

// Reklam panosu +yeni ekle  ve ... -> güncelle kısmına ait