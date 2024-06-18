import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from 'fastify';

import { OrderResponse } from '@react-monorepo/docsoc-types';
import { importFile } from "./importFile";

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
              variant: orderItem.variant.variantName,
              collected: orderItem.collected,
              id: orderItem.id,
              quantity: orderItem.quantity
            }
          })
        }
    })
    return {
      shortcode,
      order: flatOrderedItems
    };
  });

  fastify.get('/items', async (request, res) => {
    // List items
    const items = await prisma.rootItem.findMany();
    return items;
  })

  fastify.put('/orders', async (request, res) => {
    const file = await request.file();
    
    /// @ts-expect-error error!
    const itemId = file.fields.itemId.value;
    const fileContents = (await file.toBuffer()).toString();

    // Process file
    await importFile(fileContents, parseInt(itemId));

    // Pass on
  })

  fastify.post('/items/:id/set', async (request, res) => {
    /// @ts-expect-error error!
    const state = request.body.state;
    /// @ts-expect-error error!
    const itemId = request.params.id;

    console.log("Setting item: ", itemId, " to ", state);
    console.log(typeof state);

    // set
    await prisma.orderItem.update({
      where: {
        id: parseInt(itemId, 10)
      },
      data: {
        collected: state
      }
    });
  })
  
  fastify.get('/', async function () {
    return { message: 'Hello API' };
  });
}

