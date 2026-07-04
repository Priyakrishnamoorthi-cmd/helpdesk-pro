import { useState } from 'react'
import axios from 'axios'

const API = 'http://localhost:5000/api/auth'

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = isRegister ? `${API}/register` : `${API}/login`
      const res = await axios.post(url, form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      onLogin(res.data.user)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '10px', fontFamily: 'Arial' }}>
      <h2 style={{ textAlign: 'center' }}>🎫 HelpDesk Pro</h2>
      <h3 style={{ textAlign: 'center' }}>{isRegister ? 'Register' : 'Login'}</h3>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <>
            <input style={{ width: '100%', padding: '8px', marginBottom: '10px' }} placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <select style={{ width: '100%', padding: '8px', marginBottom: '10px' }} value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </>
        )}
        <input style={{ width: '100%', padding: '8px', marginBottom: '10px' }} placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        <input style={{ width: '100%', padding: '8px', marginBottom: '10px' }} placeholder="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
        <button style={{ width: '100%', padding: '10px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }} type="submit">
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>
      <p onClick={() => { setIsRegister(!isRegister); setError('') }} style={{ textAlign: 'center', cursor: 'pointer', color: 'blue', marginTop: '15px' }}>
        {isRegister ? 'Already have account? Login' : "Don't have account? Register"}
      </p>
    </div>
  )
}

export default Login