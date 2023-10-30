import ToDoTable from "./components/todoTable";
import { auth } from '@clerk/nextjs';

async function getData() {
    const { getToken } = auth();    
    const res = await fetch('http://localhost:3000/api/todo', { cache: 'no-store',  headers: { Authorization: `Bearer ${await getToken()}` }});

    if(!res.ok) {
        console.log(res);
        
    }
    
    return res.json();
}

export default async function TodoPage() {
    const data: Todo[] = await getData();
    
    return (
        <>
        <h1>TEST</h1>
        <ToDoTable todos={data} />
        </>
    )
}