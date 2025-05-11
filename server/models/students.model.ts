import StudentsTypes from '../types/students.types'
import bcrypt from 'bcrypt'
import config from '../config'
import pool from '../database/index'

const hashPassword = (password: string) => {
	const salt = parseInt(config.salt as unknown as string, 10)
	return bcrypt.hashSync(`${password}${config.pepper}`, salt)
}

class StudentsModel {
	// create
	async create(u: StudentsTypes, teacher_id: string): Promise<StudentsTypes> {
		try {
			const connect = await pool.connect()

			const confirmStudent = 'SELECT * FROM students WHERE phone=($1)'
			const resultConfirm = await connect.query(confirmStudent, [u.phone])

			if (resultConfirm.rows.length) {
				const getStudentFromTeacher =
					'SELECT * FROM students_teachers WHERE teacher_id=($1) AND student_id=($2)'
				const resultGetStudentFromTeacher = await connect.query(
					getStudentFromTeacher,
					[teacher_id, resultConfirm.rows[0].id]
				)

				if (resultGetStudentFromTeacher.rows.length) {
					connect.release()
					return resultConfirm.rows[0]
				} else {
					const addStudentToTeacher =
						'INSERT INTO students_teachers (teacher_id, student_id) values ($1, $2)'
					const resultAddStudentToTeacher = await connect.query(
						addStudentToTeacher,
						[teacher_id, resultConfirm.rows[0].id]
					)
					connect.release()
					return resultAddStudentToTeacher.rows[0]
				}
			} else {
				const sql =
					'INSERT INTO students (name, password, phone, stage, profile_pic) values ($1, $2, $3, $4, $5) returning *'
				const result = await connect.query(sql, [
					u.name,
					u.password,
					u.phone,
					u.stage,
					u.profile_pic === '' ? 'blank-profile-.png' : u.profile_pic,
				])

				const addStudentToTeacher =
					'INSERT INTO students_teachers (teacher_id, student_id) values ($1, $2)'
				const resultAddStudentToTeacher = await connect.query(addStudentToTeacher, [
					teacher_id,
					result.rows[0].id,
				])

				connect.release()
				return resultAddStudentToTeacher.rows[0]
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
	//get by phone
	async getByPhone(phone: string): Promise<StudentsTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from students WHERE phone=($1)'
			const result = await connect.query(sql, [phone])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// get by name
	async getByName(name: string): Promise<StudentsTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from students WHERE name=($1)'
			const result = await connect.query(sql, [name])
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
	// get by teacher
	async getByTeacher(teacher_id: string): Promise<StudentsTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from students WHERE teacher_id=($1)'
			const result = await connect.query(sql, [teacher_id])
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
				'UPDATE students SET name=($1), phone=($2), password=($3), stage=($4), profile_pic=($5) WHERE id=($6) returning *'
			const result = await connect.query(sql, [
				u.name,
				u.phone,
				u.password,
				u.stage,
				u.profile_pic === '' ? 'blank-profile-.png' : u.profile_pic,
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
	//authenticate
	async auth(
		phone: string | number,
		password: string
	): Promise<StudentsTypes | null> {
		try {
			const connect = await pool.connect()
			const sql = `SELECT password FROM students WHERE phone=$1`
			const res = await connect.query(sql, [phone])
			if (res.rows.length) {
				const {password: hashPassword} = res.rows[0]
				const isPassValid = bcrypt.compareSync(
					`${password}${config.pepper}`,
					hashPassword
				)
				if (isPassValid) {
					const userInfo = await connect.query(
						`SELECT * FROM students WHERE phone=($1)`,
						[phone]
					)
					return userInfo.rows[0]
				} else {
					throw new Error(`password not match`)
				}
			} else {
				throw new Error(`not found this number`)
			}
			connect.release()
			return null
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
}
export default StudentsModel
