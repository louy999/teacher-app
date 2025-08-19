import pool from '../database/index'
import TransTeacherTypes from '../types/transTeacher.types'

class TransTeacherModal {
	// create
	async create(u: TransTeacherTypes): Promise<TransTeacherTypes> {
		try {
			const connect = await pool.connect()
			const sql =
				'INSERT INTO trans_teacher (teacher_id, student_id, price) VALUES($1, $2, $3) returning *'
			const result = await connect.query(sql, [
				u.teacher_id,
				u.student_id,
				u.price,
			])
			connect.release()
			return result.rows[0]
		} catch (error) {
			throw new Error(`Error creating trans_teacher relationship: ${error}`)
		}
	}
	// get all
	async getAll(): Promise<TransTeacherTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from trans_teacher'
			const result = await connect.query(sql)
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	//get specific
	async getOne(id: string): Promise<TransTeacherTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from trans_teacher WHERE id=($1)'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// get by student_id
	async getByStudentId(student_id: string): Promise<TransTeacherTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from trans_teacher WHERE student_id=($1)'
			const result = await connect.query(sql, [student_id])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// get by teacher_id
	async getByTeacher_id(teacher_id: string): Promise<TransTeacherTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from trans_teacher WHERE teacher_id=($1)'
			const result = await connect.query(sql, [teacher_id])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// get by lesson_id and student_id
	async getByTeacherIdAndStudentId(
		teacher_id: string,
		student_id: string
	): Promise<TransTeacherTypes> {
		try {
			const connect = await pool.connect()
			const sql = `
      SELECT * 
      FROM trans_teacher 
      WHERE teacher_id = $1 AND student_id = $2
      ORDER BY date DESC 
      LIMIT 1
    `
			const result = await connect.query(sql, [teacher_id, student_id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}

	// update
	async update(u: TransTeacherTypes): Promise<TransTeacherTypes> {
		try {
			const connect = await pool.connect()
			const sql =
				'UPDATE trans_teacher SET teacher_id=($1), student_id=($2), price=($3) WHERE id=($4)  returning *'
			const result = await connect.query(sql, [
				u.teacher_id,
				u.student_id,
				u.price,
				u.id,
			])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// delete
	async delete(id: string): Promise<TransTeacherTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'DELETE from trans_teacher WHERE id=($1) returning *'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
}
export default TransTeacherModal
