const { Responses } = require('../../utils/responses');
const { executeQuery } = require('../../config/db');
const { getFormConfigWithFieldsDB } = require('../formconfigs/formconfigs');

// CHECK IF TABLE EXISTS
const checkTableExistsDB = async (tableName) => {
  try {
    const query = `
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name = ?
    `;
    const result = await executeQuery(query, [tableName]);
    return result[0].count > 0;
  } catch (error) {
    console.error('Error checking table exists:', error);
    return false;
  }
};

// CREATE TABLE FROM FORM CONFIG
const createTableFromFormConfigDB = async (workspaceId, formConfigId) => {
  try {
    // Get form config with fields
    const formConfig = await getFormConfigWithFieldsDB(workspaceId, formConfigId);
    if (!formConfig) {
      return Responses.notFound;
    }

    const { tableName, fields } = formConfig;
    
    // Start building CREATE TABLE query
    let createTableQuery = `CREATE TABLE ${tableName} (`;
    let fieldDefinitions = [];
    
    // Add id field
    fieldDefinitions.push('id VARCHAR(100) PRIMARY KEY');
    
    // Add form fields as columns
    for (const field of fields) {
      const { fieldName, fieldType, isRequired, isUnique } = field;
      let columnDefinition = '';
      
      // Map field types to MySQL types
      switch (fieldType) {
        case 'text':
        case 'email':
        case 'phone':
          columnDefinition = `${fieldName} VARCHAR(255)`;
          break;
        case 'textarea':
          columnDefinition = `${fieldName} TEXT`;
          break;
        case 'number':
          columnDefinition = `${fieldName} INT`;
          break;
        case 'decimal':
          columnDefinition = `${fieldName} DECIMAL(10,2)`;
          break;
        case 'boolean':
          columnDefinition = `${fieldName} BOOLEAN`;
          break;
        case 'date':
          columnDefinition = `${fieldName} DATE`;
          break;
        case 'datetime':
          columnDefinition = `${fieldName} DATETIME`;
          break;
        case 'select':
        case 'multiselect':
          columnDefinition = `${fieldName} VARCHAR(255)`;
          break;
        case 'file':
          columnDefinition = `${fieldName} VARCHAR(500)`;
          break;
        default:
          columnDefinition = `${fieldName} VARCHAR(255)`;
      }
      
      // Add NULL/NOT NULL constraint
      if (isRequired) {
        columnDefinition += ' NOT NULL';
      } else {
        columnDefinition += ' NULL';
      }
      
      // Add UNIQUE constraint if required
      if (isUnique) {
        columnDefinition += ' UNIQUE';
      }
      
      fieldDefinitions.push(columnDefinition);
    }
    
    // Add metadata fields
    fieldDefinitions.push('workspaceId VARCHAR(100) NOT NULL');
    fieldDefinitions.push('createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    fieldDefinitions.push('updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
    
    createTableQuery += fieldDefinitions.join(', ') + ')';
    
    // Create the table
    await executeQuery(createTableQuery);
    
    return Responses.success;
  } catch (error) {
    console.error('Error creating table from form config:', error);
    return Responses.tryAgain;
  }
};

// INSERT FORM DATA
const insertFormDataDB = async (tableName, data, workspaceId) => {
  try {
    // Generate ID for the record
    const { generateV4Uuid } = require('../../utils/common');
    const recordId = generateV4Uuid();
    
    // Add metadata to data
    const insertData = {
      id: recordId,
      workspaceId: workspaceId,
      ...data
    };
    
    // Build INSERT query
    const columns = Object.keys(insertData);
    const placeholders = columns.map(() => '?').join(', ');
    const values = Object.values(insertData);
    
    const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
    const result = await executeQuery(query, values);
    
    if (result.affectedRows !== 1) {
      return Responses.badRequest;
    }
    
    // Return the inserted record
    const selectQuery = `SELECT * FROM ${tableName} WHERE id = ?`;
    const insertedRecord = await executeQuery(selectQuery, [recordId]);
    
    return insertedRecord[0];
  } catch (error) {
    console.error('Error inserting form data:', error);
    return Responses.tryAgain;
  }
};

// GET FORM DATA
const getFormDataDB = async (tableName, workspaceId, limit = 50, offset = 0) => {
  try {
    const query = `SELECT * FROM ${tableName} WHERE workspaceId = ? ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
    const data = await executeQuery(query, [workspaceId, limit, offset]);
    return data || [];
  } catch (error) {
    console.error('Error getting form data:', error);
    return [];
  }
};

module.exports = {
  checkTableExistsDB,
  createTableFromFormConfigDB,
  insertFormDataDB,
  getFormDataDB
};
