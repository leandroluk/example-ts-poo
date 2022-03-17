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
export namespace User {
  export type WithoutPassword = Omit<User, 'password'>
  export type Add = Omit<User, keyof Entity>
  export type Edit = Partial<Omit<User, keyof Entity>>
}

export namespace DAO {
  export interface Get<Type extends Indexable, ReturnType> {
    get(id: Type['id']): Promise<ReturnType>
  }

  export interface Add<AddType> {
    add(data: AddType): Promise<Indexable['id']>
  }

  export interface Edit<Type extends Indexable, ChangesType> {
    edit(id: Type['id'], changes: ChangesType): Promise<void>
  }

  export interface Delete<Type extends Indexable> {
    delete(id: Type['id']): Promise<void>
  }

  export interface List<ReturnType> {
    list(): Promise<ReturnType[]>
  }
}
