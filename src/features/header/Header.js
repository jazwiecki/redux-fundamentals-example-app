import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { saveNewTodo } from '../todos/todosSlice'

const Header = () => {
    const [text, setText] = useState('')
    const dispatch = useDispatch()

    const handleChange = (e) => setText(e.target.value)

    const handleKeyDown = e => {
        const trimmedText = e.target.value.trim()
        //e.which 13 = enter key
        if (e.which === 13 && trimmedText) {
            // dispatch({ type: 'todos/todoAdded', payload: trimmedText})
            dispatch(saveNewTodo(trimmedText))
            setText('')
        }
    }

    return (
        <header className="header">
            <input
                className="new-todo"
                placeholder="What needs to be done?"
                value={text}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
        </header>
    )
}

export default Header