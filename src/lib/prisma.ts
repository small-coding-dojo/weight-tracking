import { PrismaClient } from '../generated/prisma';

// Deklariere eine globale Variable für den PrismaClient
declare global {
  var prisma: PrismaClient | undefined;
}

// Initialisiere den PrismaClient mit einem Singleton-Pattern
export const prisma = global.prisma || new PrismaClient();

// Speichere die Client-Instanz in der globalen Variable im Entwicklungsmodus
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}