import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";

export async function GET(request: NextRequest) {
    const hideCompleted = request.nextUrl.searchParams.get("hideCompleted") === "true";

    try {
        const d = await prisma.todo.findMany({
            where: {
                completed: hideCompleted ? false : undefined
            }
        });
        return NextResponse.json(d);
    } catch (e: any) {
        return NextResponse.error();
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const newTodo = await prisma.todo.create({
            data: {
                title: body[0].title,
                description: body[0].description,
                completed: false,
                user_id: body[0].user_id
            }
        })

        return NextResponse.json(newTodo);
    } catch (e: any) {
        console.log(e);
        return NextResponse.error();
    }
}