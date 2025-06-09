const statusCodeTemplate = (res, statusCode, errorMessage) => {
  return res.status(statusCode).json({ message: errorMessage });
};

const catchTemplate = (res, error) => {
  console.error("Caught Error:", error);
  return statusCodeTemplate(res, 500, "Internal Server Error");
};

module.exports = {
    statusCodeTemplate,
    catchTemplate
}