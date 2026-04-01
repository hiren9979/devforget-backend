const dotenv = require('dotenv');
const uuid = require('uuid4');

dotenv.config();

function generateV4Uuid() {
    return uuid();
}

function sanitizeString(data) {
    if (data === undefined) {
        return null;
    }
    if (data === null) {
        return null;
    }
    if (typeof data !== "string") {
        return null;
    }
    if (data.trim() === "") {
        return null;
    }
    if (data.trim().toLocaleLowerCase() === "null") {
        return null;
    }
    if (data.trim() === "undefined") {
        return null;
    }
    return data.trim();
}

function sanitizeArray(data) {
    if (data === undefined) {
        return [];
    }
    if (data === null) {
        return [];
    }
    if (!Array.isArray(data)) {
        return [];
    }
    if (data.length === 0) {
        return [];
    }
    return data;
}

function sanitizeBoolean(data) {
    if (data == "true" || data == true) {
        return true;
    }
    return false;
}

module.exports = {
    generateV4Uuid,
    sanitizeString,
    sanitizeArray,
    sanitizeBoolean
};