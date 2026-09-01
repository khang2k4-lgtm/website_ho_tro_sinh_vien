import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

try {
  const services = await prisma.service.findMany({
    where: { slug: { startsWith: 'thu-tuc-' } },
    select: { id: true, name: true },
  });

  await Promise.all(services.map((service) => prisma.service.update({
    where: { id: service.id },
    data: { name: service.name.replace(/^Thủ tục\s+\d+:\s*/, '') },
  })));

  console.log(`Updated ${services.length} official procedure names.`);
} finally {
  await prisma.$disconnect();
}
