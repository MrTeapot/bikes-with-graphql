const EventEmitter = require('events');
const Joi = require('joi');

exports.createCasesService = (casesRepository) => {

  const events = new EventEmitter();

  const listCases = async () => await casesRepository.listCases();

  /*
    --------------------------------------------------
    Create case
    --------------------------------------------------
  */
  const createCaseSchema = Joi.object({
    description: Joi.string()
      .min(10)
      .max(4000)
      .required()
  });

  const createCase = async (input) => {

    const { error } = createCaseSchema.validate(input);
    if (error) throw error;

    const newCase = await casesRepository.insertCase(input);
    events.emit('CASE_CREATED', newCase);
    return newCase;
  }

  /*
    --------------------------------------------------
    Update case
    --------------------------------------------------
  */
  const updateCaseSchema = Joi.object({
    id: Joi.string().guid().required(),
    description: Joi.string()
      .min(10)
      .max(4000),
    officer: Joi.string().guid(),
    status: Joi.string().valid('NEW', 'ASSIGNED', 'RESOLVED')
  }).unknown(true);

  const updateCase = async (input) => {

    const { error } = updateCaseSchema.validate(input);
    if (error) throw error;

    const theCase = await casesRepository.findCaseById(input.id);
    if (!theCase) {
      throw new Error(`Case with id ${id} not found`);
    }

    const changeCase = {
      ...theCase,
      ...input
    }

    return await casesRepository.updateCase(changeCase);
  };

  /*
    --------------------------------------------------
    Resolve case
    --------------------------------------------------
  */
  const resolveCase = async (id) => {
    const theCase = await casesRepository.findCaseById(id);

    if (!theCase) throw new Error(`Case with id ${id} not found`);

    const resolvedCase = await casesRepository.updateCase({
      ...theCase,
      status: 'RESOLVED'
    });

    events.emit('CASE_RESOLVED', resolvedCase);

    return resolvedCase;

  }

  return {
    listCases,
    createCase,
    updateCase,
    resolveCase,
    events
  }

}