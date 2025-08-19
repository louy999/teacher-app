import pool from '../database/index'
import TeachersTypes from '../types/teachers.types'

class TeachersModel {
	//create
	async create(u: TeachersTypes): Promise<TeachersTypes> {
		try {
			//open connect with DB1
			const connect = await pool.connect()
			const sql =
				'INSERT INTO teachers (id, subject, grade_levels) values ($1, $2, $3) returning *'
			//run query
			const result = await connect.query(sql, [u.id, u.subject, u.grade_levels])
			//release connect
			connect.release()
			//return created
			return result.rows[0]
		} catch (err: any) {
			// throw new Error(`name already exists! `)
			throw new Error(`${err} `)
		}
	}
	//get all
	async getAll(): Promise<TeachersTypes[]> {
		try {
			//open connect with DB
			const connect = await pool.connect()
			const sql = 'SELECT * from teachers'
			//run query
			const result = await connect.query(sql)
			//release connect
			connect.release()
			//return created teach
			return result.rows
		} catch (err) {
			throw new Error(`${err}`)
		}
	}
	//get specific
	async getOne(id: string): Promise<TeachersTypes> {
		try {
			//open connect with DB
			const connect = await pool.connect()
			const sql = 'SELECT * from teachers WHERE id=($1)'
			//run query
			const result = await connect.query(sql, [id])
			//release connect
			connect.release()
			//return created teach
			return result.rows[0]
		} catch (err) {
			throw new Error(`.could not find teach ${id}, ${err}`)
		}
	}
	//update
	async update(u: TeachersTypes): Promise<TeachersTypes> {
		try {
			//open connect with DB
			const connect = await pool.connect()
			const sql = `UPDATE teachers SET subject=$1, grade_levels=$2,  profile_pic=$3, paid=$4, price=$5, expire_date=$6 WHERE id=$7 RETURNING *`
			//run query
			const result = await connect.query(sql, [
				u.subject,
				u.grade_levels,
				u.profile_pic,
				u.paid,
				u.price,
				u.expire_date,
				u.id,
			])
			//release connect
			connect.release()
			//return created teach
			return result.rows[0]
		} catch (err) {
			throw new Error(`could not update  teach ${u.phone}, ${err}`)
		}
	}
	//delete
	async delete(id: string): Promise<TeachersTypes> {
		try {
			//open connect with DB
			const connect = await pool.connect()
			const sql = 'DELETE from teachers  WHERE id=($1) RETURNING *'
			//run query
			const result = await connect.query(sql, [id])
			//release connect
			connect.release()
			//return created teach
			return result.rows[0]
		} catch (err) {
			throw new Error(`could not delete  ${id}, ${err}`)
		}
	}
	//authenticate
	// async auth(
	// 	phone: string | number,
	// 	password: string
	// ): Promise<TeachersTypes | null> {
	// 	try {
	// 		const connect = await pool.connect()
	// 		const sql = `SELECT password FROM teachers WHERE phone=$1`
	// 		const res = await connect.query(sql, [phone])
	// 		if (res.rows.length) {
	// 			const {password: hashPassword} = res.rows[0]
	// 			const isPassValid = bcrypt.compareSync(
	// 				`${password}${config.pepper}`,
	// 				hashPassword
	// 			)
	// 			if (isPassValid) {
	// 				const userInfo = await connect.query(
	// 					`SELECT * FROM teachers WHERE phone=($1)`,
	// 					[phone]
	// 				)
	// 				return userInfo.rows[0]
	// 			} else {
	// 				throw new Error(`password not match`)
	// 			}
	// 		} else {
	// 			throw new Error(`not found this number`)
	// 		}
	// 		connect.release()
	// 		return null
	// 	} catch (err) {
	// 		throw new Error(`${err}`)
	// 	}
	// }
}
export default TeachersModel
