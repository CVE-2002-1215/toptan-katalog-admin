"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { Image, Product , Category , SubCategory , Brand } from "@prisma/client";
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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
    name: z.string().min(1),
    code: z.string().min(1), //stockcode eklendi
    images: z.object({ url: z.string() }).array(),
    minqty: z.string().min(1),
    categoryId: z.string().min(1),
    brandId: z.string().min(1),
    subCategoryId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
    // bu kısımda info eklemeliyim çünkü form kısmını yapıyoruz.
    info: z.string().min(1)
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
    initialData: Product & {
        images: Image[]
    } | null;
    categories: Category[];
    subCategories: SubCategory[];
    brands:     Brand[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
    initialData,
    categories,
    subCategories,
    brands
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Ürünü düzenle' : 'Ürün oluştur';
    const description = initialData ? 'Ürünü düzenle.' : 'Yeni bir ürün oluştur.';
    const toastMessage = initialData ? 'Ürün güncellendi.' : 'Yeni bir ürün oluşturuldu.';
    const action = initialData ? 'Değişiklikleri Kaydet' : 'Oluştur';

    // 6.42.40 civarında price ile alakalı error aldığı için bu kısımda oynamalar yapıyor bizde sıkıntı olmadığı için devam
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            code:'',
            images: [],
            minqty: '',
            categoryId: '',
            brandId: '',
            subCategoryId: '',
            // bu kısımda info eklemeliyim çünkü form kısmını yapıyoruz.
            info: '',
            isFeatured: false,
            isArchived: false,
          }
    });

    const onSubmit = async (data: ProductFormValues) => { 
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/products`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/products`)
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
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            router.refresh();
            router.push(`/${params.storeId}/products`);
            toast.success('Ürün silindi.');
        } catch (error) {
            toast.error('Bir şeyler ters gitti.');
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
                description="Ürünü silmek üzeresiniz bu işlem geri alınamaz."
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
                            <FormLabel>Ürün Resimleri</FormLabel>
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
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Ürün İsmi</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Ürün ismi" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Stok Kodu</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Stok kodu" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="minqty"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Minimum Sipariş Adedi</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Minimum sipariş adedi" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kategori</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue 
                                                    defaultValue={field.value} 
                                                    placeholder="Kategori seçiniz" 
                                                />
                                            </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="subCategoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Alt Kategori</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue 
                                                    defaultValue={field.value} 
                                                    placeholder="Alt kategori seçiniz" 
                                                />
                                            </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {subCategories.map((subCategory) => (
                                                    <SelectItem key={subCategory.id} value={subCategory.id}>{subCategory.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="brandId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Marka</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue 
                                                    defaultValue={field.value} 
                                                    placeholder="Marka seçiniz" 
                                                />
                                            </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {brands.map((brand) => (
                                                    <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            // @ts-ignore
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Öne Çıkar
                                        </FormLabel>
                                        <FormDescription>
                                            Bu ürün ana sayfada gösterilecek.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isArchived"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            // @ts-ignore
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Arşivle
                                        </FormLabel>
                                        <FormDescription>
                                            Bu ürün mağazanın herhangi bir alanında gösterilmeyecek.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="info"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Ürün hakkında bilgi</FormLabel>
                                <FormControl>
                                    <Textarea disabled={loading} placeholder="Ürün hakkında bilgi" {...field} />
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

// Product +yeni ekle  ve ... -> güncelle kısmına ait