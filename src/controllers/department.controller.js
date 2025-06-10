const Department = require("../models/department.model");
const User = require("../models/user.model");
const {
  statusCodeTemplate,
  catchTemplate,
  getMissingFields,
} = require("../utils/api.utils");
const { objectIdRegex } = require("../utils/model.utils");

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
      description: description,
    });
  } catch (error) {
    return catchTemplate(res, error);
  }
};

const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    if (!departments)
      return statusCodeTemplate(res, 404, "No Departments found.");

    return res.status(200).json({
      departments,
    });
  } catch (error) {
    return catchTemplate(res, error);
  }
};

const getDepartment = async (req, res) => {
  const id = req.params.id;

  const missingFields = getMissingFields(["id"], req.params);
  if (missingFields.length > 0) {
    return statusCodeTemplate(
      res,
      400,
      `Missing required field(s): ${missingFields.join(", ")}`
    );
  }

  if (id.length < 24 || !objectIdRegex.test(id))
    return statusCodeTemplate(res, 404, "Invalid id.");

  try {
    const department = await Department.findById(id);
    if (!department)
      return statusCodeTemplate(
        res,
        404,
        "No Department found for the provided id."
      );

    return res.status(200).json({
      department,
    });
  } catch (error) {
    return catchTemplate(res, error);
  }
};

const getUserDepartment = async (req, res) => {
  const id = req.params.id;

  const missingFields = getMissingFields(["id"], req.params);
  if (missingFields.length > 0) {
    return statusCodeTemplate(
      res,
      400,
      `Missing required field(s): ${missingFields.join(", ")}`
    );
  }

  if (id.length < 24 || !objectIdRegex.test(id))
    return statusCodeTemplate(res, 404, "Invalid id.");

  try {
    const user = await User.findById(id);
    if (!user)
      return statusCodeTemplate(res, 404, "No User found for the provided id.");

    const userDepartment = await Department.findById(user.department);

    return res.status(200).json({
      userDepartment,
    });
  } catch (error) {
    return catchTemplate(res, error);
  }
};

const updateUserDepartment = async (req, res) => {
  const { departmentId, userId } = req.body;

  const missingFields = getMissingFields(["departmentId", "userId"], req.body);
  if (missingFields.length > 0) {
    return statusCodeTemplate(
      res,
      400,
      `Missing required field(s): ${missingFields.join(", ")}`
    );
  }

  if (departmentId.length < 24 || !objectIdRegex.test(departmentId))
    return statusCodeTemplate(res, 404, "Invalid department id.");

  if (userId.length < 24 || !objectIdRegex.test(userId))
    return statusCodeTemplate(res, 404, "Invalid user id.");

  try {
    const department = await Department.findById(departmentId);
    const user = await User.findById(userId);

    if (!department)
      return statusCodeTemplate(
        res,
        404,
        "A department with the given id doesn't exist."
      );

    if (!user)
      return statusCodeTemplate(
        res,
        404,
        "A user with the given id doesn't exist."
      );

    user.department = department._id;
    if (!department.users.includes(user._id)) {
      department.users.push(user._id);
    }

    await user.save();
    await department.save();

    return res.status(200).json({
      message: "Department successfully updated.",
      department,
    });
  } catch (error) {
    return catchTemplate(res, error);
  }
};

module.exports = {
  addDepartment,
  getAllDepartments,
  getDepartment,
  getUserDepartment,
  updateUserDepartment,
};
