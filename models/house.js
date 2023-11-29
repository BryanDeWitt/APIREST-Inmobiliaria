import { House } from '../schemas/mongooseSchemas.js'

export class HouseModel {
  static async getAllHouses () {
    try {
      return await House.find()
    } catch (error) {
      console.error(error)
      throw new Error('Error fetching houses')
    }
  }

  static async getHouseById ({ id }) {
    try {
      return await House.findById(id)
    } catch (error) {
      console.error(error)
      throw new Error('Error fetching house by ID')
    }
  }

  static async patchHouse ({ id, resultData }) {
    try {
      return await House.findByIdAndUpdate(id, resultData, { new: true })
    } catch (error) {
      console.error(error)
      throw new Error('Error updating house')
    }
  }

  static async createHouse ({ resultData, mainImageUrl, gallery }) {
    try {
      const newHouse = new House({
        ...resultData,
        images: {
          mainImage: mainImageUrl,
          gallery
        }
      })
      return await newHouse.save()
    } catch (error) {
      console.error(error)
      throw new Error('Error creating house')
    }
  }

  static async deleteHouse ({ id }) {
    try {
      return await House.findByIdAndDelete(id)
    } catch (error) {
      console.error(error)
      throw new Error('Error deleting house')
    }
  }
}
