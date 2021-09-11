
const { makeRequest } = require("./graphqlClient.js");
const { createApp } = require("../src/app.js");
const { expect } = require("chai");

describe('The Cases API', async function () {

  let app;
  let id;

  beforeEach(async () => {
    app = await createApp({
      port: process.env.PORT || 5000,
      dbUrl: process.env.POSTGRES_DB_URL
    });
  });

  afterEach(async () => {
    await app.closeApp();
  });

  describe('Create case', async function () {

    it('should return the created case', async function () {

      const query = `
      mutation CreateCase($caseInput: CreateCaseInput!) {
        addCase(case: $caseInput) {	
          id
          description
          status
          created_at
        }
      }
    `
      const description = 'Hjälp, min cykel blev stulen'

      const variables = {
        caseInput: {
          description
        }
      }

      const result = await makeRequest(query, variables);
      const json = await result.json();

      expect(json.data.addCase.description).to.equal(description);
      expect(json.data.addCase.id).to.not.be.undefined;
      id = json.data.addCase.id;
    });

  });

  describe('List cases', async function () {

    it('should return the created case in an array', async function () {

      const query = `
        query listCases {
          getCases {
            id
            description
            created_at
          }
        }
    `

      const result = await makeRequest(query);
      const json = await result.json();

      expect(json.data.getCases[0].description).to.equal('Hjälp, min cykel blev stulen');

    })
  });

  describe('Resolve case', async function () {

    it('should return the resolved case with status RESOLVED', async function () {

      const query = `
      mutation ResolveCase($id: String!) {
        resolveCase(id: $id) {
          id
          description
          officer
          created_at
          status
        }
      }
    `

      const variables = {
        id
      }

      const result = await makeRequest(query, variables);

      const json = await result.json();

      expect(json.data.resolveCase.status).to.equal('RESOLVED');

    });

  });


});