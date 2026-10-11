'use client'

import { useGetTaskByIdQuery, useSwitchStatusMutation } from "@/lib/features/todos/todosSlice"
import { useParams } from "next/navigation"
import Link from "next/link"

export default function Page() {
  const params = useParams()
  const rawId = params?.id
  const id = Array.isArray(rawId) ? rawId[0] : rawId
  const { data, refetch } = useGetTaskByIdQuery(id)
  const task = data?.data

  const [switchStatus] = useSwitchStatusMutation()

  async function handleSwitchStatus(taskId: number) {
    await switchStatus(taskId)
    await refetch()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-lg">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 mb-4"
        >
          ← Back to Tasks
        </Link>
        
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-zinc-800">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Task #{task?.id}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded ${(task?.isCompleted || task?.isComplited) ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
              {(task?.isCompleted || task?.isComplited) ? 'Complited' : 'Not Complited'}
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-bold">{task?.name || 'Loading...'}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm leading-relaxed">
              {task?.description || 'No description'}
            </p>
          </div>

          <div className="pt-2">
            <button 
              onClick={() => task && handleSwitchStatus(task.id)} 
              disabled={!task}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold p-2.5 rounded-lg transition cursor-pointer disabled:opacity-50"
            >
              Switch Status
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
