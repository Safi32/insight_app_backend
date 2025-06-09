const statusCodeTemplate = (res, statusCode, errorMessage) => {
  return res.status(statusCode).json({ message: errorMessage });
};

const catchTemplate = (res, error) => {
  console.error("Caught Error:", error);
  return statusCodeTemplate(res, 500, "Internal Server Error");
};

const getMissingFields = (requiredFields, body) => {
  return requiredFields.filter((field) => !body[field]);
};

module.exports = {
    statusCodeTemplate,
    catchTemplate,
    getMissingFields,
}