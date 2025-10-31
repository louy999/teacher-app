import SubscribeType from '../types/subscribe.types'
import pool from '../database/index'

class SubscribeModel {
	// create
	async create(u: SubscribeType): Promise<SubscribeType> {
		try {
			const connect = await pool.connect()
			const sql =
				'INSERT INTO subscribe_lesson (student_id, teacher_id, lesson_id, expire, price) VALUES($1, $2, $3, $4, $5) returning *'
			const result = await connect.query(sql, [
				u.student_id,
				u.teacher_id,
				u.lesson_id,
				u.expire,
				u.price,
			])
			connect.release()
			return result.rows[0]
		} catch (error) {
			throw new Error(`Error creating subscribe_lesson relationship: ${error}`)
		}
	}
	// get all
	async getAll(): Promise<SubscribeType[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from subscribe_lesson'
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
			const sql = 'SELECT * from subscribe_lesson WHERE id=($1)'
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
			const sql = 'SELECT * from subscribe_lesson WHERE student_id=($1)'
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
	): Promise<SubscribeType> {
		try {
			const connect = await pool.connect()
			const sql = `
      SELECT * 
      FROM subscribe_lesson 
      WHERE lesson_id = $1 AND student_id = $2
      ORDER BY date DESC 
      LIMIT 1
    `
			const result = await connect.query(sql, [lesson_id, student_id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}

	async getByLessonId(lesson_id: string): Promise<SubscribeType[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from subscribe_lesson WHERE lesson_id=($1)'
			const result = await connect.query(sql, [lesson_id])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	async getByTeacherId(teacherId: string): Promise<SubscribeType[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from subscribe_lesson WHERE teacher_id=($1)'
			const result = await connect.query(sql, [teacherId])
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
				'UPDATE subscribe_lesson SET expire=($1), price=($2) WHERE id=($3) returning *'
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
			const sql = 'DELETE from subscribe_lesson WHERE id=($1) returning *'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
}
export default SubscribeModel
