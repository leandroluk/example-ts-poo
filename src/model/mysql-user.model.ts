import {
  Connection,
  OkPacket,
  Pool,
  RowDataPacket
} from 'mysql2/promise';
import {
  AddUser,
  EditUser,
  Entity,
  GenericCrudDAO,
  User,
  UserWithoutPassword
} from "../domain";


export class MySQLUserDAO implements GenericCrudDAO<User, AddUser, EditUser, UserWithoutPassword>{
  static TABLE = 'example-ts-poo.Users'
  static FIELDS = [
    'displayName',
    'email',
    'password',
    'photoURL'
  ]

  constructor(
    readonly db: Pool | Connection
  ) { }

  async get(id: number): Promise<UserWithoutPassword> {
    const sql = `
      SELECT id, createdAt, updatedAt, ${MySQLUserDAO.FIELDS.join(', ')} 
      FROM ${MySQLUserDAO.TABLE} 
      WHERE id = ?;
    `
    const [[result]] = await this.db.query<RowDataPacket[]>(sql, [id])
    return result as UserWithoutPassword
  }

  async add(data: AddUser): Promise<Entity['id']> {
    const sql = `
      INSERT INTO ${MySQLUserDAO.TABLE} (
        createdAt, ${MySQLUserDAO.FIELDS.join(', ')} 
      ) VALUES (?, ${MySQLUserDAO.FIELDS.map(() => '?').join(', ')});
    `
    const [{ insertId }] = await this.db.query<OkPacket>(sql, [
      new Date(),
      data.displayName,
      data.email,
      data.password,
      data.photoURL
    ])

    return insertId
  }

  async edit(id: number, changes: EditUser): Promise<void> {
    const keys = [...Object.keys(changes), 'updatedAt']
    const values = [...Object.values(changes), new Date(), id]
    const sql = `
      UPDATE ${MySQLUserDAO.TABLE} SET 
      ${keys.map(key => `${key} = ?`).join(', ')} 
      WHERE id = ?;
    `
    await this.db.query(sql, values)
  }

  async delete(id: number): Promise<void> {
    const sql = `
      DELETE FROM ${MySQLUserDAO.TABLE}
      WHERE id = ?;
    `
    await this.db.query(sql, [id])
  }

  async list(): Promise<UserWithoutPassword[]> {
    const sql = `
      SELECT id, createdAt, updatedAt, ${MySQLUserDAO.FIELDS.join(', ')} 
      FROM ${MySQLUserDAO.TABLE}
    `
    const [result] = await this.db.query<RowDataPacket[]>(sql)
    return result as UserWithoutPassword[]
  }
}