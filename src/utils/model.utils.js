const allowedRoles = ["owner", "supervisor", "auditor"];
// regex for checking if the id is a valid mongoose objectId data type
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

module.exports = {
    allowedRoles,
    objectIdRegex
}