import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ReactComponent as TimesSolid } from './times-solid.svg'
import { availableColors, capitalize } from '../filters/colors'
import { selectTodoById } from './todosSlice'

// const selectTodoById = (state, todoId) => {
//     return state.todos.entities.find(todo => todo.id === todoId)
// }

const TodoListItem = ({ id }) => {
    // careful about using a selector with multiple arguments!
    // calling useSelector(selectThatJustTakesStateAsAParam) is fine
    // -> A selector is a function that takes the entire Redux store
    //    state as its argument, reads some value from the state, and
    //    returns that result.
    // HOWEVER, if you're calling a selector with another argument
    // without explicitly passing in the state as part of an arrow
    // func e.g. useSelector(selectWithASecondParam(state, param2))
    // will appear to overwrite state unless state is explicitly
    // declared as a param. So probably best not to use implicit state.
    const todo = useSelector(state => selectTodoById(state, id))
    const { text, completed, color } = todo

    const dispatch = useDispatch()

    const handleCompletedChanged = (e) => {
        dispatch({ type: 'todos/todoToggled', payload: todo.id})
    }

    const handleColorChanged = (e) => {
        const payload = {
            todoId: todo.id,
            color: e.target.value
        }
        dispatch({ type: 'todos/todoColored', payload: payload })
    }

    const handleDelete = (e) => {
        dispatch({ type: 'todos/todoDeleted', payload: todo.id})
    }

    const colorOptions = availableColors.map((c) => (
        <option key={c} value={c}>
            {capitalize(c)}
        </option>
    ))

    return (
        <li>
            <div className="view">
                <div className="segment label">
                    <input
                        className="toggle"
                        type="checkbox"
                        checked={completed}
                        onChange={handleCompletedChanged}
                    />
                    <div className="todo-text">{text}</div>
                </div>
                <div className="segment buttons">
                    <select
                        className="colorPicker"
                        value={color}
                        style={{ color }}
                        onChange={handleColorChanged}
                    >
                        <option value=""></option>
                        {colorOptions}
                    </select>
                    <button className="destroy" onClick={handleDelete}>
                        <TimesSolid />
                    </button>
                </div>
            </div>
        </li>
    )
}

export default TodoListItem