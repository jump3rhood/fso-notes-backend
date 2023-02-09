const express = require('express')
const cors = require('cors')
const app = express()

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]
const requestLogger = (req, res, next) => {
  console.log('Method:', req.method);
  console.log('Path:', req.path)
  console.log('Body:', req.body) 
  console.log('----------')
  next(); 
}
const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'Unknown Endpoint'})
}
app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(express.static('build'))
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}
app.get('/', (req,res)=>{
  res.send('hello')
})

//app.method(PATH,HANDLER);
app.get('/api/notes', (request, response) => {
  response.json(notes)
})
app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find(note => note.id === id)
  if(note)
    res.json(note)
  else
    res.status(404).end()
})

app.post('/api/notes', (req, res)=> {
  const body = req.body;
  if(!body.content){
    // 400 -bad request
    return res.status(400).json({
      error: 'Content missing'
    })
  }
  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId()
  }  
  notes = notes.concat(note)
  res.json(note)
})
app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter(note => note.id !== id)
  
  res.status(204).end()
})

app.use(unknownEndpoint)
const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=> console.log(`Server listening on port ${PORT}`))