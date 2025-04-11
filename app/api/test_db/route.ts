// app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client-community';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Simple query to test connection
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ success: true, message: "Database connection successful" });
  } catch (error) {
    console.error("Database test failed:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Database connection failed", 
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}