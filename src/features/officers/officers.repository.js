exports.createOfficersRepository = (pool) => {

  const listOfficers = async () => {
    const sql = `
      SELECT 
        id, 
        first_name,
        last_name, 
        created_at 
      FROM
        officers
      WHERE deleted_at IS NULL
    `

    return (await pool.query(sql)).rows;

  }

  const findOfficerById = async (id) => {
    const sql = `
      SELECT 
        id, 
        first_name,
        last_name, 
        created_at 
      FROM
        officers
      WHERE deleted_at IS NULL
      AND id = $1
    `

    const values = [id];

    return (await pool.query(sql, values)).rows[0];

  }

  const insertOfficer = async ({ first_name, last_name }) => {

    const sql = `
      INSERT INTO officers (
        first_name,
        last_name
      ) 
      VALUES ($1, $2)
      RETURNING
        id,
        first_name,
        last_name,
        created_at
    `

    const params = [first_name, last_name];

    return (await pool.query(sql, params)).rows[0];

  }

  const updateOfficer = async ({ id, first_name, last_name }) => {

    const sql = `
      UPDATE officers 
      SET
        first_name = $1,
        last_name = $2
      WHERE 
        id = $3
      RETURNING
        id,
        first_name,
        last_name,
        created_at
    `

    const params = [first_name, last_name, id];

    const result = await pool.query(sql, params);

    return result.rows[0];

  }

  const deleteOfficer = async (id) => {
    const sql = `
      UPDATE officers 
      SET
        deleted_at = CURRENT_TIMESTAMP
      WHERE 
        id = $1 AND
        deleted_at IS NULL
    `

    const params = [id];

    return (await pool.query(sql, params)).rows[0];

  }

  return {
    listOfficers,
    insertOfficer,
    updateOfficer,
    deleteOfficer,
    findOfficerById
  }
}