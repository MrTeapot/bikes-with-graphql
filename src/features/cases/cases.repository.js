exports.createCasesRepository = (pool) => {

  const listCases = async () => {
    const sql = `
      SELECT 
        id, 
        status, 
        description,
        officer,
        created_at 
      FROM
        cases
      WHERE deleted_at IS NULL
    `

    return (await pool.query(sql)).rows;

  }

  const findCaseById = async (id) => {
    const sql = `
      SELECT 
        id, 
        status, 
        description,
        officer,
        created_at 
      FROM
        cases
      WHERE 
        id = $1 AND
        deleted_at IS NULL
    `

    const values = [id];

    return (await pool.query(sql, values)).rows[0];

  }

  const insertCase = async ({ description, officer }) => {
    const sql = `
      INSERT INTO cases (
        description,
        officer
      ) 
      VALUES ($1, $2)
      RETURNING
        id,
        description,
        officer,
        status,
        created_at
    `

    const params = [description, officer];

    return (await pool.query(sql, params)).rows[0];

  }

  const updateCase = async ({ id, officer, status }) => {
    const sql = `
      UPDATE cases
      SET 
        status = $1,
        officer = $2
      WHERE id = $3
      RETURNING
        id,
        status,
        officer,
        description,
        created_at
    `

    const params = [status, officer, id];

    return (await pool.query(sql, params)).rows[0];

  }

  return {
    listCases,
    insertCase,
    updateCase,
    findCaseById
  }

}