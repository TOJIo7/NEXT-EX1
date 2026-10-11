'use client'

import { useAddTaskMutation, useDelImgMutation, useDelTaskMutation, useEditTaskMutation, useGetTodosQuery, usePostImgMutation } from "@/lib/features/todos/todosSlice";
import { ITodo } from "@/types/typesRtk";
import Link from "next/link";
import React, { useState } from "react";

export default function Home() {
  const { data, refetch } = useGetTodosQuery('');
  const [delTask] = useDelTaskMutation();
  const [addTask] = useAddTaskMutation();
  const [editTask] = useEditTaskMutation();

  const [delImg] = useDelImgMutation();
  const [postImg] = usePostImgMutation();

  async function handleDelete(id: number | string) {
    try {
      await delTask(id).unwrap();
      await refetch();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const [addNewTask, setAddNewTask] = useState<{ images: File | string, name: string, description: string }>({ images: '', name: '', description: '' })
  const [editTaskData, setEditTaskData] = useState({ name: '', description: '', id: 0 })
  const [selectedImg, setSelectedImg] = useState<{ img: File | string, id: number }>({ img: '', id: 0 })

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
    formData.append('id', String(selectedImg.id))

    await postImg(formData)
    await refetch()
    setSelectedImg({ id: 0, img: '' })
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center pb-3 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Tasks Dashboard</h1>
        <Link 
          href='about' 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm transition"
        >
          ABOUT
        </Link>
      </div>

      {/* Forms Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Task */}
        <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm space-y-3">
          <h2 className="text-xl font-bold text-gray-800">Add Task</h2>
          <input 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddNewTask({ ...addNewTask, images: e.target?.files?.[0] || '' })} 
            className="w-full border border-gray-300 p-2 rounded text-sm bg-gray-50" 
            type="file" 
          />
          <input 
            value={addNewTask.name} 
            onChange={(e) => setAddNewTask({ ...addNewTask, name: e.target.value })} 
            className="w-full border border-gray-300 p-2 rounded text-sm" 
            type="text" 
            placeholder="Name" 
          />
          <input 
            value={addNewTask.description} 
            onChange={(e) => setAddNewTask({ ...addNewTask, description: e.target.value })} 
            className="w-full border border-gray-300 p-2 rounded text-sm" 
            type="text" 
            placeholder="Description" 
          />
          <button 
            onClick={postTask} 
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold p-2.5 rounded transition cursor-pointer"
          >
            Post
          </button>
        </div>

        {/* Edit Task */}
        <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm space-y-3">
          <h2 className="text-xl font-bold text-gray-800">Edit Task</h2>
          <input 
            value={editTaskData.name} 
            onChange={(e) => setEditTaskData({ ...editTaskData, name: e.target.value })} 
            className="w-full border border-gray-300 p-2 rounded text-sm" 
            type="text" 
            placeholder="Name" 
          />
          <input 
            value={editTaskData.description} 
            onChange={(e) => setEditTaskData({ ...editTaskData, description: e.target.value })} 
            className="w-full border border-gray-300 p-2 rounded text-sm" 
            type="text" 
            placeholder="Description" 
          />
          <button 
            onClick={handleEdit} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-2.5 rounded transition cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="pt-2">
        <h2 className="text-3xl font-bold text-gray-800">Welcome User</h2>
        <p className="text-gray-500 text-sm mt-1">All users & tasks list:</p>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '150px' }}>Images</th>
              <th style={{ width: '180px' }}>Upload Image</th>
              <th style={{ width: '150px' }}>Name</th>
              <th>Description</th>
              <th style={{ width: '130px' }}>Status</th>
              <th style={{ width: '220px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.data && Array.isArray(data.data) && data.data.map((el: ITodo) => (
              <tr key={el.id}>
                {/* Images */}
                <td>
                  <div className="flex flex-col gap-2">
                    {el.images && el.images.length > 0 ? (
                      el.images.map(img => (
                        <div key={img.id} className="flex flex-col gap-1 items-start">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={`https://to-dos-api.softclub.tj/images/${img.imageName}`} 
                            alt="task img"
                            className="w-20 h-20 object-cover rounded border border-gray-300"
                          />
                          <button
                            onClick={() => handleDelImg(img.id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-2 py-1 text-xs rounded transition cursor-pointer"
                          >
                            Delete Image
                          </button>
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs italic">No images</span>
                    )}
                  </div>
                </td>

                {/* Upload Image */}
                <td>
                  <div className="flex flex-col gap-2">
                    <input 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedImg({ id: el.id, img: e.target?.files?.[0] || '' })} 
                      type="file" 
                      className="text-xs border border-gray-300 p-1.5 rounded w-full bg-gray-50 cursor-pointer" 
                    />
                    {selectedImg.id === el.id && selectedImg.img ? (
                      <button 
                        onClick={handlePostImg} 
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1.5 px-3 text-xs rounded transition cursor-pointer"
                      >
                        Post Image
                      </button>
                    ) : null}
                  </div>
                </td>

                {/* Name */}
                <td className="font-semibold text-gray-900">
                  {el.name}
                </td>

                {/* Description */}
                <td className="text-gray-700">
                  {el.description}
                </td>

                {/* Status */}
                <td>
                  <span className={`inline-block font-semibold px-2.5 py-1 rounded text-xs ${(el.isComplited || el.isCompleted) ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {(el.isComplited || el.isCompleted) ? 'Complited' : 'Not Complited'}
                  </span>
                </td>

                {/* Actions */}
                <td>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleDelete(el.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1.5 text-xs rounded transition cursor-pointer"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => switchEdit(el)}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-3 py-1.5 text-xs rounded transition cursor-pointer"
                    >
                      Edit
                    </button>
                    <Link 
                      href={`info/${el.id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 text-xs rounded transition text-center"
                    >
                      Info
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
