import ReplayTypes from '../types/replay.types'
import pool from '../database/index'

class ReplayModel {
	// create
	async create(u: ReplayTypes): Promise<ReplayTypes> {
		try {
			const connect = await pool.connect()
			const sql =
				'INSERT INTO replay (comment_id, assistant_id, student_id, text, file_url, file_type) VALUES($1, $2, $3, $4, $5, $6) returning *'
			const result = await connect.query(sql, [
				u.comment_id,
				u.assistant_id,
				u.student_id,
				u.text,
				u.file_url,
				u.file_type,
			])
			connect.release()
			return result.rows[0]
		} catch (error) {
			throw new Error(`Error creating replay relationship: ${error}`)
		}
	}
	// get all
	async getAll(): Promise<ReplayTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from replay'
			const result = await connect.query(sql)
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	//get specific
	async getOne(id: string): Promise<ReplayTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from replay WHERE id=($1)'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// get by lesson_id
	async getByLessonId(lesson_id: string): Promise<ReplayTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from replay WHERE lesson_id=($1)'
			const result = await connect.query(sql, [lesson_id])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	async getByCommentId(comment_id: string): Promise<ReplayTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from replay WHERE comment_id=($1)'
			const result = await connect.query(sql, [comment_id])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// update
	async update(u: ReplayTypes): Promise<ReplayTypes> {
		try {
			const connect = await pool.connect()
			const sql =
				'UPDATE replay SET text=($1), file_url=($2), file_type=($3)  WHERE id=($4) returning *'
			const result = await connect.query(sql, [
				u.text,
				u.file_url,
				u.file_type,
				u.id,
			])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// delete
	async delete(id: string): Promise<ReplayTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'DELETE from replay WHERE id=($1) returning *'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
}
export default ReplayModel
