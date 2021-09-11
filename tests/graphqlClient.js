const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.makeRequest = async (query, variables = {}) => await fetch('http://localhost:5000/graphql', {
  method: 'POST',
  body: JSON.stringify({
    query: query,
    variables: variables
  }),
  headers: { 'Content-Type': 'application/json' }
});