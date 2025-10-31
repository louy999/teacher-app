import pool from '../database/index'
import TeacherSubscriptions from '../types/ teacherSubscriptions.types'

class TeacherSubscriptionsModal {
	// create
	async create(u: TeacherSubscriptions): Promise<TeacherSubscriptions> {
		try {
			const connect = await pool.connect()
			const sql =
				'INSERT INTO teacher_subscriptions (teacher_id, expire_date, price) VALUES($1, $2, $3) returning *'
			const result = await connect.query(sql, [
				u.teacher_id,
				u.expire_date,
				u.price,
			])
			connect.release()
			return result.rows[0]
		} catch (error) {
			throw new Error(
				`Error creating teacher_subscriptions relationship: ${error}`
			)
		}
	}
	// get all
	async getAll(): Promise<TeacherSubscriptions[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from teacher_subscriptions'
			const result = await connect.query(sql)
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	//get specific
	async getOne(id: string): Promise<TeacherSubscriptions> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from teacher_subscriptions WHERE id=($1)'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// get by plan
	async getByPlan(plan: string): Promise<TeacherSubscriptions[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from teacher_subscriptions WHERE plan=($1)'
			const result = await connect.query(sql, [plan])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// get by teacher_id
	async getByTeacher_id(teacher_id: string): Promise<TeacherSubscriptions> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from teacher_subscriptions WHERE teacher_id=($1)'
			const result = await connect.query(sql, [teacher_id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}

	// update
	async update(u: TeacherSubscriptions): Promise<TeacherSubscriptions> {
		try {
			const connect = await pool.connect()
			const sql =
				'UPDATE teacher_subscriptions SET expire_date=($1), price=($2), active=($3) WHERE id=($4)  returning *'
			const result = await connect.query(sql, [
				u.expire_date,
				u.price,
				u.active,
				u.id,
			])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// delete
	async delete(id: string): Promise<TeacherSubscriptions> {
		try {
			const connect = await pool.connect()
			const sql = 'DELETE from teacher_subscriptions WHERE id=($1) returning *'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
}
export default TeacherSubscriptionsModal
