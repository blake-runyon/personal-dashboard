import ToDoTable from "./components/todoTable";

async function getData() {
    const res = await fetch('http://localhost:3000/api/todo', { cache: 'no-store'});

    if(!res.ok) {
        throw new Error('failed to fetch data');
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