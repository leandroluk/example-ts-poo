import {
  DAO,
  Entity,
  User
} from "../domain"

export class MemoryUserDAO implements
  DAO.Get<User, User.WithoutPassword>,
  DAO.Add<User.Add>,
  DAO.Edit<User, User.Edit>,
  DAO.Delete<User>,
  DAO.List<User.WithoutPassword>
{
  private static data: User.WithoutPassword[] = []
  private static index = 0

  async get(id: User['id']): Promise<User.WithoutPassword> {
    const item = MemoryUserDAO.data.find(item => item.id === id)
    if (!item) throw new Error('Not found.')
    return item
  }

  async add(data: User.Add): Promise<Entity['id']> {
    const item = {
      ...data,
      id: ++MemoryUserDAO.index,
      createdAt: new Date()
    }
    MemoryUserDAO.data.push(item)
    return item.id
  }

  async edit(id: User['id'], changes: User.Edit): Promise<void> {
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

  async list(): Promise<User.WithoutPassword[]> {
    return MemoryUserDAO.data
  }
}