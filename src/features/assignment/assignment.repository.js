exports.createAssignmentRepository = (pool) => {

  const findAvailableOfficer = async () => {
    const sql = `
      SELECT 
        a.id, 
        a.first_name,
        a.last_name, 
        a.created_at 
      FROM
        officers a
      WHERE deleted_at IS NULL
      AND NOT EXISTS (
        SELECT 1 FROM cases b WHERE b.deleted_at IS NULL
        AND a.id = b.officer AND b.status <> 'RESOLVED'
      )
      ORDER BY created_at
    `

    return (await pool.query(sql)).rows[0];

  }

  const findAvailableCase = async () => {
    const sql = `
      SELECT 
        a.id, 
        a.status,
        a.description, 
        a.officer,
        a.created_at 
      FROM
        cases a
      WHERE deleted_at IS NULL AND
      officer IS NULL
      ORDER BY created_at
    `

    return (await pool.query(sql)).rows[0];

  }

  return {
    findAvailableOfficer,
    findAvailableCase
  }

}