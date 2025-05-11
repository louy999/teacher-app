import SubscribeType from '../types/subscribe.types'
import pool from '../database/index'

class SubscribeModel {
	// create
	async create(u: SubscribeType): Promise<SubscribeType> {
		try {
			const connect = await pool.connect()
			const sql =
				'INSERT INTO subscribe (student_id, lesson_id, expire, price) VALUES($1, $2, $3, $4) returning *'
			const result = await connect.query(sql, [
				u.student_id,
				u.lesson_id,
				u.expire,
				u.price,
			])
			connect.release()
			return result.rows[0]
		} catch (error) {
			throw new Error(`Error creating subscribe relationship: ${error}`)
		}
	}
	// get all
	async getAll(): Promise<SubscribeType[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from subscribe'
			const result = await connect.query(sql)
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	//get specific
	async getOne(id: string): Promise<SubscribeType> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from subscribe WHERE id=($1)'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// get by student_id
	async getByStudentId(student_id: string): Promise<SubscribeType[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from subscribe WHERE student_id=($1)'
			const result = await connect.query(sql, [student_id])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// get by lesson_id and student_id
	async getByLessonIdAndStudentId(
		lesson_id: string,
		student_id: string
	): Promise<SubscribeType[]> {
		try {
			const connect = await pool.connect()
			const sql =
				'SELECT * from subscribe WHERE lesson_id=($1) AND student_id=($2)'
			const result = await connect.query(sql, [lesson_id, student_id])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	async getByLessonId(lesson_id: string): Promise<SubscribeType[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from subscribe WHERE lesson_id=($1)'
			const result = await connect.query(sql, [lesson_id])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// update
	async update(u: SubscribeType): Promise<SubscribeType> {
		try {
			const connect = await pool.connect()
			const sql =
				'UPDATE subscribe SET expire=($1), price=($2) WHERE id=($3) returning *'
			const result = await connect.query(sql, [u.expire, u.price, u.id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// delete
	async delete(id: string): Promise<SubscribeType> {
		try {
			const connect = await pool.connect()
			const sql = 'DELETE from subscribe WHERE id=($1) returning *'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
}
export default SubscribeModel
