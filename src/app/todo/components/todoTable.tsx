"use client"
import { useState } from "react";

type Props = {
    todos: Todo[]
}

export default function ToDoTable({ todos }: Props) {
    const [items, setItems] = useState<Todo[]>(todos);
    const [newRows, setNewRows] = useState<Todo[]>([]);
    const [hideComplete, setHideComplete] = useState<boolean>(false);

    const handleCheckboxChange = (id: number) => {
        const newItems = items.map((item) => {
            if(item.id === id) {
                item.completed = !item.completed;
            }

            return item;
        });

        setItems(newItems);
    }

    const handleNewRowChange = (id: number, property: string, value: string) => {
        // handle new row change
        const editedRows = newRows.map((row) => {
            if(row.id === id) {
                switch(property) {
                    case "title":
                        row.title = value;
                        break;
                    case "description":
                        row.description = value;
                        break;
                    case "completed":
                        row.completed = !row.completed;
                        break;
                }
            }

            return row;
        });

        setNewRows(editedRows);
    }

    const handleNewRow = () => {
        const rand = Math.floor((Math.random() * 1000000) + 1);
        const addRow: Todo[] = [...newRows, { id: rand, title: "", description: "", completed: false, user_id: 1 }];

        setNewRows(addRow);
        console.log(newRows);
    }

    const handleSave = async () => {
        const prepareRows = newRows.map((r) => {
            delete r.id; // remove id so that the api can create a new row
            delete r.completed;
            return r;
        });
        
        const res = await fetch('http://localhost:3000/api/todo', {
            method: 'POST',
            body: JSON.stringify(prepareRows),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(!res.ok) {
            throw new Error('failed to save data');
        }

        setNewRows([]);
        retrieveTodos();
    }

    const retrieveTodos = async () => {
       await fetch('http://localhost:3000/api/todo', { cache: 'no-store'})
        .then((res) => {
            if(!res.ok) {
                throw new Error('failed to fetch data');
            }

            return res.json();
        })
        .then((data) => {
            setItems(data as Todo[]);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    const hideCompleted = () => {
        setHideComplete(!hideComplete);
        if(hideComplete) {
            setItems(items.filter((item) => {
                return !item.completed;
            }));
        } else {
            setItems(todos);
        }
    }

    return (
        <div className="overflow-x-auto">
            <button className="btn btn-primary" onClick={() => { handleNewRow() }}>NEW</button>
            <button className="btn btn-accent" onClick={() => { handleSave() }}>SAVE</button>
            <button className="btn btn-danger" onClick={() => { hideCompleted() }}>{ hideComplete ? "Hide Completed" : "Show Completed" }</button>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Completed?</th>
                    </tr>
                </thead>
                <tbody>
                {
                    items.map((todo) => (
                        <tr key={todo.id}>
                            <td>{todo.id}</td>
                            <td>{todo.title}</td>
                            <td>{todo.description ? todo.description : <i>No Value</i>}</td>
                            <th>
                                <input type="checkbox" checked={todo.completed} onChange={() => { handleCheckboxChange(todo.id!) }}/>
                            </th>
                        </tr>
                    ))
                }
                {
                    newRows.length > 0 ? newRows.map((todo) => (
                        <>
                        <tr key={todo.id}>
                            <td>
                                #
                            </td>
                            <td>
                                <input type="text" name="title" id="title" value={todo.title} onChange={(e: any) => { handleNewRowChange(todo.id!, "title", e.target.value) }} />
                            </td>
                            <td>
                                <input type="text" name="description" id="description" value={todo.description} onChange={(e: any) => { handleNewRowChange(todo.id!, "description", e.target.value) }} />
                            </td>
                            <td>
                                <input type="checkbox" name="completed" id="completed" checked={todo.completed} onChange={(e: any) => { handleNewRowChange(todo.id!, "completed", e.target.value) }} />
                            </td>
                        </tr>
                        </>
                    )) : null
                }

                </tbody>
            </table>
        </div>
    )
}
