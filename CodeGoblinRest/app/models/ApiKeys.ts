import { getModelForClass, ModelOptions, prop, ReturnModelType } from '@typegoose/typegoose'
import crypto from 'node:crypto'

@ModelOptions({ schemaOptions: { collection: 'api-keys' } })
export class ApiKeys {
  @prop({ type: String, required: true })
  public key!: string

  @prop({ type: String, required: false, default: null })
  public ownerId!: string

  @prop({ type: String, required: false, default: null })
  public ownerName!: string

  /**
   * Gets a key from the database
   * @param this
   * @param k
   * @returns
   */
  public static async getKey(this: ReturnModelType<typeof ApiKeys>, k: string) {
    return (await this.findOne({ key: k })) ?? null
  }

  /**
   * Creates a new key in the database
   * @param this
   * @param ownerId
   * @param ownerName
   */
  public static async createKey(
    this: ReturnModelType<typeof ApiKeys>,
    ownerId?: string,
    ownerName?: string
  ): Promise<void> {
    // Use the node crypto library to generate a random key
    const k = crypto.randomBytes(32).toString('hex')

    // Create a new key in the database
    await this.create({
      key: k,
      ownerId: ownerId ?? null,
      ownerName: ownerName ?? null,
    })
  }

  public static async deleteKey(
    this: ReturnModelType<typeof ApiKeys>,
    k: string
  ): Promise<boolean> {
    return await this.deleteOne({ key: k }).then((res) => (res.acknowledged ? true : false))
  }

  public static async deleteAllKeys(this: ReturnModelType<typeof ApiKeys>): Promise<boolean> {
    return await this.deleteMany({}).then((res) => (res.acknowledged ? true : false))
  }

  public static async getAllKeys(this: ReturnModelType<typeof ApiKeys>): Promise<ApiKeys[]> {
    return await this.find({})
  }

  public static async getKeyCount(this: ReturnModelType<typeof ApiKeys>): Promise<number> {
    return await this.countDocuments({})
  }

  /**
   * Checks if a key exists in the database
   * @param this
   * @param k
   * @returns
   */
  public static async checkIfKeyExists(
    this: ReturnModelType<typeof ApiKeys>,
    k: string
  ): Promise<boolean> {
    return await this.exists({ key: k }).then((res) => (res ? true : false))
  }
}

export const ApiKeysModel = getModelForClass(ApiKeys)
