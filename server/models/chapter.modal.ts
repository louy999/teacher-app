import ChapterTypes from '../types/chapter.types'
import pool from '../database/index'

class ChapterModel {
	// create
	async create(u: ChapterTypes): Promise<ChapterTypes> {
		try {
			const connect = await pool.connect()
			const sql =
				'INSERT INTO chapters (name, stage, teacher_id) VALUES($1, $2, $3) returning *'
			const result = await connect.query(sql, [u.name, u.stage, u.teacher_id])
			connect.release()
			return result.rows[0]
		} catch (error) {
			throw new Error(`Error creating chapter relationship: ${error}`)
		}
	}
	// get all
	async getAll(): Promise<ChapterTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from chapters'
			const result = await connect.query(sql)
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	//get specific
	async getOne(id: string): Promise<ChapterTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from chapters WHERE id=($1)'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// get by name
	async getByName(name: string): Promise<ChapterTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from chapters WHERE name=($1)'
			const result = await connect.query(sql, [name])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// get by stage
	async getByStage(stage: string): Promise<ChapterTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from chapters WHERE stage=($1)'
			const result = await connect.query(sql, [stage])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// get by teacher id
	async getByTeacherId(teacher_id: string): Promise<ChapterTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from chapters WHERE teacher_id=($1)'
			const result = await connect.query(sql, [teacher_id])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	async getByTeacherIdAndStage(
		teacher_id: string,
		stage: string
	): Promise<ChapterTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from chapters WHERE teacher_id=($1) AND stage=($2)'
			const result = await connect.query(sql, [teacher_id, stage])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// update
	async update(u: ChapterTypes): Promise<ChapterTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'UPDATE chapters SET name=($1) WHERE id=($2) returning *'
			const result = await connect.query(sql, [u.name, u.id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// delete
	async delete(id: string): Promise<ChapterTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'DELETE from chapters WHERE id=($1) returning *'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
}
export default ChapterModel
