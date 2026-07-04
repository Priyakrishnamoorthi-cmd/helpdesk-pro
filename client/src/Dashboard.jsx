import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:5000/api/tickets'

function Dashboard({ user, onLogout }) {
  const [tickets, setTickets] = useState([])
  const [form, setForm] = useState({
    title: '', description: '', priority: 'Medium', category: 'General'
  })
  const [editId, setEditId] = useState(null)
  const [filter, setFilter] = useState('All')

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => { fetchTickets() }, [])

  const fetchTickets = async () => {
    const res = await axios.get(API, { headers })
    setTickets(res.data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editId) {
      await axios.put(`${API}/${editId}`, form, { headers })
      setEditId(null)
    } else {
      await axios.post(API, form, { headers })
    }
    setForm({ title: '', description: '', priority: 'Medium', category: 'General' })
    fetchTickets()
  }

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`, { headers })
    fetchTickets()
  }

  const handleEdit = (ticket) => {
    setForm({ title: ticket.title, description: ticket.description, priority: ticket.priority, category: ticket.category })
    setEditId(ticket._id)
  }

  const handleStatusChange = async (id, status) => {
    await axios.put(`${API}/${id}`, { status }, { headers })
    fetchTickets()
  }

  const filtered = filter === 'All' ? tickets : tickets.filter(t => t.status === filter)

  const statusColor = { 'Open': '#ff6b6b', 'In Progress': '#ffa500', 'Resolved': '#4CAF50', 'Closed': '#888' }
  const priorityColor = { 'Low': '#4CAF50', 'Medium': '#ffa500', 'High': '#ff6b6b', 'Critical': '#8b0000' }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>🎫 HelpDesk Pro</h1>
        <div>
          <span style={{ marginRight: '15px' }}>👤 {user.name} ({user.role})</span>
          <button onClick={onLogout} style={{ padding: '8px 15px', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
          <h3>{tickets.length}</h3><p>Total Tickets</p>
        </div>
        <div style={{ background: '#ffebee', padding: '15px', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
          <h3>{tickets.filter(t => t.status === 'Open').length}</h3><p>Open</p>
        </div>
        <div style={{ background: '#fff3e0', padding: '15px', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
          <h3>{tickets.filter(t => t.status === 'In Progress').length}</h3><p>In Progress</p>
        </div>
        <div style={{ background: '#e8f5e9', padding: '15px', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
          <h3>{tickets.filter(t => t.status === 'Resolved').length}</h3><p>Resolved</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>{editId ? 'Edit Ticket' : 'Create New Ticket'}</h3>
        <input style={{ width: '100%', padding: '8px', marginBottom: '10px' }} placeholder="Title*" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
        <textarea style={{ width: '100%', padding: '8px', marginBottom: '10px', height: '80px' }} placeholder="Description*" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <select style={{ flex: 1, padding: '8px' }} value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
            <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
          </select>
          <select style={{ flex: 1, padding: '8px' }} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
            <option>General</option><option>Technical</option><option>Billing</option><option>Feature Request</option>
          </select>
        </div>
        <button type="submit" style={{ padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}>
          {editId ? 'Update Ticket' : 'Create Ticket'}
        </button>
        {editId && <button onClick={() => setEditId(null)} style={{ padding: '10px 20px', background: '#888', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>}
      </form>

      <div style={{ marginBottom: '15px' }}>
        <b>Filter: </b>
        {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ marginRight: '8px', padding: '5px 12px', background: filter === s ? '#333' : '#ddd', color: filter === s ? 'white' : 'black', border: 'none', borderRadius: '15px', cursor: 'pointer' }}>{s}</button>
        ))}
      </div>

      <h3>Tickets ({filtered.length})</h3>
      {filtered.map(ticket => (
        <div key={ticket._id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <b>{ticket.title}</b>
            <div>
              <span style={{ background: statusColor[ticket.status], color: 'white', padding: '3px 8px', borderRadius: '10px', fontSize: '12px', marginRight: '8px' }}>{ticket.status}</span>
              <span style={{ background: priorityColor[ticket.priority], color: 'white', padding: '3px 8px', borderRadius: '10px', fontSize: '12px' }}>{ticket.priority}</span>
            </div>
          </div>
          <p style={{ color: '#666', margin: '8px 0' }}>{ticket.description}</p>
          <p style={{ fontSize: '12px', color: '#888' }}>Category: {ticket.category} | By: {ticket.createdBy?.name}</p>
          <div style={{ marginTop: '10px' }}>
            <select onChange={e => handleStatusChange(ticket._id, e.target.value)} value={ticket.status} style={{ marginRight: '10px', padding: '5px' }}>
              <option>Open</option><option>In Progress</option><option>Resolved</option><option>Closed</option>
            </select>
            <button onClick={() => handleEdit(ticket)} style={{ marginRight: '8px', padding: '5px 10px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Edit</button>
            <button onClick={() => handleDelete(ticket._id)} style={{ padding: '5px 10px', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Dashboard
