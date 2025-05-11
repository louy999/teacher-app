import pool from '../database/index'
import TeachersTypes from '../types/teachers.types'
import bcrypt from 'bcrypt'
import config from '../config'

const hashPassword = (password: string) => {
	const salt = parseInt(config.salt as unknown as string, 10)
	return bcrypt.hashSync(`${password}${config.pepper}`, salt)
}

class TeachersModel {
	//create
	async create(u: TeachersTypes): Promise<TeachersTypes> {
		try {
			//open connect with DB1
			const connect = await pool.connect()
			const sql =
				'INSERT INTO teachers (name, password, phone, subject, profile_pic) values ($1, $2, $3, $4, $5) returning *'
			//run query
			const result = await connect.query(sql, [
				u.name,
				hashPassword(u.password),
				u.phone,
				u.subject,
				u.profile_pic,
			])
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
	//get by name
	async getOneFromName(name: string): Promise<TeachersTypes> {
		try {
			//open connect with DB
			const connect = await pool.connect()
			const sql = 'SELECT * from teachers WHERE name=($1)'
			//run query
			const result = await connect.query(sql, [name])
			//release connect
			connect.release()
			//return created teach
			return result.rows[0]
		} catch (err) {
			throw new Error(`.could not find teach ${name}, ${err}`)
		}
	}
	//update
	async update(u: TeachersTypes): Promise<TeachersTypes> {
		try {
			//open connect with DB
			const connect = await pool.connect()
			const sql = `UPDATE teachers SET name=$1, password=$2,  subject=$3, profile_pic=$4 , access_level=$5, phone=$6 WHERE id=$7 RETURNING *`
			//run query
			const result = await connect.query(sql, [
				u.name,
				u.password,
				u.subject,
				u.profile_pic,
				u.access_level,
				u.phone,
				u.id,
			])
			//release connect
			connect.release()
			//return created teach
			return result.rows[0]
		} catch (err) {
			throw new Error(`could not update  teach ${u.name}, ${err}`)
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
	async auth(
		phone: string | number,
		password: string
	): Promise<TeachersTypes | null> {
		try {
			const connect = await pool.connect()
			const sql = `SELECT password FROM teachers WHERE phone=$1`
			const res = await connect.query(sql, [phone])
			if (res.rows.length) {
				const {password: hashPassword} = res.rows[0]
				const isPassValid = bcrypt.compareSync(
					`${password}${config.pepper}`,
					hashPassword
				)
				if (isPassValid) {
					const userInfo = await connect.query(
						`SELECT * FROM teachers WHERE phone=($1)`,
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
export default TeachersModel
