import pool from '../database/index'
import ParentsTypes from '../types/parents.types'

class ParentsModel {
	// create
	async create(u: ParentsTypes): Promise<ParentsTypes> {
		try {
			const connect = await pool.connect()
			const resultConfirm = await connect.query(
				`SELECT * FROM parents WHERE id=($1)`,
				[u.id]
			)
			if (resultConfirm.rows.length) {
				throw new Error(`this parent already exists`)
			} else {
				const sql = 'INSERT INTO parents (id) VALUES($1) returning *'
				const result = await connect.query(sql, [u.id])
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
	async getParentWithTeacher(): Promise<ParentsTypes[]> {
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
	// update
	async update(u: ParentsTypes): Promise<ParentsTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'UPDATE parents SET profile_pic=($1) WHERE id=($2) returning *'
			const result = await connect.query(sql, [u.profile_pic, u.id])
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
	// //authenticate
	// async auth(
	// 	phone: string | number,
	// 	password: string
	// ): Promise<ParentsTypes | null> {
	// 	try {
	// 		const connect = await pool.connect()
	// 		const sql = `SELECT password FROM parents WHERE phone=$1`
	// 		const res = await connect.query(sql, [phone])
	// 		if (res.rows.length) {
	// 			const {password: hashPassword} = res.rows[0]
	// 			const isPassValid = bcrypt.compareSync(
	// 				`${password}${config.pepper}`,
	// 				hashPassword
	// 			)
	// 			if (isPassValid) {
	// 				const userInfo = await connect.query(
	// 					`SELECT * FROM parents WHERE phone=($1)`,
	// 					[phone]
	// 				)
	// 				return userInfo.rows[0]
	// 			} else {
	// 				throw new Error(`password not match`)
	// 			}
	// 		} else {
	// 			throw new Error(`not found this number`)
	// 		}
	// 		connect.release()
	// 		return null
	// 	} catch (err) {
	// 		throw new Error(`${err}`)
	// 	}
	// }
}
export default ParentsModel
