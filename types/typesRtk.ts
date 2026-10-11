export interface IRequestTodos {
    data: ITodo[],
    errors: unknown,
    statusCode: number
}

export interface IRequestSingleTodo {
    data: ITodo,
    errors: unknown,
    statusCode: number
}

export interface ITodo {
    id: number,
    isCompleted?: boolean,
    isComplited?: boolean,
    images: IImages[],
    name: string,
    description: string
}

export interface IImages {
    id: number,
    imageName: string
}

export interface IPostRequest {
    data: number,
    errors: unknown,
    statusCode: number
}

export interface IEditTaskPayload {
    id: number,
    name: string,
    description: string
}