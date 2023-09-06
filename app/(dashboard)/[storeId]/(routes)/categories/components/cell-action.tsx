"use client";

import axios from "axios" ;
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert-modal";

import { CategoryColumn } from "./columns";

interface CellActionProps {
    data: CategoryColumn;
} 
  
export const CellAction: React.FC<CellActionProps> = ({
    data,
}) => {

    const router = useRouter();
    const params = useParams();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);


    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("Kategori ID'si panoya kopyalandı..");
    }

    const onDelete = async () => {
        try {
          setLoading(true);
          await axios.delete(`/api/${params.storeId}/categories/${data.id}`);
          router.refresh();
          toast.success('Kategori silindi.');
        } catch (error) {
          toast.error('Önce kategoriyi kullanan tüm ürünleri kaldırdığınızdan emin olun.');
        } finally {
          setOpen(false);
          setLoading(false);
        }
    };

    return (
        <>
          <AlertModal
            isOpen={open} 
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
            description="Kategoriyi silmek üzeresin bu işlem geri alınamaz."
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => onCopy(data.id)}
              >
                <Copy className="mr-2 h-4 w-4" /> Id Kopyala
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/${params.storeId}/categories/${data.id}`)}
              >
                <Edit className="mr-2 h-4 w-4" /> Güncelle
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setOpen(true)}
              >
                <Trash className="mr-2 h-4 w-4" /> Sil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
};

// Kategori seçilen panoyu güncelleme 