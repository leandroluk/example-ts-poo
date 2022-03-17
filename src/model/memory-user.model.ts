import {
  AddUser,
  EditUser,
  Entity,
  GenericCrudDAO,
  User,
  UserWithoutPassword
} from "../domain"

export class MemoryUserDAO implements GenericCrudDAO<User, AddUser, EditUser, UserWithoutPassword> {
  private static data: UserWithoutPassword[] = []
  private static index = 0

  async get(id: User['id']): Promise<UserWithoutPassword> {
    const item = MemoryUserDAO.data.find(item => item.id === id)
    if (!item) throw new Error('Not found.')
    return item
  }

  async add(data: AddUser): Promise<Entity['id']> {
    const item = {
      ...data,
      id: ++MemoryUserDAO.index,
      createdAt: new Date()
    }
    MemoryUserDAO.data.push(item)
    return item.id
  }

  async edit(id: User['id'], changes: EditUser): Promise<void> {
    const index = MemoryUserDAO.data.findIndex(item => item.id === id)
    if (!~index) throw new Error('Not found.')
    MemoryUserDAO.data[index] = {
      ...MemoryUserDAO.data[index],
      ...changes,
      updatedAt: new Date()
    }
  }

  async delete(id: User['id']): Promise<void> {
    const index = MemoryUserDAO.data.findIndex(item => item.id === id)
    if (!~index) throw new Error('Not found.')
    MemoryUserDAO.data.splice(index, 1)
  }

  async list(): Promise<UserWithoutPassword[]> {
    return MemoryUserDAO.data
  }
}