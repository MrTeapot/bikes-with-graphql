exports.createOfficersResolver = (officersService) => {

  const createOfficer = async ({ officer }) => await officersService.createOfficer(officer);

  const listOfficers = async () => await officersService.listOfficers();

  const editOfficer = async ({ officer }) => await officersService.updateOfficer(officer);

  const deleteOfficer = async ({ id }) => await officersService.deleteOfficer(id);

  return {
    createOfficer,
    listOfficers,
    editOfficer,
    deleteOfficer
  }
}