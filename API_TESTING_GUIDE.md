# Form Builder API Testing Guide

## Authentication Setup
First, you need to get an auth token. Add this to headers for all requests:
```
Authorization: Bearer <your_admin_token>
workspaceid: <your_workspace_id>
```

## Testing Flow

### 1. Create Form Config
**POST** `/api/forms`

**Request Body:**
```json
{
  "menuId": "your-menu-id",
  "name": "User Registration Form",
  "tableName": "user_registrations"
}
```

**Expected Response:**
```json
{
  "statusCode": 200,
  "data": {
    "statusCode": 200,
    "message": "success",
    "clientMessage": {
      "Message": "Success"
    }
  }
}
```

---

### 2. Add Fields to Form

#### Add Text Field
**POST** `/api/forms/{form-config-id}/fields`

**Request Body:**
```json
{
  "fieldName": "firstName",
  "fieldLabel": "First Name",
  "fieldType": "text",
  "isRequired": 1,
  "isUnique": 0,
  "sortOrder": 1
}
```

#### Add Email Field
**POST** `/api/forms/{form-config-id}/fields`

**Request Body:**
```json
{
  "fieldName": "email",
  "fieldLabel": "Email Address",
  "fieldType": "email",
  "isRequired": 1,
  "isUnique": 1,
  "sortOrder": 2
}
```

#### Add Select Field with Options
**POST** `/api/forms/{form-config-id}/fields`

**Request Body:**
```json
{
  "fieldName": "country",
  "fieldLabel": "Country",
  "fieldType": "select",
  "options": [
    {"label": "United States", "value": "US"},
    {"label": "Canada", "value": "CA"},
    {"label": "United Kingdom", "value": "UK"}
  ],
  "isRequired": 1,
  "sortOrder": 3
}
```

#### Add Number Field
**POST** `/api/forms/{form-config-id}/fields`

**Request Body:**
```json
{
  "fieldName": "age",
  "fieldLabel": "Age",
  "fieldType": "number",
  "isRequired": 1,
  "sortOrder": 4
}
```

---

### 3. Add Validation Rules

#### Add Required Validation to First Name
**POST** `/api/forms/fields/{field-id}/validations`

**Request Body:**
```json
{
  "validationType": "required",
  "errorMessage": "First name is required"
}
```

#### Add Min Length Validation
**POST** `/api/forms/fields/{field-id}/validations`

**Request Body:**
```json
{
  "validationType": "minLength",
  "value": "2",
  "errorMessage": "First name must be at least 2 characters"
}
```

#### Add Max Length Validation
**POST** `/api/forms/fields/{field-id}/validations`

**Request Body:**
```json
{
  "validationType": "maxLength",
  "value": "50",
  "errorMessage": "First name cannot exceed 50 characters"
}
```

#### Add Min Value Validation to Age
**POST** `/api/forms/fields/{age-field-id}/validations`

**Request Body:**
```json
{
  "validationType": "min",
  "value": "18",
  "errorMessage": "You must be at least 18 years old"
}
```

#### Add Max Value Validation to Age
**POST** `/api/forms/fields/{age-field-id}/validations`

**Request Body:**
```json
{
  "validationType": "max",
  "value": "120",
  "errorMessage": "Please enter a valid age"
}
```

#### Add Regex Validation for Email
**POST** `/api/forms/fields/{email-field-id}/validations`

**Request Body:**
```json
{
  "validationType": "regex",
  "value": "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
  "errorMessage": "Please enter a valid email address"
}
```

---

### 4. Get Form Config with All Fields
**GET** `/api/forms/{form-config-id}`

**Expected Response:**
```json
{
  "statusCode": 200,
  "data": {
    "id": "form-config-id",
    "menuId": "menu-id",
    "workspaceId": "workspace-id",
    "name": "User Registration Form",
    "tableName": "user_registrations",
    "status": "draft",
    "fields": [
      {
        "id": "field-id-1",
        "fieldName": "firstName",
        "fieldLabel": "First Name",
        "fieldType": "text",
        "isRequired": 1,
        "isUnique": 0,
        "sortOrder": 1,
        "validations": [
          {
            "id": "validation-id-1",
            "validationType": "required",
            "value": null,
            "errorMessage": "First name is required"
          },
          {
            "id": "validation-id-2",
            "validationType": "minLength",
            "value": "2",
            "errorMessage": "First name must be at least 2 characters"
          }
        ]
      },
      {
        "id": "field-id-2",
        "fieldName": "email",
        "fieldLabel": "Email Address",
        "fieldType": "email",
        "isRequired": 1,
        "isUnique": 1,
        "sortOrder": 2,
        "validations": [
          {
            "id": "validation-id-3",
            "validationType": "required",
            "value": null,
            "errorMessage": "Email is required"
          },
          {
            "id": "validation-id-4",
            "validationType": "regex",
            "value": "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
            "errorMessage": "Please enter a valid email address"
          }
        ]
      }
    ]
  }
}
```

---

### 5. Update Field Definition
**PATCH** `/api/forms/{form-config-id}/fields/{field-id}`

**Request Body:**
```json
{
  "fieldName": "fullName",
  "fieldLabel": "Full Name",
  "fieldType": "text",
  "isRequired": 1,
  "isUnique": 0
}
```

---

### 6. Reorder Fields
**PATCH** `/api/forms/{form-config-id}/fields/reorder`

**Request Body:**
```json
{
  "fieldOrders": [
    {"id": "field-id-1", "sortOrder": 2},
    {"id": "field-id-2", "sortOrder": 1},
    {"id": "field-id-3", "sortOrder": 3}
  ]
}
```

---

### 7. Update Validation Rule
**PATCH** `/api/forms/fields/validations/{validation-id}`

**Request Body:**
```json
{
  "validationType": "minLength",
  "value": "3",
  "errorMessage": "Name must be at least 3 characters long"
}
```

---

### 8. Get Form Config by Menu ID
**GET** `/api/forms/menu/{menu-id}`

**Expected Response:**
```json
{
  "statusCode": 200,
  "data": {
    "id": "form-config-id",
    "menuId": "menu-id",
    "workspaceId": "workspace-id",
    "name": "User Registration Form",
    "tableName": "user_registrations",
    "status": "draft"
  }
}
```

---

### 9. Update Form Config Meta
**PATCH** `/api/forms/{form-config-id}`

**Request Body:**
```json
{
  "name": "Updated User Registration Form",
  "tableName": "user_registrations_v2"
}
```

---

### 10. Publish Form
**POST** `/api/forms/{form-config-id}/publish`

**Expected Response:**
```json
{
  "statusCode": 200,
  "data": {
    "statusCode": 200,
    "message": "success",
    "clientMessage": {
      "Message": "Success"
    }
  }
}
```

---

### 11. Delete Operations

#### Delete Validation Rule
**DELETE** `/api/forms/fields/validations/{validation-id}`

#### Delete Field
**DELETE** `/api/forms/{form-config-id}/fields/{field-id}`

#### Delete Form Config
**DELETE** `/api/forms/{form-config-id}`

---

## Testing Order (Recommended)

1. **Create Form Config**
2. **Add Multiple Fields** (text, email, select, number, etc.)
3. **Add Validations** to each field
4. **Get Form with Fields** to verify structure
5. **Update Field** definitions
6. **Reorder Fields**
7. **Update Validation Rules**
8. **Get by Menu ID** to test alternative lookup
9. **Update Form Config** metadata
10. **Publish Form**
11. **Test Delete Operations** (optional - use test data)

## Field Types Available

- `text` - Single line text input
- `textarea` - Multi-line text input
- `number` - Numeric input
- `decimal` - Decimal number input
- `boolean` - Checkbox/true-false
- `date` - Date picker
- `datetime` - Date and time picker
- `select` - Single select dropdown
- `multiselect` - Multiple select
- `file` - File upload
- `email` - Email input with validation
- `phone` - Phone number input

## Validation Types Available

- `required` - Field must have a value
- `minLength` - Minimum character length
- `maxLength` - Maximum character length
- `min` - Minimum numeric value
- `max` - Maximum numeric value
- `regex` - Custom regex pattern

## Error Responses

All endpoints return consistent error format:
```json
{
  "statusCode": 400,
  "data": {
    "message": "error message"
  }
}
```

Common status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error
