const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', function (req, res) { 
  if(JSON.stringify(req.body) != '{}') {
    return JSON.stringify(req.body)
  }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



let persons = [
      {
        name: 'Arto Hellas',
        number: '040-123456',
        id: 1
      },
      {
        name: 'Ada Lovelace',
        number: '39-44-5323523',
        id: 2
      },
      {
        name: 'Dan Abramov',
        number: '12-43-234345',
        id: 3
      },
      {
        name: 'Mary Poppendieck',
        number: '39-23-6423122',
        id: 4
      }
    ]

app.get('/', (request, response) => {
    console.log('hello world')
    response.send('<h1>Hello World!</h1>')
})
      
app.get('/api/persons', (request, response) => {
    console.log('get all')
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  console.log('get person')
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
      console.log('found')
      response.json(person)
    } else {
      console.log('not found')
      response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log('delete ', id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.get('/api/info', (request, response) => {
  console.log('info')
  response.send(
    `Phonebook has info for ${persons.length} people
    <p>${new Date()}</p>`
  )
})

const generateId = () => {
  const id = Math.floor(Math.random()*10000000000000)
  return id
}

app.post('/api/persons', (request, response) => {
  console.log('post new')
  const body = request.body

  if (!body.name) {
    console.log('name missing')
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    console.log('number missing')
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  const persons_names = persons.map(person => person.name)
  if (persons_names.includes(body.name)) {
    console.log('name must be unique')
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)
  console.log('add ', person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})