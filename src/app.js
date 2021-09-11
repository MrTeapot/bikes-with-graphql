
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const pg = require('pg');

const { schema: schemaDefiniion } = require('./schema.js');
const { createOfficersRepository } = require('./features/officers/officers.repository.js');
const { createOfficersResolver } = require('./features/officers/officers.resolver.js');
const { createOfficersService } = require('./features/officers/officers.service.js');
const { createCasesService } = require('./features/cases/cases.service.js');
const { createCasesRepository } = require('./features/cases/cases.repository.js');
const { createCasesResolver } = require('./features/cases/cases.resolver.js');
const { createAssignmentRepository } = require('./features/assignment/assignment.repository.js');
const { createAssignmentService } = require('./features/assignment/assignment.service.js');
const { authenticateOfficer } = require('./features/officers/authenticateOfficer')

exports.createApp = async ({ port, dbUrl }) => {

  const schema = buildSchema(schemaDefiniion);

  const pool = new pg.Pool({
    connectionString: dbUrl
  });

  await pool.connect();

  const officerService = createOfficersService(createOfficersRepository(pool));
  const officerResolver = createOfficersResolver(officerService);

  const casesService = createCasesService(createCasesRepository(pool));
  const casesResolver = createCasesResolver(casesService);

  const assignmentRepository = createAssignmentRepository(pool);
  const assignmentService = createAssignmentService(casesService, officerService, assignmentRepository);

  const root = {
    addCase: casesResolver.createCase,
    getCases: casesResolver.listCases,
    addOfficer: authenticateOfficer(officerResolver.createOfficer),
    getOfficers: authenticateOfficer(officerResolver.listOfficers),
    editOfficer: authenticateOfficer(officerResolver.editOfficer),
    deleteOfficer: authenticateOfficer(officerResolver.deleteOfficer),
    resolveCase: authenticateOfficer(casesResolver.resolveCase),
  };

  const app = express();

  app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  }));

  const server = app.listen(port);

  const closeApp = async () => {
    server.close();
  }

  return {
    closeApp
  }
}