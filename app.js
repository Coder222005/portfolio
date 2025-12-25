const BLOGS_SRC = 'blogs.json'

let blogs = []
const $ = sel => document.querySelector(sel)

async function loadBlogs(){
  try{
    const res = await fetch(BLOGS_SRC,{cache:'no-store'})
    blogs = await res.json()
  }catch(e){
    const stored = localStorage.getItem('blogs_backup')
    blogs = stored ? JSON.parse(stored) : []
  }
  renderBlogs()
}

function renderBlogs(){
  const list = $('#blogList')
  if(!blogs.length) return list.innerHTML = '<p>No posts yet.</p>'
  list.innerHTML = ''
  blogs.slice().reverse().forEach(post=>{
    const el = document.createElement('div')
    el.className = 'post'
    el.innerHTML = `
      <h3>${escapeHtml(post.title)}</h3>
      <div class="meta">${post.date || ''} · ${post.tags?.join(', ') || ''}</div>
      <div class="content">${post.content}</div>
      <div style="margin-top:8px"><button data-id="${post.id}" class="editBtn">Edit</button></div>
    `
    list.appendChild(el)
  })
  attachEditButtons()
}

function attachEditButtons(){
  document.querySelectorAll('.editBtn').forEach(b=>b.onclick = e=>{
    const id = e.target.dataset.id
    openEditor(blogs.find(p=>p.id==id))
  })
}

function openEditor(post){
  const modal = $('#editorModal')
  const form = $('#postForm')
  modal.classList.remove('hidden')
  form.title.value = post?.title || ''
  form.date.value = post?.date || new Date().toISOString().slice(0,10)
  form.tags.value = (post?.tags||[]).join(', ')
  form.content.value = post?.content || ''
  document.getElementById('formTitle').textContent = post ? 'Edit Post' : 'New Post'
  form.onsubmit = e => {
    e.preventDefault()
    const data = {
      id: post?.id || Date.now().toString(36),
      title: form.title.value.trim(),
      date: form.date.value,
      tags: form.tags.value.split(',').map(s=>s.trim()).filter(Boolean),
      content: form.content.value
    }
    if(post){
      const idx = blogs.findIndex(p=>p.id==post.id); blogs[idx]=data
    }else blogs.push(data)
    localStorage.setItem('blogs_backup', JSON.stringify(blogs))
    closeEditor()
    renderBlogs()
  }
}

function closeEditor(){
  $('#editorModal').classList.add('hidden')
}

function downloadBlogs(){
  const blob = new Blob([JSON.stringify(blogs, null, 2)],{type:'application/json'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'blogs.json'
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
}

function escapeHtml(s){
  return (s||'')
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
}

function toggleAntigravity(){
  document.body.classList.toggle('antigravity')
}

document.addEventListener('DOMContentLoaded', ()=>{
  loadBlogs()
  $('#newPostBtn').onclick = ()=>openEditor()
  $('#cancelEdit').onclick = closeEditor
  $('#downloadBtn').onclick = downloadBlogs
  $('#antigravityBtn').onclick = toggleAntigravity
})
