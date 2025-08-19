import pool from '../database/index'
import AssistantsTypes from '../types/assistants.types'

class AssistantsModel {
	// create
	async create(u: AssistantsTypes): Promise<AssistantsTypes> {
		try {
			const connect = await pool.connect()
			const resultConfirm = await connect.query(
				`SELECT * FROM assistants WHERE id=($1) `,
				[u.id]
			)
			if (resultConfirm.rows.length) {
				throw new Error(`this assistants already exists`)
			} else {
				const sql =
					'INSERT INTO assistants (teacher_id, id, access) VALUES($1, $2, $3) returning *'
				const result = await connect.query(sql, [u.teacher_id, u.id, u.access])
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
	// get by teacher id
	async getByTeacherId(teacher_id: string): Promise<AssistantsTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from assistants WHERE teacher_id=($1)'
			const result = await connect.query(sql, [teacher_id])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// update
	async update(u: AssistantsTypes): Promise<AssistantsTypes> {
		try {
			const connect = await pool.connect()
			const sql =
				'UPDATE assistants SET profile_pic=($1), teacher_id=($2), access=($3) WHERE id=($4) returning *'
			const result = await connect.query(sql, [
				u.profile_pic,
				u.teacher_id,
				u.access,
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
	// //authenticate
	// async auth(
	// 	phone: string | number,
	// 	password: string
	// ): Promise<AssistantsTypes | null> {
	// 	try {
	// 		const connect = await pool.connect()
	// 		const sql = `SELECT password FROM assistants WHERE phone=$1`
	// 		const res = await connect.query(sql, [phone])
	// 		if (res.rows.length) {
	// 			const {password: hashPassword} = res.rows[0]
	// 			const isPassValid = bcrypt.compareSync(
	// 				`${password}${config.pepper}`,
	// 				hashPassword
	// 			)
	// 			if (isPassValid) {
	// 				const userInfo = await connect.query(
	// 					`SELECT * FROM assistants WHERE phone=($1)`,
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
export default AssistantsModel
