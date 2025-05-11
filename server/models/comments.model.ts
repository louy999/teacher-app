import CommentsTypes from '../types/comments.types'
import pool from '../database/index'

class CommentsModel {
	// create
	async create(u: CommentsTypes): Promise<CommentsTypes> {
		try {
			const connect = await pool.connect()
			const sql =
				'INSERT INTO comments (text, student_id, lesson_id, file_url, file_type, shown) VALUES($1, $2, $3, $4, $5, $6) returning *'
			const result = await connect.query(sql, [
				u.text,
				u.student_id,
				u.lesson_id,
				u.file_url,
				u.file_type,
				u.shown,
			])
			connect.release()
			return result.rows[0]
		} catch (error) {
			throw new Error(`Error creating comments relationship: ${error}`)
		}
	}
	// get all
	async getAll(): Promise<CommentsTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from comments'
			const result = await connect.query(sql)
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	//get specific
	async getOne(id: string): Promise<CommentsTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from comments WHERE id=($1)'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// get by student_id
	async getByStudentId(student_id: string): Promise<CommentsTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from comments WHERE student_id=($1)'
			const result = await connect.query(sql, [student_id])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// get by lesson_id
	async getByLessonId(lesson_id: string): Promise<CommentsTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from comments WHERE lesson_id=($1)'
			const result = await connect.query(sql, [lesson_id])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// update
	async update(u: CommentsTypes): Promise<CommentsTypes> {
		try {
			const connect = await pool.connect()
			const sql =
				'UPDATE comments SET text=($1), file_url=($2), file_type=($3), shown=($4) WHERE id=($5) returning *'
			const result = await connect.query(sql, [
				u.text,
				u.file_url,
				u.file_type,
				u.shown,
				u.id,
			])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// delete
	async delete(id: string): Promise<CommentsTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'DELETE from comments WHERE id=($1) returning *'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
}
export default CommentsModel
