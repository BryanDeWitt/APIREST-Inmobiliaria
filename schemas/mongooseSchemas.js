import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  verificated: Boolean
})

const imagesSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: false
  },
  mainImage: String,
  gallery: [String]
})

const houseSchema = new Schema({
  name: String,
  description: String,
  price: Number,
  location: String,
  locationURL: String,
  bathroom: Number,
  kitchen: Number,
  bedroom: Number,
  livingroom: Number,
  garage: Boolean,
  garden: Boolean,
  details: String,
  images: imagesSchema
})

const User = mongoose.model('User', userSchema)
const House = mongoose.model('House', houseSchema)

export { User, House }
