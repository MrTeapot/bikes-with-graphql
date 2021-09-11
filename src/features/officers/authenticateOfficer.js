exports.authenticateOfficer = (resolver) => async (data, request) => {
  if (!process.env.OFFICER_PW || request.headers.officer_pw === process.env.OFFICER_PW) {
    return await resolver(data, request);
  } else {
    throw new Error('Unauthenticated');
  }
}