exports.createCasesResolver = (casesService) => {

  const createCase = async ({ case: caseInput }) => await casesService.createCase(caseInput);

  const resolveCase = async ({ id }) => await casesService.resolveCase(id);

  const listCases = async () => await casesService.listCases();

  return {
    createCase,
    listCases,
    resolveCase
  }
}