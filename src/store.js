import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducer'
import { loggerMiddleware } from './exampleAddons/middleware'

let preloadedState
const persistedTodosString = localStorage.getItem('todos')

if (persistedTodosString) {
    preloadedState = {
        todos: JSON.parse(persistedTodosString)
    }
}

const middlewares = [
    loggerMiddleware,
    thunkMiddleware
]

// const middlewareEnhancer = applyMiddleware(thunkMiddleware)

const middlewareEnhancer = applyMiddleware(...middlewares)

const composedEnhancer = composeWithDevTools(middlewareEnhancer)

const store = createStore(rootReducer, preloadedState, composedEnhancer)

export default store