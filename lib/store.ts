import { configureStore } from '@reduxjs/toolkit'
import { todosApi } from './features/todos/todosSlice'
import { setupListeners } from '@reduxjs/toolkit/query'

export const store = configureStore({
  reducer: {
      [todosApi.reducerPath]: todosApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(todosApi.middleware),
})

// Infer the type of makeStore
setupListeners(store.dispatch)
