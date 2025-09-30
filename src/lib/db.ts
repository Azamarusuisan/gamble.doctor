// モックモード: Prismaは使用しません
// db.tsとprisma.tsで同じモックを使用

export const prisma = {
  $transaction: async (fn: any) => await fn(prisma),
  appointment: {
    findFirst: async () => null,
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => ({ id: 'mock', status: 'confirmed' }),
    update: async () => ({ id: 'mock', status: 'confirmed' })
  },
  slot: {
    findFirst: async () => null,
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => ({ id: 'mock' }),
    update: async () => ({ id: 'mock' }),
    createMany: async () => ({ count: 0 })
  },
  patient: {
    findFirst: async () => null,
    create: async () => ({ id: 'mock', name: 'Mock Patient', email: 'mock@example.com' })
  },
  inquiry: {
    findMany: async () => [],
    create: async () => ({ id: 'mock' })
  },
  auditLog: {
    create: async () => ({ id: 'mock' })
  },
  consent: {
    createMany: async () => ({ count: 0 })
  }
} as any;
