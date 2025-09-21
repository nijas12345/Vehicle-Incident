import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Users with car-related roles
  await prisma.user.createMany({
    data: [
      { name: 'Alice', email: 'alice@example.com', role: 'Driver' },
      { name: 'Bob', email: 'bob@example.com', role: 'FleetManager' },
      { name: 'Charlie', email: 'charlie@example.com', role: 'Mechanic' },
      { name: 'David', email: 'david@example.com', role: 'Purchaser' },
      { name: 'Eve', email: 'eve@example.com', role: 'Operator' },
      { name: 'Frank', email: 'frank@example.com', role: 'Driver' },
      { name: 'Grace', email: 'grace@example.com', role: 'Mechanic' },
      { name: 'Henry', email: 'henry@example.com', role: 'FleetManager' },
      { name: 'Ivy', email: 'ivy@example.com', role: 'Operator' },
      { name: 'Jack', email: 'jack@example.com', role: 'Purchaser' },
    ],
    skipDuplicates: true,
  });

  // Sample Cars
  await prisma.car.createMany({
    data: [
      { plateNo: 'KA-01-AB-1234', model: 'Toyota Corolla', year: 2020 },
      { plateNo: 'KA-02-XY-5678', model: 'Honda City', year: 2019 },
      { plateNo: 'KA-03-CD-9101', model: 'Hyundai Creta', year: 2021 },
      { plateNo: 'KA-04-EF-1122', model: 'Mahindra Thar', year: 2022 },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
