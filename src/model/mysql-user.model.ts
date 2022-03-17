import {
  Connection,
  OkPacket,
  Pool,
  RowDataPacket
} from 'mysql2/promise';
import {
  DAO,
  Entity,
  User
} from "../domain";


export class MySQLUserDAO implements
  DAO.Get<User, User.WithoutPassword>,
  DAO.Add<User.Add>,
  DAO.Edit<User, User.Edit>,
  DAO.Delete<User>,
  DAO.List<User.WithoutPassword>
{
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

  async get(id: number): Promise<User.WithoutPassword> {
    const sql = `
      SELECT id, createdAt, updatedAt, ${MySQLUserDAO.FIELDS.join(', ')} 
      FROM ${MySQLUserDAO.TABLE} 
      WHERE id = ?;
    `
    const [[result]] = await this.db.query<RowDataPacket[]>(sql, [id])
    return result as User.WithoutPassword
  }

  async add(data: User.Add): Promise<Entity['id']> {
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

  async edit(id: number, changes: User.Edit): Promise<void> {
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

  async list(): Promise<User.WithoutPassword[]> {
    const sql = `
      SELECT id, createdAt, updatedAt, ${MySQLUserDAO.FIELDS.join(', ')} 
      FROM ${MySQLUserDAO.TABLE}
    `
    const [result] = await this.db.query<RowDataPacket[]>(sql)
    return result as User.WithoutPassword[]
  }
}