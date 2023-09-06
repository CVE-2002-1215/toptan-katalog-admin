import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { subCategoryId: string } }
) {
  try {
    if (!params.subCategoryId) {
      return new NextResponse("SubCategory id is required", { status: 400 });
    }

    const subCategory = await prismadb.subCategory.findUnique({
      where: {
        id: params.subCategoryId,
      }
    });
  
    return NextResponse.json(subCategory);
  } catch (error) {
    console.log('[SUBCATEGORY_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string , subCategoryId: string } }
    ) {
        try {   
            const { userId } = auth();
            
            const body = await req.json();
           
            const { name } = body;

            if (!userId) {
                return new NextResponse("Unauthenticated", { status: 401 });
            }         

            if (!name) {
              return new NextResponse("name is required", { status: 400 });
            }

            if (!params.subCategoryId) {
                return new NextResponse("SubCategory id is required", { status: 400 });
            }
            
            const storeByUserId = await prismadb.store.findFirst({
                where: {
                    id: params.storeId,
                    userId,
                }
            });
            
            if (!storeByUserId) {
                return new NextResponse("Unauthorized", { status: 403 });
            }
            
            const subCategory = await prismadb.subCategory.updateMany({
                where: {
                    id: params.subCategoryId,
                },
                data: {
                    name,
                }
            });
            
            return NextResponse.json(subCategory);
        } catch (error) {
            console.log('[SUBCATEGORY_PATCH]', error);
            return new NextResponse("Internal error", { status: 500 });
        }
    };

    export async function DELETE(
      req: Request,
      { params }: { params: { storeId: string, subCategoryId: string } }
    ) {
      try {
        const { userId } = auth();
    
        if (!userId) {
          return new NextResponse("Unauthenticated", { status: 401 });
        }
    
        if (!params.subCategoryId) {
          return new NextResponse("SubCategory id is required", { status: 400 });
        }
    
        const storeByUserId = await prismadb.store.findFirst({
          where: {
            id: params.storeId,
            userId,
          }
        });
    
        if (!storeByUserId) {
          return new NextResponse("Unauthorized", { status: 403 });
        }
    
        const subCategory = await prismadb.subCategory.deleteMany({
          where: {
            id: params.subCategoryId,
          }
        });
      
        return NextResponse.json(subCategory);
      } catch (error) {
        console.log('[SUBCATEGORY_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
      }
    };