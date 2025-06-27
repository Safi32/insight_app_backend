const {
  statusCodeTemplate,
  catchTemplate,
  getMissingFields,
} = require("../utils/api.utils");
const Branch = require("../models/branch.model");

// Add new branch (Admin only)
exports.addBranch = async (req, res) => {
  const { branchName, branchAddress } = req.body;

  if (getMissingFields(["branchName", "branchAddress"], req.body, res)) return;

  try {
    // Check if branch name already exists
    const existingBranch = await Branch.findOne({ branchName });
    if (existingBranch) {
      return statusCodeTemplate(res, 400, "Branch name already exists.");
    }

    const branch = new Branch({
      branchName,
      branchAddress
    });

    await branch.save();

    res.status(201).json({
      message: "Branch added successfully.",
      branch: {
        id: branch._id,
        branchName: branch.branchName,
        branchAddress: branch.branchAddress,
        createdAt: branch.createdAt,
        updatedAt: branch.updatedAt
      }
    });
  } catch (error) {
    return catchTemplate(res, error);
  }
};

// Get all branches
exports.getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      branches: branches.map(branch => ({
        id: branch._id,
        branchName: branch.branchName,
        branchAddress: branch.branchAddress,
        createdAt: branch.createdAt,
        updatedAt: branch.updatedAt
      }))
    });
  } catch (error) {
    return catchTemplate(res, error);
  }
};

// Get branch by ID
exports.getBranchById = async (req, res) => {
  const { branchId } = req.params;

  if (!branchId) {
    return statusCodeTemplate(res, 400, "Branch ID is required.");
  }

  try {
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return statusCodeTemplate(res, 404, "Branch not found.");
    }

    res.status(200).json({
      branch: {
        id: branch._id,
        branchName: branch.branchName,
        branchAddress: branch.branchAddress,
        createdAt: branch.createdAt,
        updatedAt: branch.updatedAt
      }
    });
  } catch (error) {
    return catchTemplate(res, error);
  }
};

// Update branch (Admin only)
exports.updateBranch = async (req, res) => {
  const { branchId } = req.params;
  const { branchName, branchAddress } = req.body;

  if (!branchId) {
    return statusCodeTemplate(res, 400, "Branch ID is required.");
  }

  if (getMissingFields(["branchName", "branchAddress"], req.body, res)) return;

  try {
    // Check if branch exists
    const existingBranch = await Branch.findById(branchId);
    if (!existingBranch) {
      return statusCodeTemplate(res, 404, "Branch not found.");
    }

    // Check if new branch name already exists (excluding current branch)
    const duplicateBranch = await Branch.findOne({ 
      branchName, 
      _id: { $ne: branchId } 
    });
    if (duplicateBranch) {
      return statusCodeTemplate(res, 400, "Branch name already exists.");
    }

    const updatedBranch = await Branch.findByIdAndUpdate(
      branchId,
      { branchName, branchAddress },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Branch updated successfully.",
      branch: {
        id: updatedBranch._id,
        branchName: updatedBranch.branchName,
        branchAddress: updatedBranch.branchAddress,
        createdAt: updatedBranch.createdAt,
        updatedAt: updatedBranch.updatedAt
      }
    });
  } catch (error) {
    return catchTemplate(res, error);
  }
};

// Delete branch (Admin only)
exports.deleteBranch = async (req, res) => {
  const { branchId } = req.params;

  if (!branchId) {
    return statusCodeTemplate(res, 400, "Branch ID is required.");
  }

  try {
    const branch = await Branch.findByIdAndDelete(branchId);
    if (!branch) {
      return statusCodeTemplate(res, 404, "Branch not found.");
    }

    res.status(200).json({
      message: "Branch deleted successfully."
    });
  } catch (error) {
    return catchTemplate(res, error);
  }
}; 