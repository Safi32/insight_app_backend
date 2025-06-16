const statusCodeTemplate = (res, statusCode, errorMessage) => {
  return res.status(statusCode).json({ message: errorMessage });
};

const catchTemplate = (res, error) => {
  console.error("Caught Error:", error);
  return statusCodeTemplate(res, 500, "Internal Server Error");
};

const getMissingFields = (requiredFields, body, res) => {
  const missingFields = requiredFields.filter((field) => !body[field]);
  if (missingFields.length > 0) {
    return statusCodeTemplate(
      res,
      400,
      `Missing required field(s): ${missingFields.join(", ")}`
    );
  }
}

module.exports = {
    statusCodeTemplate,
    catchTemplate,
    getMissingFields,
}