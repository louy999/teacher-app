import ParentsTypes from '../types/parents.types'
import bcrypt from 'bcrypt'
import config from '../config'
import pool from '../database/index'
const hashPassword = (password: string) => {
	const salt = parseInt(config.salt as unknown as string, 10)
	return bcrypt.hashSync(`${password}${config.pepper}`, salt)
}

class ParentsModel {
	// create
	async create(u: ParentsTypes): Promise<ParentsTypes> {
		try {
			const connect = await pool.connect()
			const confirmParent = 'SELECT * FROM parents WHERE phone=($1)'
			const resultConfirm = await connect.query(confirmParent, [u.phone])
			if (resultConfirm.rows.length) {
				throw new Error(`this phone number already exists`)
			} else {
				const sql =
					'INSERT INTO parents (name, phone, password, profile_pic) VALUES($1, $2, $3, $4) returning *'
				const result = await connect.query(sql, [
					u.name,
					u.phone,
					hashPassword(u.password),
					u.profile_pic === '' ? 'blank-profile-.png' : u.profile_pic,
				])
				connect.release()
				return result.rows[0]
			}
			connect.release()
		} catch (error) {
			throw new Error(`Error creating parents: ${error}`)
		}
	}
	// get all
	async getAll(): Promise<ParentsTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from parents'
			const result = await connect.query(sql)
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	//get specific
	async getOne(id: string): Promise<ParentsTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from parents WHERE id=($1)'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	//get by phone
	async getByPhone(phone: string): Promise<ParentsTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from parents WHERE phone=($1)'
			const result = await connect.query(sql, [phone])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// get by name
	async getByName(name: string): Promise<ParentsTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from parents WHERE name=($1)'
			const result = await connect.query(sql, [name])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// update
	async update(u: ParentsTypes): Promise<ParentsTypes> {
		try {
			const connect = await pool.connect()
			const sql =
				'UPDATE parents SET name=($1), phone=($2), password=($3), profile_pic=($4) WHERE id=($5) returning *'
			const result = await connect.query(sql, [
				u.name,
				u.phone,
				u.password,
				u.profile_pic === '' ? 'blank-profile-.png' : u.profile_pic,
				u.id,
			])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// delete
	async delete(id: string): Promise<ParentsTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'DELETE from parents WHERE id=($1) returning *'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	//authenticate
	async auth(
		phone: string | number,
		password: string
	): Promise<ParentsTypes | null> {
		try {
			const connect = await pool.connect()
			const sql = `SELECT password FROM parents WHERE phone=$1`
			const res = await connect.query(sql, [phone])
			if (res.rows.length) {
				const {password: hashPassword} = res.rows[0]
				const isPassValid = bcrypt.compareSync(
					`${password}${config.pepper}`,
					hashPassword
				)
				if (isPassValid) {
					const userInfo = await connect.query(
						`SELECT * FROM parents WHERE phone=($1)`,
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
export default ParentsModel
