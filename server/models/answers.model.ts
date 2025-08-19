import AnswersTypes from '../types/answers.types'
import pool from '../database/index'

class AnswersModel {
	// create
	async create(u: AnswersTypes): Promise<AnswersTypes> {
		try {
			const connect = await pool.connect()
			const sql =
				'INSERT INTO answers (student_id, question_id, answer, is_correct, marks, exams_id) VALUES($1, $2, $3, $4, $5, $6) returning *'
			const result = await connect.query(sql, [
				u.student_id,
				u.question_id,
				u.answer,
				u.is_correct,
				u.marks,
				u.exams_id,
			])
			connect.release()
			return result.rows[0]
		} catch (error) {
			throw new Error(`Error creating answers relationship: ${error}`)
		}
	}
	// get all
	async getAll(): Promise<AnswersTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from answers'
			const result = await connect.query(sql)
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	//get specific
	async getOne(id: string): Promise<AnswersTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from answers WHERE id=($1)'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// get by student_id
	async getByStudentId(student_id: string): Promise<AnswersTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from answers WHERE student_id=($1)'
			const result = await connect.query(sql, [student_id])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// get by student_id and question_id
	async getByStudentIdAndExamId(
		student_id: string,
		exams_id: string
	): Promise<AnswersTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from answers WHERE student_id=($1) AND exams_id=($2)'
			const result = await connect.query(sql, [student_id, exams_id])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// get by student_id and exams_id
	async getByStudentIdAndQuestionId(
		student_id: string,
		question_id: string
	): Promise<AnswersTypes> {
		try {
			const connect = await pool.connect()
			const sql =
				'SELECT * from answers WHERE student_id=($1) AND question_id=($2)'
			const result = await connect.query(sql, [student_id, question_id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// update
	async update(u: AnswersTypes): Promise<AnswersTypes> {
		try {
			const connect = await pool.connect()
			const sql =
				'UPDATE answers SET answer=($1), is_correct=($2), marks=($3)  WHERE id=($4) returning *'
			const result = await connect.query(sql, [
				u.answer,
				u.is_correct,
				u.marks,
				u.id,
			])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// delete
	async delete(id: string): Promise<AnswersTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'DELETE from answers WHERE id=($1) returning *'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
}
export default AnswersModel
