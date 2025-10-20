import pool from '../database/index'
import NotificationsTypes from '../types/notifications.types'

class NotificationsModal {
	// create
	async create(u: NotificationsTypes): Promise<NotificationsTypes> {
		try {
			const connect = await pool.connect()
			const sql =
				'INSERT INTO notifications (teacher_id, message, stage) VALUES($1, $2, $3) returning *'
			const result = await connect.query(sql, [u.teacher_id, u.message, u.stage])
			connect.release()
			return result.rows[0]
		} catch (error) {
			throw new Error(`Error creating notifications relationship: ${error}`)
		}
	}
	// get all
	async getAll(): Promise<NotificationsTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from notifications'
			const result = await connect.query(sql)
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	//get specific
	async getOne(id: string): Promise<NotificationsTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from notifications WHERE id=($1)'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// get by teacher id
	async getByTeacherId(teacher_id: string): Promise<NotificationsTypes[]> {
		try {
			const connect = await pool.connect()
			const sql = 'SELECT * from notifications WHERE teacher_id=($1)'
			const result = await connect.query(sql, [teacher_id])
			connect.release()
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// update
	async update(u: NotificationsTypes): Promise<NotificationsTypes> {
		try {
			const connect = await pool.connect()
			const sql =
				'UPDATE notifications SET message=($1), stage=($2) WHERE id=($3) returning *'
			const result = await connect.query(sql, [u.message, u.stage, u.id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	// delete
	async delete(id: string): Promise<NotificationsTypes> {
		try {
			const connect = await pool.connect()
			const sql = 'DELETE from notifications WHERE id=($1) returning *'
			const result = await connect.query(sql, [id])
			connect.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
}
export default NotificationsModal
