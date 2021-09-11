exports.createAssignmentService = (caseService, officerService, assignmentRepository) => {

  const newCaseListener = async (newCase) => {
    const officer = await assignmentRepository.findAvailableOfficer();

    if (!officer) return;

    const caseWithOfficer = {
      ...newCase,
      officer: officer.id,
      status: 'ASSIGNED'
    }

    await caseService.updateCase(caseWithOfficer)

  }

  const newOfficerListener = async (officer) => {

    const availableCase = await assignmentRepository.findAvailableCase();

    if (!availableCase) return;

    const assignedCase = {
      ...availableCase,
      officer: officer.id,
      status: 'ASSIGNED'
    }

    await caseService.updateCase(assignedCase)

  }

  const caseResolvedListener = async (resolvedCase) => {

    const availableCase = await assignmentRepository.findAvailableCase();

    if (!availableCase) return;

    const assignedCase = {
      ...availableCase,
      officer: resolvedCase.officer,
      status: 'ASSIGNED'
    }

    await caseService.updateCase(assignedCase);

  }

  // Register the event listeners
  caseService.events.on('CASE_CREATED', newCaseListener);
  caseService.events.on('CASE_RESOLVED', caseResolvedListener);
  officerService.events.on('OFFICER_CREATED', newOfficerListener);

}