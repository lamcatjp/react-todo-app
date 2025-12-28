import { useState, useEffect } from 'react'
import './App.css'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (input.trim() === '') return
    
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: input.trim(),
      completed: false,
      createdAt: Date.now()
    }
    
    setTodos([...todos, newTodo])
    setInput('')
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const activeCount = todos.filter(todo => !todo.completed).length
  const completedCount = todos.filter(todo => todo.completed).length

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>TODOアプリ</h1>
          <p className="subtitle">タスクを管理して、生産性を向上させましょう</p>
        </header>

        <div className="input-section">
          <input
            type="text"
            className="todo-input"
            placeholder="新しいタスクを入力..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          />
          <button className="add-button" onClick={addTodo}>
            追加
          </button>
        </div>

        {todos.length > 0 && (
          <div className="filter-section">
            <button
              className={`filter-button ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              すべて ({todos.length})
            </button>
            <button
              className={`filter-button ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              未完了 ({activeCount})
            </button>
            <button
              className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              完了 ({completedCount})
            </button>
          </div>
        )}

        <div className="todos-section">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              {todos.length === 0 ? (
                <p>タスクがありません。新しいタスクを追加してください。</p>
              ) : (
                <p>表示するタスクがありません。</p>
              )}
            </div>
          ) : (
            <ul className="todo-list">
              {filteredTodos.map(todo => (
                <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <input
                    type="checkbox"
                    className="todo-checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                  <span className="todo-text">{todo.text}</span>
                  <button
                    className="delete-button"
                    onClick={() => deleteTodo(todo.id)}
                    aria-label="削除"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {completedCount > 0 && (
          <div className="actions-section">
            <button className="clear-button" onClick={clearCompleted}>
              完了したタスクを削除
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

