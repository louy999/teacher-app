import bcrypt from 'bcrypt'
import config from '../config'
import AssistantsTypes from '../types/assistants.types'
import pool from '../database/index'

const hashPassword = (password: string) => {
	const salt = parseInt(config.salt as unknown as string, 10)
	return bcrypt.hashSync(`${password}${config.pepper}`, salt)
}

class AssistantsModel {
	// create
	async create(u: AssistantsTypes): Promise<AssistantsTypes> {
		try {
			const connect = await pool.connect()
			const confirmParent = 'SELECT * FROM assistants WHERE phone=($1)'
			const resultConfirm = await connect.query(confirmParent, [u.phone])
			if (resultConfirm.rows.length) {
				throw new Error(`this phone number already exists`)
			} else {
				const sql =
					'INSERT INTO assistants (teacher_id, name, password, phone, profile_pic, access_type) VALUES($1, $2, $3, $4, $5, $6) returning *'
				const result = await connect.query(sql, [
					u.teacher_id,
					u.name,
					hashPassword(u.password),
					u.phone,
					u.profile_pic === '' ? 'blank-profile-.png' : u.profile_pic,
					u.access_type,
				])
				connect.release()
				return result.rows[0]
			}
			connect.release()
		} catch (error) {
			throw new Error(`Error creating assistants: ${error}`)
		}
	}
	// get all
	async getAll(): Promise<AssistantsTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from assistants'
			const result = await connect.query(sql)
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	//get specific
	async getOne(id: string): Promise<AssistantsTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from assistants WHERE id=($1)'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	//get by phone
	async getByPhone(phone: string): Promise<AssistantsTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from assistants WHERE phone=($1)'
			const result = await connect.query(sql, [phone])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// get by name
	async getByName(name: string): Promise<AssistantsTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from assistants WHERE name=($1)'
			const result = await connect.query(sql, [name])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// get by teacher id
	async getByTeacherId(teacher_id: string): Promise<AssistantsTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from assistants WHERE teacher_id=($1)'
			const result = await connect.query(sql, [teacher_id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// update
	async update(u: AssistantsTypes): Promise<AssistantsTypes> {
		try {
			const connect = await pool.connect()
			const sql =
				'UPDATE assistants SET name=($1), phone=($2), password=($3), profile_pic=($4), access_level=($5), access_type=($6), teacher_id=($7) WHERE id=($8) returning *'
			const result = await connect.query(sql, [
				u.name,
				u.phone,
				u.password,
				u.profile_pic === '' ? 'blank-profile-.png' : u.profile_pic,
				u.access_level,
				u.access_type,
				u.teacher_id,
				u.id,
			])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// delete
	async delete(id: string): Promise<AssistantsTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'DELETE from assistants WHERE id=($1) returning *'
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
	): Promise<AssistantsTypes | null> {
		try {
			const connect = await pool.connect()
			const sql = `SELECT password FROM assistants WHERE phone=$1`
			const res = await connect.query(sql, [phone])
			if (res.rows.length) {
				const {password: hashPassword} = res.rows[0]
				const isPassValid = bcrypt.compareSync(
					`${password}${config.pepper}`,
					hashPassword
				)
				if (isPassValid) {
					const userInfo = await connect.query(
						`SELECT * FROM assistants WHERE phone=($1)`,
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
export default AssistantsModel
