const mongoose = require('mongoose')


if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const input_name = process.argv[3]
const input_number = process.argv[4]

const url = 
`mongodb+srv://fullstack:${password}@cluster0.v8qj6vf.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: mongoose.ObjectId,
})

const Person = mongoose.model('Person', personSchema)

if (input_name && input_number) {
    const person = new Person({
        name: input_name,
        number: input_number,
    })
    
    person.save().then(result => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
} else if (input_name) {
    console.log("add the phone number")
    process.exit(1)
} else {
    Person.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(person => {
          console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}
