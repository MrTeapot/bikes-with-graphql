const EventEmitter = require('events');
const Joi = require('joi');

exports.createOfficersService = (officersRepository) => {

  const events = new EventEmitter();

  /*
    --------------------------------------------------
    List officers
    --------------------------------------------------
  */
  const listOfficers = async () => {
    return await officersRepository.listOfficers();
  }

  /*
    --------------------------------------------------
    Create officer
    --------------------------------------------------
  */
  const createOfficerSchema = Joi.object({
    first_name: Joi.string()
      .alphanum()
      .min(2)
      .max(30)
      .required(),
    last_name: Joi.string()
      .alphanum()
      .min(2)
      .max(60)
      .required(),
  });

  const createOfficer = async (input) => {

    const { error } = createOfficerSchema.validate(input);
    if (error) throw error;

    const officer = await officersRepository.insertOfficer(input);
    events.emit('OFFICER_CREATED', officer);
    return officer
  }

  /*
    --------------------------------------------------
    Update officer
    --------------------------------------------------
  */

  const updateOfficerSchema = Joi.object({
    id: Joi.string().guid().required(),
    first_name: Joi.string()
      .alphanum()
      .min(2)
      .max(30),
    last_name: Joi.string()
      .alphanum()
      .min(2)
      .max(60)
  }).unknown(true);

  const updateOfficer = async (input) => {

    const { error } = updateOfficerSchema.validate(input);
    if (error) throw error;

    const officer = await officersRepository.findOfficerById(input.id);
    if (!officer) {
      throw new Error(`Officer with id ${id} not found`);
    }

    const changedOfficer = {
      ...officer,
      ...input
    }

    return await officersRepository.updateOfficer(changedOfficer);
  }

  /*
    --------------------------------------------------
    Delete officer
    --------------------------------------------------
  */
  const deleteOfficer = async (id) => await officersRepository.deleteOfficer(id)


  return {
    listOfficers,
    createOfficer,
    updateOfficer,
    deleteOfficer,
    events
  }

}