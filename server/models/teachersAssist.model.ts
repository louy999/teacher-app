import pool from '../database/index'
import TeachersAssist from '../types/teachers_assist'

class TeachersAssistModel {
	// create
	async create(u: TeachersAssist): Promise<TeachersAssist> {
		try {
			const connect = await pool.connect()
			// check if the assist already exists
			const checkSql =
				'SELECT * FROM teachers_assistants WHERE assistant_id = $1 AND teacher_id = $2'
			const checkResult = await connect.query(checkSql, [
				u.assistant_id,
				u.teacher_id,
			])
			if (checkResult.rows.length > 0) {
				// If the assist-teacher relationship already exists, return the existing record
				connect.release()
				return checkResult.rows[0]
			} else {
				// If the assist-teacher relationship does not exist, create a new one
				const sql =
					'INSERT INTO teachers_assistants (assistant_id, teacher_id) VALUES($1, $2) returning *'
				const result = await connect.query(sql, [u.assistant_id, u.teacher_id])
				connect.release()
				return result.rows[0]
			}
		} catch (error) {
			throw new Error(`Error creating assist-teacher relationship: ${error}`)
		}
	}
	// get all
	async getAll(): Promise<TeachersAssist[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from teachers_assistants'
			const result = await connect.query(sql)
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	//get specific
	async getOne(id: string): Promise<TeachersAssist> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from teachers_assistants WHERE id=($1)'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	//get by stage
	async getByAssistId(assist: string): Promise<TeachersAssist[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from teachers_assistants WHERE assist=($1)'
			const result = await connect.query(sql, [assist])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// get by teacher
	async getByTeacherId(teacher_id: string): Promise<TeachersAssist[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from teachers_assistants WHERE teacher_id=($1)'
			const result = await connect.query(sql, [teacher_id])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	async getByTeacherIdAssistId(
		teacher_id: string,
		assistant_id: string
	): Promise<TeachersAssist[]> {
		try {
			const connect = await pool.connect()
			const sql =
				'SELECT * from teachers_assistants WHERE teacher_id=($1) AND assistant_id=($2)'
			const result = await connect.query(sql, [teacher_id, assistant_id])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// update
	async update(u: TeachersAssist): Promise<TeachersAssist> {
		try {
			const connect = await pool.connect()
			const sql =
				'UPDATE teachers_assistants SET assistant_id=($1), teacher_id=($2) WHERE id=($3) returning *'
			const result = await connect.query(sql, [u.assistant_id, u.teacher_id, u.id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// delete
	async delete(id: string): Promise<TeachersAssist> {
		try {
			const connect = await pool.connect()
			const sql = 'DELETE from teachers_assistants WHERE id=($1) returning *'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
}
export default TeachersAssistModel
