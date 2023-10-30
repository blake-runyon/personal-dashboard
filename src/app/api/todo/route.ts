import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { auth } from '@clerk/nextjs';

export async function GET(request: NextRequest) {
    const {userId} = auth();
 
    if(!userId){
      return new Response("Unauthorized", { status: 401 });
    }

    const hideCompleted = request.nextUrl.searchParams.get("hideCompleted") === "true";

    try {
        const d = await prisma.todo.findMany({
            where: {
                completed: hideCompleted ? false : undefined,
                user_id: userId
            }
        });
        return NextResponse.json(d);
    } catch (e: any) {
        return NextResponse.error();
    }
}

export async function POST(req: Request) {
    const {userId} = auth();
 
  if(!userId){
    return new Response("Unauthorized", { status: 401 });
  }
    try {
        const body = await req.json();
        const newTodo = await prisma.todo.create({
            data: {
                title: body[0].title,
                description: body[0].description,
                completed: false,
                user_id: userId
            }
        })

        return NextResponse.json(newTodo);
    } catch (e: any) {
        // console.log(e);
        return NextResponse.error();
    }
}

export async function DELETE(req: Request) {
    const {userId} = auth();
 
  if(!userId){
    return new Response("Unauthorized", { status: 401 });
  }
    try {
        const body = await req.json();
        const todo = await prisma.todo.delete({
            where: {
                id: body.id,
                user_id: userId
            }
        })

        return NextResponse.json(todo);
    } catch (e: any) {
        return NextResponse.error();
    }
}