'use client'

import { useGetTaskByIdQuery, useSwitchStatusMutation } from "@/lib/features/todos/todosSlice"
import { useParams } from "next/navigation"



export default function page() {
  const { id } = useParams()
  const { data, refetch } = useGetTaskByIdQuery(id)
  const task = data?.data

  const [switchStatus] = useSwitchStatusMutation()

  async function handleSwitchStatus(id: number) {
    await switchStatus(id)
    await refetch()
  }


  if (task)
    console.log(task.isCompleted)
  return (
    <>
      <div className="flex flex-col gap-5 items-center p-10">
        <p>ID: {task?.id}</p>
        <h1 className="text-2xl font-bold">Name: {task?.name}</h1>
        <p className="text-lg">Description: {task?.description}</p>
        <p className="text-xl font-semibold">Status: {task?.isCompleted ? 'Complited' : 'Not Complited'}</p>
        <button onClick={() => handleSwitchStatus(task.id)} className="bg-orange-500 p-2 text-white font-bold rounded-sm hover:rounded-lg hover:bg-orange-800 transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
          Switch Status
        </button>
      </div>
    </>
  )
}
