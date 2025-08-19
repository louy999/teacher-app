import pool from '../database/index'
import bcrypt from 'bcrypt'
import config from '../config'
import Users from '../types/users.types'

const hashPassword = (password: string) => {
	const salt = parseInt(config.salt as unknown as string, 10)
	return bcrypt.hashSync(`${password}${config.pepper}`, salt)
}

class UsersModel {
	//create
	async create(u: Users): Promise<Users> {
		try {
			//open connect with DB1
			const connect = await pool.connect()
			const checkUser = await connect.query(
				`SELECT * from users WHERE phone=($1)`,
				[u.phone]
			)
			if (checkUser.rows.length) {
				throw new Error(`user with this phone already exists`)
			}
			const sql =
				'INSERT INTO users (full_name, password, phone, role) values ($1, $2, $3, $4) returning *'
			//run query
			const result = await connect.query(sql, [
				u.full_name,
				hashPassword(u.password),
				u.phone,
				u.role,
			])
			//release connect
			connect.release()
			//return created
			return result.rows[0]
		} catch (err: any) {
			// throw new Error(`name already exists! `)
			throw new Error(`${err} `)
		}
	}
	//get all
	async getAll(): Promise<Users[]> {
		try {
			//open connect with DB
			const connect = await pool.connect()
			const sql = 'SELECT * from users'
			//run query
			const result = await connect.query(sql)
			//release connect
			connect.release()
			//return created teach
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	//get specific
	async getOne(id: string): Promise<Users> {
		try {
			//open connect with DB
			const connect = await pool.connect()
			const sql = 'SELECT * from users WHERE id=($1)'
			//run query
			const result = await connect.query(sql, [id])
			//release connect
			connect.release()
			//return created teach
			return result.rows[0]
		} catch (err) {
			throw new Error(`.could not find teach ${id}, ${err}`)
		}
	}
	//get by name
	async getOneFromName(full_name: string): Promise<Users> {
		try {
			//open connect with DB
			const connect = await pool.connect()
			const sql = 'SELECT * from users WHERE full_name=($1)'
			//run query
			const result = await connect.query(sql, [full_name])
			//release connect
			connect.release()
			//return created teach
			return result.rows[0]
		} catch (err) {
			throw new Error(`.could not find teach ${full_name}, ${err}`)
		}
	}
	//update
	async update(u: Users): Promise<Users> {
		try {
			//open connect with DB
			const connect = await pool.connect()
			const sql = `UPDATE users SET full_name=$1, phone=$2,  password=$3, role=$4  WHERE id=$5 RETURNING *`
			//run query
			const result = await connect.query(sql, [
				u.full_name,
				u.phone,
				hashPassword(u.password),
				u.role,
				u.id,
			])
			//release connect
			connect.release()
			//return created teach
			return result.rows[0]
		} catch (err) {
			throw new Error(`could not update  teach ${u.full_name}, ${err}`)
		}
	}
	//delete
	async delete(id: string): Promise<Users> {
		try {
			//open connect with DB
			const connect = await pool.connect()
			const sql = 'DELETE from users  WHERE id=($1) RETURNING *'
			//run query
			const result = await connect.query(sql, [id])
			//release connect
			connect.release()
			//return created teach
			return result.rows[0]
		} catch (err) {
			throw new Error(`could not delete  ${id}, ${err}`)
		}
	}
	//authenticate
	async auth(phone: string | number, password: string): Promise<Users | null> {
		try {
			const connect = await pool.connect()
			const sql = `SELECT password FROM users WHERE phone=$1`
			const res = await connect.query(sql, [phone])
			if (res.rows.length) {
				const {password: hashPassword} = res.rows[0]
				const isPassValid = bcrypt.compareSync(
					`${password}${config.pepper}`,
					hashPassword
				)
				if (isPassValid) {
					const userInfo = await connect.query(
						`SELECT * FROM users WHERE phone=($1)`,
						[phone]
					)
					return userInfo.rows[0]
				} else {
					throw new Error(`password not match`)
				}
			} else {
				throw new Error(`not found this number`)
			}
			connect.release()
			return null
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
}
export default UsersModel
