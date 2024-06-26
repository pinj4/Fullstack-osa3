const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [5, 'name needs to be at least 5 characters long'],
    required: true,
  },
  number: {
    type: String,
    minlength: [8, 'phone number needs to be at least 8 characters long'],
    validate: {
      validator: function(v) {
        return (/\d{3}-\d{5}/.test(v) || /\d{2}-\d{6}/.test(v))
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: true,
  },
  id: mongoose.ObjectId,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)