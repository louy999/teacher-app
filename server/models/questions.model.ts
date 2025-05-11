import QuestionsTypes from '../types/questions.types'
import pool from '../database/index'

class QuestionsModel {
	// create
	async create(u: QuestionsTypes): Promise<QuestionsTypes> {
		try {
			const connect = await pool.connect()
			const sql =
				'INSERT INTO questions (exams_id, question, answers, correct_answer, time, notes, file_url, file_type) VALUES($1, $2, $3, $4, $5, $6, $7, $8) returning *'
			const result = await connect.query(sql, [
				u.exams_id,
				u.question,
				u.answers,
				u.correct_answer,
				u.time,
				u.notes,
				u.file_url,
				u.file_type,
			])
			connect.release()
			return result.rows[0]
		} catch (error) {
			throw new Error(`Error creating questions relationship: ${error}`)
		}
	}
	// get all
	async getAll(): Promise<QuestionsTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from questions'
			const result = await connect.query(sql)
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	//get specific
	async getOne(id: string): Promise<QuestionsTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from questions WHERE id=($1)'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// get by exam_id
	async getByExamId(exam_id: string): Promise<QuestionsTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from questions WHERE exam_id=($1)'
			const result = await connect.query(sql, [exam_id])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// update
	async update(u: QuestionsTypes): Promise<QuestionsTypes> {
		try {
			const connect = await pool.connect()
			const sql =
				'UPDATE questions SET question=($1), answers=($2), correct_answer=($3), time=($4), notes=($5), file_url=($6), file_type=($7)  WHERE id=($8) returning *'
			const result = await connect.query(sql, [
				u.question,
				u.answers,
				u.correct_answer,
				u.time,
				u.notes,
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
	async delete(id: string): Promise<QuestionsTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'DELETE from questions WHERE id=($1) returning *'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
}
export default QuestionsModel
