import FilesTypes from '../types/files.types'
import pool from '../database/index'

class FilesModel {
	// create
	async create(u: FilesTypes): Promise<FilesTypes> {
		try {
			const connect = await pool.connect()
			const sql =
				'INSERT INTO files (title, lesson_id, file_url, file_type) VALUES($1, $2, $3, $4) returning *'
			const result = await connect.query(sql, [
				u.title,
				u.lesson_id,
				u.file_url,
				u.file_type,
			])
			connect.release()
			return result.rows[0]
		} catch (error) {
			throw new Error(`Error creating files relationship: ${error}`)
		}
	}
	// get all
	async getAll(): Promise<FilesTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from files'
			const result = await connect.query(sql)
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	//get specific
	async getOne(id: string): Promise<FilesTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from files WHERE id=($1)'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// get by lesson id
	async getByLessonId(lesson_id: string): Promise<FilesTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from files WHERE lesson_id=($1)'
			const result = await connect.query(sql, [lesson_id])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// update
	async update(u: FilesTypes): Promise<FilesTypes> {
		try {
			const connect = await pool.connect()
			const sql =
				'UPDATE files SET title=($1), file_url=($2), file_type=($3) WHERE id=($4) returning *'
			const result = await connect.query(sql, [
				u.title,
				u.file_url,
				u.file_type,
				u.id,
			])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// delete
	async delete(id: string): Promise<FilesTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'DELETE from files WHERE id=($1) returning *'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
}
export default FilesModel
