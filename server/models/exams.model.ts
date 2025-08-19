import ExamsTypes from '../types/exams.types'
import pool from '../database/index'

class ExamsModel {
	// create
	async create(u: ExamsTypes): Promise<ExamsTypes> {
		try {
			const connect = await pool.connect()
			const sql =
				'INSERT INTO exams (title, time, lesson_id) VALUES ($1, $2, $3) returning *'
			const result = await connect.query(sql, [u.title, u.time, u.lesson_id])
			connect.release()
			return result.rows[0]
		} catch (error) {
			throw new Error(`Error creating exams relationship: ${error}`)
		}
	}
	// get all
	async getAll(): Promise<ExamsTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from exams'
			const result = await connect.query(sql)
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	//get specific
	async getOne(id: string): Promise<ExamsTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from exams WHERE id=($1)'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// get by lesson id
	async getByLessonId(lesson_id: string): Promise<ExamsTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from exams WHERE lesson_id=($1)'
			const result = await connect.query(sql, [lesson_id])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}

	// update
	async update(u: ExamsTypes): Promise<ExamsTypes> {
		try {
			const connect = await pool.connect()
			const sql =
				'UPDATE exams SET title=($1), time=($2) WHERE id=($3) returning *'
			const result = await connect.query(sql, [u.title, u.time, u.id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// delete
	async delete(id: string): Promise<ExamsTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'DELETE from exams WHERE id=($1) returning *'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
}
export default ExamsModel
