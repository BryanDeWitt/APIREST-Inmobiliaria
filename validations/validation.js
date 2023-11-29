import { z } from 'zod'

export const houseSchema = z.object({
  name: z.string({
    invalid_type_error: 'House name must be a string',
    required_error: 'House name is required'
  }).min(5, { message: 'House name must be at least 5 characters long' }),
  description: z.string({
    invalid_type_error: 'House description must be a string',
    required_error: 'House description is required'
  }).min(30, { message: 'House description must be at least 30 characters long' }),
  price: z.number({}).min(0, { message: 'House price must be at least 0' }),
  location: z.string({
    invalid_type_error: 'House location must be a string',
    required_error: 'House location is required'
  }).min(5, { message: 'House location must be at least 5 characters long' }),
  locationURL: z.string({}).url(),
  bathroom: z.number({}).min(1, { message: 'House bathroom must be at least 1' }),
  kitchen: z.number({}).min(1, { message: 'House kitchen must be at least 1' }),
  bedroom: z.number({}).min(1, { message: 'House bedroom must be at least 1' }),
  livingroom: z.optional(z.number({}).min(1, { message: 'House livingroom must be at least 1' })),
  garage: z.boolean(),
  garden: z.boolean(),
  details: z.string({
    invalid_type_error: 'House details must be a string',
    required_error: 'House details is required'
  }).min(5, { message: 'House details must be at least 5 characters long' })
})

export const validateHouse = (house) => {
  return houseSchema.safeParse(house)
}

export const validatePartialHouse = (house) => {
  return houseSchema.partial().safeParse(house)
}
