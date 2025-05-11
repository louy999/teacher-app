import StudentsTeacherTypes from '../types/students_teacher.types'
import pool from '../database/index'

class StudentsTeacherModel {
	// create
	async create(
		u: StudentsTeacherTypes,
		teacher_id: string
	): Promise<StudentsTeacherTypes> {
		try {
			const connect = await pool.connect()
			// check if the student already exists
			const checkSql =
				'SELECT * FROM students_teachers WHERE student_id = $1 AND teacher_id = $2'
			const checkResult = await connect.query(checkSql, [u.student_id, teacher_id])
			if (checkResult.rows.length > 0) {
				// If the student-teacher relationship already exists, return the existing record
				connect.release()
				return checkResult.rows[0]
			} else {
				// If the student-teacher relationship does not exist, create a new one
				const sql =
					'INSERT INTO students_teachers (student_id, teacher_id) VALUES($1, $2) returning *'
				const result = await connect.query(sql, [u.student_id, teacher_id])
				connect.release()
				return result.rows[0]
			}
		} catch (error) {
			throw new Error(`Error creating student-teacher relationship: ${error}`)
		}
	}
	// get all
	async getAll(): Promise<StudentsTeacherTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from students_teachers'
			const result = await connect.query(sql)
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	//get specific
	async getOne(id: string): Promise<StudentsTeacherTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from students_teachers WHERE id=($1)'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	//get by stage
	async getByStudentId(stage: string): Promise<StudentsTeacherTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from students_teachers WHERE stage=($1)'
			const result = await connect.query(sql, [stage])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// get by teacher
	async getByTeacherId(teacher_id: string): Promise<StudentsTeacherTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from students_teachers WHERE teacher_id=($1)'
			const result = await connect.query(sql, [teacher_id])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// update
	async update(u: StudentsTeacherTypes): Promise<StudentsTeacherTypes> {
		try {
			const connect = await pool.connect()
			const sql =
				'UPDATE students_teachers SET student_id=($1), teacher_id=($2) WHERE id=($3) returning *'
			const result = await connect.query(sql, [u.student_id, u.teacher_id, u.id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// delete
	async delete(id: string): Promise<StudentsTeacherTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'DELETE from students_teachers WHERE id=($1) returning *'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
}
export default StudentsTeacherModel
