import ParentsStudentsTypes from '../types/parents_students.types'
import pool from '../database/index'

class ParentsStudentsModel {
	// create
	async create(u: ParentsStudentsTypes): Promise<ParentsStudentsTypes> {
		try {
			const connect = await pool.connect()
			const sql =
				'INSERT INTO parents_students (student_id, parent_id) VALUES($1, $2) returning *'
			const result = await connect.query(sql, [u.student_id, u.parent_id])
			connect.release()
			return result.rows[0]
		} catch (error) {
			throw new Error(`Error creating parent-student relationship: ${error}`)
		}
	}
	// get all
	async getAll(): Promise<ParentsStudentsTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from parents_students'
			const result = await connect.query(sql)
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	//get specific
	async getOne(id: string): Promise<ParentsStudentsTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from parents_students WHERE id=($1)'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// get by student id
	async getByStudentId(stage: string): Promise<ParentsStudentsTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from parents_students WHERE stage=($1)'
			const result = await connect.query(sql, [stage])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// get by parent id
	async getByParentId(parent_id: string): Promise<ParentsStudentsTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from parents_students WHERE parent_id=($1)'
			const result = await connect.query(sql, [parent_id])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// update
	async update(u: ParentsStudentsTypes): Promise<ParentsStudentsTypes> {
		try {
			const connect = await pool.connect()
			const sql =
				'UPDATE parents_students SET student_id=($1), parent_id=($2) WHERE id=($3) returning *'
			const result = await connect.query(sql, [u.student_id, u.parent_id, u.id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// delete
	async delete(id: string): Promise<ParentsStudentsTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'DELETE from parents_students WHERE id=($1) returning *'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
}
export default ParentsStudentsModel
