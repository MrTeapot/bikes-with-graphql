
const { makeRequest } = require('./graphqlClient.js');
const { createApp } = require("../src/app.js");
const { expect } = require('chai');

describe('The Officers API', async function () {

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

  describe('Create officer', async function () {

    it('should return the created officer', async function () {

      const query = `
        mutation CreateOfficer($officerInput: CreateOfficerInput!) {
          addOfficer(officer: $officerInput) {	
            id
            first_name
            last_name
            created_at
          }
      }
    `

      const variables = {
        officerInput: {
          first_name: 'Kalle',
          last_name: 'Karlsson',
        }
      }

      const result = await makeRequest(query, variables);
      const json = await result.json();

      expect(json.data.addOfficer.first_name).to.equal('Kalle');
      expect(json.data.addOfficer.last_name).to.equal('Karlsson');
      expect(json.data.addOfficer.id).to.not.be.undefined;
      id = json.data.addOfficer.id;
    });

  });


  describe('List officers', async function () {

    it('should return the created officer in an array', async function () {

      const query = `
        query listOfficers {
          getOfficers {
            id
            first_name
            last_name
            created_at
          }
        }
    `

      const result = await makeRequest(query);
      const json = await result.json();

      expect(json.data.getOfficers[0].first_name).to.equal('Kalle');

    })
  });


  describe('Edit officer', async function () {

    it('should return the officer with the edited field', async function () {

      const query = `
        mutation EditOfficer($officerInput: EditOfficerInput!) {
          editOfficer(officer: $officerInput) {	
            id
            first_name
            last_name
            created_at
          }
        }
    `

      const variables = {
        officerInput: {
          id: id,
          last_name: 'Svensson'
        }
      }

      const result = await makeRequest(query, variables);
      const json = await result.json();

      expect(json.data.editOfficer.last_name).to.equal('Svensson');

    });
  });

  describe('Delete officer', async function () {

    it('should not throw error', async function () {

      const query = `
        mutation DeleteOfficer($id: String!) {
          deleteOfficer(id: $id)
        }  
      `

      const variables = {
        id: id
      }

      const result = await makeRequest(query, variables);
      const json = await result.json();

      expect(json.data).to.not.be.undefined;

    });
  });

});