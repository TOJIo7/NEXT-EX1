

export interface IRequestTodos{
    data: ITodo[] | boolean,
    errors: [] | unknown,
    statusCode: number
}

export interface ITodo{
    id: number,
    isComplited: boolean,
    images: IImages[]
    name: string,
    description: string
}
export interface IImages{
    id: number,
    imageName: string
}
export interface IPostRequest{
    data: number,
    errors: [],
    statusCode: number
}