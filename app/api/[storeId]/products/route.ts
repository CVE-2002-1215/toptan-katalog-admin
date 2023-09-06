import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';
 
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { 
      name,
      minqty,
      code,
      categoryId,
      subCategoryId,
      brandId,
      isFeatured,
      isArchived,
      info,
      images  
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!minqty) {
      return new NextResponse("Minimumu Order Quantity is required", { status: 400 });
    }

    if (!code) {
      return new NextResponse("Product Code is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category Id is required", { status: 400 });
    }

    if (!subCategoryId) {
      return new NextResponse("Sub Category Id is required", { status: 400 });
    }

    if (!brandId) {
      return new NextResponse("Brand Id is required", { status: 400 });
    }

    if (!info) {
      return new NextResponse("Info is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
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

    const product = await prismadb.product.create({
      data: {
        name,
        minqty,
        code,
        categoryId,
        subCategoryId,
        brandId,
        isFeatured,
        isArchived,
        info,
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image),
            ],
          },
        },
        storeId: params.storeId,
      }
    });
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {

    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId') || undefined;
    const subCategoryId = searchParams.get('subCategoryId') || undefined;
    const brandId = searchParams.get('brandId') || undefined;
    const isFeatured = searchParams.get('isFeatured');

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        subCategoryId,
        brandId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        subCategory: true,
        brand: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
  
    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};