import { House } from '../schemas/mongooseSchemas.js'

export class HouseModel {
  static async getHouse () {
    return await House.find()
  }

  static async getHouseById ({ id }) {
    return await House.findById(id)
  }

  static async patchHouse ({ id, resultData }) {
    return await House.findByIdAndUpdate(id, resultData, { new: true })
  }

  static async createHouse ({ resultData, mainImageUrl, gallery }) {
    const newHouse = new House({
      ...resultData,
      images: {
        mainImage: mainImageUrl,
        gallery
      }
    })
    return await newHouse.save()
  }

  static async deleteHouse ({ id }) {
    return await House.findByIdAndDelete(id)
  }
}
