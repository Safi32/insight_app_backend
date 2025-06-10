const mongoose = require("mongoose");
const Department = require("../models/department.model");
const {
  statusCodeTemplate,
  catchTemplate,
  getMissingFields,
} = require("../utils/api.utils");

const addDepartment = async (req, res) => {
  const { name, description } = req.body;
  const missingFields = getMissingFields(["name"], req.body);
  if (missingFields.length > 0) {
    return statusCodeTemplate(
      res,
      400,
      `Missing required field(s): ${missingFields.join(", ")}`
    );
  }

  try {
    const department = await Department({ name, description });
    await department.save();
    return res.status(200).json({
        name: name,
        description: description
    })
  } catch (error) {
    return catchTemplate(res, error);
  }
};

module.exports = {
  addDepartment,
};
