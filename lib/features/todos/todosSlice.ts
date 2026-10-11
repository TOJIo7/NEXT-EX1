import { IRequestTodos, ITodo } from "@/types/typesRtk";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



export const todosApi = createApi({
    reducerPath: 'todosApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://to-dos-api.softclub.tj/api/' }),
    endpoints: (build) => ({
        getTodos: build.query<IRequestTodos, string>({
            query: () => 'to-dos'
        }),
        getTaskById: build.query<IRequestTodos, number>({
            query: (id) => (`to-dos/${id}`)
        }),
        delTask: build.mutation<IRequestTodos, string>({
            query: (id) => ({
                url: `to-dos?id=${id}`,
                method: 'DELETE'
            })
        }),
        addTask: build.mutation<IRequestTodos, FormData>({
            query: (body) => ({
                url: 'to-dos',
                method: 'POST',
                body
            })
        }),
        editTask: build.mutation<IRequestTodos, any>({
            query: (body) => ({
                url: 'to-dos',
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body
            })
        }),
        delImg: build.mutation<IRequestTodos, number>({
            query: (id) => ({
                url: `to-dos/images/${id}`,
                method: 'DELETE'
            })
        }),
        postImg: build.mutation<IRequestTodos, FormData>({
            query: (formData: any) => {

                const id = formData.get('id')

                return {
                    url: `to-dos/${id}/images`,
                    method: 'POST',
                    body: formData
                }
            }
        }),
        switchStatus: build.mutation<IRequestTodos, number>({
            query: (id) => ({
                url: `../completed?id=${id}`,
                method: 'PUT'
            })
        })
    })

})

export const {
    useGetTodosQuery,
    useGetTaskByIdQuery,
    useDelTaskMutation,
    useAddTaskMutation,
    useEditTaskMutation,
    useDelImgMutation,
    usePostImgMutation,
    useSwitchStatusMutation,
} = todosApi