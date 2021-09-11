exports.schema = `
  type Officer {
    id: String!
    first_name: String!
    last_name: String!
    created_at: String!
  }

  input CreateOfficerInput {
    first_name: String!
    last_name: String!
  }

  input EditOfficerInput {
    id: String!
    first_name: String
    last_name: String
  }

  enum CaseStatus {
    NEW
    ASSIGNED
    RESOLVED
  }

  input CreateCaseInput {
    description: String!
  }

  type Case {
    id: String!
    status: CaseStatus!
    officer: String
    description: String!
    created_at: String!
  }

  type Query {
    """
    Retrieve an array with all officers
    Todo: add pagination 
    """
    getOfficers: [Officer]!

  
    """
    Retrieve an array with all cases
    Todo: add pagination 
    """
    getCases: [Case]!

  }

  type Mutation {

    """ 
    Add a new officer. Requires police password 
    """
    addOfficer(officer: CreateOfficerInput!): Officer!
    

    """ 
    Edit an existing officer. Requires police password  
    """
    editOfficer(officer: EditOfficerInput!): Officer!


    """ 
    Delete an existing officer. Requires police password  
    """
    deleteOfficer(id: String): Boolean


    """ 
    Report that a case has been resolved. Requires police password  
    """
    resolveCase(id: String!): Case!
    """ 


    Report a stolen bike. Publicly available. 
    """
    addCase(case: CreateCaseInput!): Case!

  }

`