import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const items = [
  "Blue Zoodie",
  "Dusk Zoodie",
  "Lavendar Zoodie",
  "Yellow Zoodie",
  "Navy Zoodie",

  "Pride Zoodie",
  "Pride T-shirt",

  "Sponsors T-shirt",

  "JMC Hoodie Extra",
  "JMC Hoodie (Preorder)",

  "Laptop Sleeve",
  
]
async function main() {
  for (const item of items) {
    await prisma.rootItem.upsert({
      where: { name: item },
      update: {},
      create: {
        name: item,
      },
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })