import ViewsTypes from '../types/views.types'
import pool from '../database/index'

class ViewsModel {
	// create
	async create(u: ViewsTypes): Promise<ViewsTypes> {
		try {
			const connect = await pool.connect()
			const sql =
				'INSERT INTO views (lesson_id, student_id, progress) VALUES($1, $2, $3) returning *'
			const result = await connect.query(sql, [
				u.lesson_id,
				u.student_id,
				u.progress,
			])
			connect.release()
			return result.rows[0]
		} catch (error) {
			throw new Error(`Error creating views relationship: ${error}`)
		}
	}
	// get all
	async getAll(): Promise<ViewsTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from views'
			const result = await connect.query(sql)
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	//get specific
	async getOne(id: string): Promise<ViewsTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from views WHERE id=($1)'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// get by lesson id and student id
	async getByLessonIdAndStudentId(
		lesson_id: string,
		student_id: string
	): Promise<ViewsTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from views WHERE lesson_id=($1) AND student_id=($2)'
			const result = await connect.query(sql, [lesson_id, student_id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// update
	async update(u: ViewsTypes): Promise<ViewsTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'UPDATE views SET progress=($1) WHERE id=($2) returning *'
			const result = await connect.query(sql, [u.progress])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// delete
	async delete(id: string): Promise<ViewsTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'DELETE from views WHERE id=($1) returning *'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
}
export default ViewsModel
