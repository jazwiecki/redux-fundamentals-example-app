import { client } from '../../api/client'
import { createSelector } from 'reselect'

import { StatusFilters } from '../filters/filtersSlice'

const initialState = {
    status: 'idle',
    entities: []
}

////////////
// reducer
////////////
export default function todosReducer(state = initialState, action) {
    switch (action.type) {
        case 'todos/todoAdded': {
            return {
                ...state,
                entities: [...state.entities, action.payload]
            }
        }
        case 'todos/todoDeleted': {
            return {
                ...state,
                entities: state.entities.filter((todo) => todo.id !== action.payload)
            }
        }
        case 'todos/todoToggled': {
            return {
                ...state,
                entities: state.entities.map(todo => {
                    if (todo.id !== action.payload) {
                        return todo
                    }

                    return {
                        ...todo,
                        completed: !todo.completed
                    }
                })
            }
        }
        case 'todos/todoColored': {
            return {
                ...state,
                entities: state.entities.map(todo => {
                    if (todo.id !== action.payload.todoId) {
                        return todo
                    }

                    return {
                        ...todo,
                        color: action.payload.color
                    }
                })
            }
        }
        case 'todos/allCompleted': {
            return {
                ...state,
                entities: state.entities.map((todo) => {
                            return { ...todo, completed: true }
                        })
                }
        }
        case 'todos/completedCleared': {
            return {
                ...state,
                entities: state.entities.filter((todo) => !todo.completed)
            }
        }
        case 'todos/todosLoading': {
            return {
                ...state,
                status: 'loading'
            }
        }
        case 'todos/todosLoaded': {
            return {
                ...state,
                status: 'idle',
                entities: action.payload
            }
        }
        default:
            return state
    }
}

////////////
// action creators
////////////
export const todosLoading = todos => {
    return {
        type: 'todos/todosLoading'
    }
}

export const todosLoaded = todos => {
    return {
        type: 'todos/todosLoaded',
        payload: todos
    }
}

export const todoAdded = todo => ({ type: 'todos/todoAdded', payload: todo })


export const fetchTodos = () => async dispatch => {
    dispatch(todosLoading())
    const response = await client.get('/fakeApi/todos')
    dispatch(todosLoaded(response.todos))
}

export function saveNewTodo(text) {
    return async function saveNewTodoThunk(dispatch, getState) {
        const initialTodo = { text }
        const response = await client.post('/fakeApi/todos', { todo: initialTodo })
        dispatch(todoAdded(response.todo))
    }
}

export const selectTodos = state => {
    return state.todos.entities
}

export const selectTodoById = (state, todoId) => {
    return selectTodos(state).find(todo => todo.id === todoId)
}

export const selectTodoIds = createSelector(
    // input selector
    state => selectTodos(state),
    // output selector
    todos => todos.map(todo => todo.id)
)

export const selectFilteredTodos = createSelector(
    state => selectTodos(state),
    state => state.filters,
    (todos, filters) => {
        const { status, colors } = filters
        const showAllCompletions = status === StatusFilters.All
        if (showAllCompletions && colors.length === 0) {
            return todos
        }

        const completedStatus = status === StatusFilters.Completed
        return todos.filter(todo => {
            const statusMatches =
                showAllCompletions || todo.completed === completedStatus
            const colorMatches = colors.length === 0 || colors.includes(todo.color)
            return statusMatches && colorMatches
        })
        // return todos.filter(todo => todo.completed === completedStatus)
    }
)

export const selectFilteredTodoIds = createSelector(
    state => selectFilteredTodos(state),
    filteredTodos => filteredTodos.map(todo => todo.id)
)


/////////////
// old code
/////////////

// export const todoAdded = todo => {
//     return {
//         type: 'todos/todoAdded',
//         payload: todo
//     }
// }

// export function fetchTodos(dispatch, getState) {
//     return async function fetchTodosThunk(dispatch, getState) {
//         const response = await client.get('/fakeApi/todos')
//         dispatch(todosLoaded(response.todos))
//     }
// }

// function nextTodoId(todos) {
//     const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
//     return maxId + 1
// }