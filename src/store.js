import { createStore, applyMiddleware } from 'redux'
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

const middlewareEnhancer = applyMiddleware(loggerMiddleware)

const composedEnhancer = composeWithDevTools(middlewareEnhancer)

const store = createStore(rootReducer, preloadedState, composedEnhancer)

export default store