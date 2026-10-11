'use client'

import { useAddTaskMutation, useDelImgMutation, useDelTaskMutation, useEditTaskMutation, useGetTodosQuery, usePostImgMutation } from "@/lib/features/todos/todosSlice";
import { ITodo } from "@/types/typesRtk";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const { data, refetch } = useGetTodosQuery('');
  const [delTask] = useDelTaskMutation();
  const [addTask] = useAddTaskMutation();
  const [editTask] = useEditTaskMutation();

  const [delImg] = useDelImgMutation();
  const [postImg] = usePostImgMutation();

  async function handleDelete(id: string) {
    try {
      await delTask(id).unwrap();
      await refetch();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const [addNewTask, setAddNewTask] = useState({ images: '', name: '', description: '' })
  const [editTaskData, setEditTaskData] = useState({ name: '', description: '', id: 0 })
  const [selectedImg, setSelectedImg] = useState({ img: '', id: 0 })

  async function postTask() {
    if (!addNewTask.name || !addNewTask.images || !addNewTask.description) return

    const formData = new FormData()
    formData.append('Images', addNewTask.images)
    formData.append('Name', addNewTask.name)
    formData.append('Description', addNewTask.description)

    await addTask(formData)
    await refetch()
    setAddNewTask({ name: '', description: '', images: '' })
  }

  function switchEdit(data: ITodo) {
    setEditTaskData({ id: data.id, name: data.name, description: data.description })
  }
  async function handleEdit() {
    await editTask(editTaskData)
    await refetch()

    setEditTaskData({ name: '', description: '', id: 0 })
  }

  async function handleDelImg(id: number) {
    await delImg(id)
    await refetch();
  }

  async function handlePostImg() {
    const formData = new FormData();
    formData.append('Images', selectedImg.img)
    formData.append('id', selectedImg.id)

    await postImg(formData)
    await refetch()
    setSelectedImg({ id: 0, img: '' })
  }

  return (
    <>
      <Link href='about'>ABOUT</Link>
      <div className="flex flex-col items-center gap-5">
        <div className="flex flex-col gap-5 items-center">
          <h1 className="text-2xl font-bold">Add Task</h1>
          <input onChange={(e) => setAddNewTask({ ...addNewTask, images: e.target?.files[0] })} className="w-full border border-gray-500 p-2 rounded-sm" type="file" />
          <input value={addNewTask.name} onChange={(e) => setAddNewTask({ ...addNewTask, name: e.target.value })} className="w-full border border-gray-500 p-2 rounded-sm" type="text" placeholder="name" />
          <input value={addNewTask.description} onChange={(e) => setAddNewTask({ ...addNewTask, description: e.target.value })} className="w-full border border-gray-500 p-2 rounded-sm" type="text" placeholder="description" />
          <button onClick={postTask} className="bg-green-600 w-full p-2 text-white font-bold rounded-sm hover:rounded-lg hover:bg-green-800 transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >Post
          </button>
        </div>

        <div className="flex flex-col gap-5 items-center">
          <h1 className="text-2xl font-bold">Edit Task</h1>
          <input value={editTaskData.name} onChange={(e) => setEditTaskData({ ...editTaskData, name: e.target.value })} className="w-full border border-gray-500 p-2 rounded-sm" type="text" placeholder="name" />
          <input value={editTaskData.description} onChange={(e) => setEditTaskData({ ...editTaskData, description: e.target.value })} className="w-full border border-gray-500 p-2 rounded-sm" type="text" placeholder="description" />
          <button onClick={handleEdit} className="bg-green-600 w-full p-2 text-white font-bold rounded-sm hover:rounded-lg hover:bg-green-800 transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >Save
          </button>
        </div>

        <h1 className="text-4xl font-bold">Welcome User</h1>
        <p className="text-xl">All users:</p>

        <div className="flex flex-col gap-5 items-center">
          {data?.data.map((el: ITodo) => (
            <div key={el.id} className="flex flex-col gap-3 w-100 bg-white p-5 rounded-lg text-black">
              <input onChange={(e) => setSelectedImg({ id: el.id, img: e.target.files[0] })} type="file" className="bg-green-600 w-full p-2 text-white font-bold rounded-sm hover:rounded-lg hover:bg-green-800 transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" />
              {selectedImg.id == el.id && selectedImg.img ?
                <button onClick={handlePostImg} className="bg-green-600 w-full p-2 text-white font-bold rounded-sm hover:rounded-lg hover:bg-green-800 transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >Post Image
                </button>
                : ""
              }
              <div className="flex gap-3">
                {el.images.map(img => (
                  <div className="flex flex-col gap-3" key={img.id}>
                    <img src={`https://to-dos-api.softclub.tj/images/${img.imageName}`}></img>
                    <button
                      onClick={() => handleDelImg(img.id)}
                      className="bg-red-500 p-2 text-white font-bold rounded-sm hover:rounded-lg hover:bg-red-800 transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Delete Image
                    </button>
                  </div>
                ))}
              </div>
              <h1 className="text-2xl font-bold">Name: {el.name}</h1>
              <p className="text-xl">Description: {el.description}</p>
              <p className="text-xl font-semibold">Status: {el.isComplited ? 'Complited' : 'Not Complited'}</p>
              <button
                onClick={() => handleDelete(el.id)}
                className="bg-red-500 p-2 text-white font-bold rounded-sm hover:rounded-lg hover:bg-red-800 transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >Delete
              </button>
              <button
                onClick={() => switchEdit(el)}
                className="bg-orange-500 p-2 text-white font-bold rounded-sm hover:rounded-lg hover:bg-orange-800 transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >Edit
              </button>
              <Link className="bg-orange-600 text-center p-2 text-white font-bold rounded-sm hover:rounded-lg hover:bg-orange-800 transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" href={`info/${el.id}`}>
                Info
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
