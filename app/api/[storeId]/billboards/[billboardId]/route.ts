import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
      include: {
        images: true,
      }
    });
  
    return NextResponse.json(billboard);
  } catch (error) {
    console.log('[BILLBOARD_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string , billboardId: string } }
    ) {
        try {   
            const { userId } = auth();
            
            const body = await req.json();
            
            // Name
            const { label, images, name } = body;
            // Name

            if (!userId) {
                return new NextResponse("Unauthenticated", { status: 401 });
            }
            
            // if (!label) {
            //     return new NextResponse("Label is required", { status: 400 });
            // }

            // Name
            if (!name) {
              return new NextResponse("name is required", { status: 400 });
            }
            // Name

            if (!images || !images.length) {
              return new NextResponse("Images are required", { status: 400 });
            }
            
            if (!params.billboardId) {
                return new NextResponse("Billboard id is required", { status: 400 });
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
            
            await prismadb.billboard.update({
                where: {
                    id: params.billboardId,
                },
                data: {
                    // Name
                    name,
                    // Name
                    label,
                    images: {
                      deleteMany: {},
                    },
                }
            });

            const billboard = await prismadb.billboard.update({
              where: {
                  id: params.billboardId,
              },
              data: {
                images: {
                  createMany: {
                    data: [
                      ...images.map((image: { url: string }) => image),
                    ],
                  },
                },
              },
          });
            
            return NextResponse.json(billboard);
        } catch (error) {
            console.log('[BILLBOARD_PATCH]', error);
            return new NextResponse("Internal error", { status: 500 });
        }
    };

    export async function DELETE(
      req: Request,
      { params }: { params: { storeId: string, billboardId: string } }
    ) {
      try {
        const { userId } = auth();
    
        if (!userId) {
          return new NextResponse("Unauthenticated", { status: 401 });
        }
    
        if (!params.billboardId) {
          return new NextResponse("Billboard id is required", { status: 400 });
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
    
        const billboard = await prismadb.billboard.deleteMany({
          where: {
            id: params.billboardId,
          }
        });
      
        return NextResponse.json(billboard);
      } catch (error) {
        console.log('[BILLBOARD_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
      }
    };