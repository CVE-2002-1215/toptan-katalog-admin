import { Heading } from "@/components/ui/heading";
import prismadb from "@/lib/prismadb";

interface DashboardPageProps {
    params: { storeId: string }
};

const DashboardPage: React.FC<DashboardPageProps> = async ({
    params 
}) => {
    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId
        }
    });

    const storeName= store?.name;

    return (
        <div className="flex-col">
            <div className="flex-1 text-center space-y-4 p-8 pt-20">
                <Heading title="Toptan Katalog Paneline Hoşgeldiniz" description="Şuanda aşağıda adı bulunan mağazayı yönetmektesiniz."/>
            </div>
            <p className="font-serif text-2xl flex-1 text-center space-y-4 p-8 pt-6">
                 {store?.name}
            </p>
        </div>
    );
}

export default DashboardPage;

// Ana Sayfa'ya ait .tsx

