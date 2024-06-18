import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from 'fastify';


interface OrderResponse {
    orderIDInternal: number;
    orderNoShop: number;
    date: Date;

    items: {
      name: string;
      variant: string;
    }[]
  }

export default async function (fastify: FastifyInstance) {
  const prisma = new PrismaClient()

  // GET /items/shortcode?shortcode=kss22 -> given a shortcode, return the items ordered
  fastify.get<{
    Querystring: { shortcode: string };
    // Reply: {
    //   200: {
    //     shortcode: string;
    //     order: OrderResponse[];
    //   },
    //   404: {
    //     message: string;
    //   }
    // }
  }>('/items/shortcode', async (request, res) => {
    const { shortcode } = request.query;
    const student = await prisma.imperialStudent.findFirst({
      where: {
        shortcode: shortcode
      },
      relationLoadStrategy: "join",
      include: {
        orders: {
          include: {
            orderItems: {
              include: {
                variant: {
                  include: {
                    rootItem: true
                  }
                },
              }
            }
          }
        }
      }
    })

    if (!student) {
      res.code(404).send({
        message: "Not found"
      });
      return;
    }

    // Map to interface
    const flatOrderedItems: OrderResponse[] = student.orders.map(order => {
      return {
          orderIDInternal: order.id,
          orderNoShop: order.orderNo,
          date: order.orderDate,
          items: order.orderItems.map(orderItem => {
            return {
              name: orderItem.variant.rootItem.name,
              variant: orderItem.variant.variantName
            }
          })
        }
    })
    return {
      shortcode,
      order: flatOrderedItems
    };
  });
  
  fastify.get('/', async function () {
    return { message: 'Hello API' };
  });
}
