import pool from '../database/index'
import StudentsTypes from '../types/students.types'

class StudentsModel {
	// create
	async create(u: StudentsTypes, teacher_id: string): Promise<StudentsTypes> {
		try {
			const connect = await pool.connect()
			const resultConfirm = await connect.query(
				`SELECT * FROM students WHERE id=($1)`,
				[u.id]
			)
			//if user already exist
			if (resultConfirm.rows.length) {
				const resultGetStudentFromTeacher = await connect.query(
					`SELECT * FROM students_teachers WHERE teacher_id=($1) AND student_id=($2)`,
					[teacher_id, resultConfirm.rows[0].id]
				)
				if (resultGetStudentFromTeacher.rows.length) {
					throw new Error('user already exist with teacher')
				} else {
					const resultAddStudentToTeacher = await connect.query(
						`INSERT INTO students_teachers (teacher_id, student_id) values ($1, $2) returning *`,
						[teacher_id, resultConfirm.rows[0].id]
					)
					connect.release()
					return resultAddStudentToTeacher.rows[0]
				}
			} else {
				const sql = 'INSERT INTO students (id, stage) values ($1, $2) returning *'
				const result = await connect.query(sql, [u.id, u.stage])

				const resultAddStudentToTeacher = await connect.query(
					`INSERT INTO students_teachers (teacher_id, student_id) values ($1, $2) returning *`,
					[teacher_id, result.rows[0].id]
				)

				connect.release()
				return result.rows[0]
			}

			throw new Error('Error adding student to teacher')
		} catch (error) {
			throw new Error(`Error creating student: ${error}`)
		}
	}
	// get all
	async getAll(): Promise<StudentsTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from students'
			const result = await connect.query(sql)
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	//get specific
	async getOne(id: string): Promise<StudentsTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from students WHERE id=($1)'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	//get by stage
	async getByStage(stage: string): Promise<StudentsTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from students WHERE stage=($1)'
			const result = await connect.query(sql, [stage])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// update
	async update(u: StudentsTypes): Promise<StudentsTypes> {
		try {
			const connect = await pool.connect()
			const sql =
				'UPDATE students SET profile_pic=($1), stage=($2)  WHERE id=($3) returning *'
			const result = await connect.query(sql, [
				u.profile_pic === '' ? 'blank-profile-.png' : u.profile_pic,
				u.stage,
				u.id,
			])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// delete
	async delete(id: string): Promise<StudentsTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'DELETE from students WHERE id=($1) returning *'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
}
export default StudentsModel
