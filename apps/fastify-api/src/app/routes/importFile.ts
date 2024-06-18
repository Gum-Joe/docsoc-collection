import { PrismaClient } from "@prisma/client";
import { parse } from "csv-parse";



export async function importFile(fileContents: string, itemId: number) {

  const prisma = new PrismaClient();
  

  console.log("Importing file for: ", itemId);
  console.log(fileContents);

  const iter = parse(fileContents, {
    columns: true,
  })  

  for await (const record of iter) {
    console.log("Record: ", record);

    // 1: If user exists, get user
    const user = await prisma.imperialStudent.upsert({
      where: {
        shortcode: record["Login"],
      },
      update: {
        cid: record["CID/Card Number"],
        firstName: record["First Name"],
        lastName: record["Surname"],
        email: record["Email"],
      },
      create: {
        cid: record["CID/Card Number"],
        shortcode: record["Login"],
        firstName: record["First Name"],
        lastName: record["Surname"],
        email: record["Email"],
      }
    });

    // 2: Create order
    // If already exists, skip
    const orderNo = parseInt(record["Order No"]);
    const dateString = record["Date"];
    const [day, month, year] = dateString.split("/");
    const isoDateString = `${year}-${month}-${day}`;
    const date = new Date(isoDateString);
    const order = await prisma.order.upsert({
      where: {
        orderNo: orderNo,
      },
      update: {},
      create: {
        orderNo: orderNo,
        orderDate: date,
        student: {
          connect: {
            id: user.id,
          }
        }
      }
    });

    // 3: Create variant if needed
    const variant = record["Product Name"]
    const quantity = parseInt(record["Quantity"]);
    
    const varientDB = await prisma.variant.upsert({
      where: {
        variantName_rootItemId: {
          rootItemId: itemId,
          variantName: variant,
        }
      },
      update: {},
      create: {
        variantName: variant,
        rootItem: {
          connect: {
            id: itemId,
          }
        }
      }
    })

    // Add order item
    // kip if this orderId already exists for this user & variant
    if (await prisma.orderItem.findFirst({
      where: {
        orderId: order.id,
        variantId: varientDB.id
      }
    })) {
      continue;
    }

    // Else, create order item
    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        variantId: varientDB.id,
        quantity: quantity,
        collected: false,
      }
    });


  }
}
