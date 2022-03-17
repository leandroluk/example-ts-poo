export type Indexable = {
  id: number
}
export type Entity = Indexable & {
  createdAt: Date
  updatedAt?: Date
}
export type User = Entity & {
  displayName: string
  email: string
  password: string
  photoURL?: string
}
export type UserWithoutPassword = Omit<User, 'password'>
export type AddUser = Omit<User, keyof Entity>
export type EditUser = Partial<Omit<User, keyof Entity>>

export interface GenericCrudDAO<Type extends Entity, AddType = Omit<Type, keyof Entity>, EditType = Partial<Omit<Type, keyof Entity>>, ReturnType = Type> {
  get(id: Type['id']): Promise<ReturnType>
  add(data: AddType): Promise<Entity['id']>
  edit(id: Type['id'], changes: EditType): Promise<void>
  delete(id: Type['id']): Promise<void>
  list(): Promise<ReturnType[]>
}