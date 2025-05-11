import LessonsTypes from '../types/lessons.types'
import pool from '../database/index'

class LessonsModel {
	// create
	async create(u: LessonsTypes): Promise<LessonsTypes> {
		try {
			const connect = await pool.connect()
			const sql =
				'INSERT INTO lessons (title, chapter_id, video_url, image_url, is_active, is_paid, price) VALUES($1, $2, $3, $4, $5, $6, $7) returning *'
			const result = await connect.query(sql, [
				u.title,
				u.chapter_id,
				u.video_url,
				u.image_url,
				u.is_active,
				u.is_paid,
				u.price,
			])
			connect.release()
			return result.rows[0]
		} catch (error) {
			throw new Error(`Error creating lessons relationship: ${error}`)
		}
	}
	// get all
	async getAll(): Promise<LessonsTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from lessons'
			const result = await connect.query(sql)
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	//get specific
	async getOne(id: string): Promise<LessonsTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from lessons WHERE id=($1)'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// get by title
	async getByTitle(title: string): Promise<LessonsTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from lessons WHERE title=($1)'
			const result = await connect.query(sql, [title])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// update
	async update(u: LessonsTypes): Promise<LessonsTypes> {
		try {
			const connect = await pool.connect()
			const sql =
				'UPDATE lessons SET title=($1), chapter_id=($2), video_url=($3), image_url=($4), is_active=($5), is_paid=($6), price=($7)  WHERE id=($8) returning *'
			const result = await connect.query(sql, [
				u.title,
				u.chapter_id,
				u.video_url,
				u.image_url,
				u.is_active,
				u.is_paid,
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
	async delete(id: string): Promise<LessonsTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'DELETE from lessons WHERE id=($1) returning *'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
}
export default LessonsModel
