const Role = require("../models/role.model");

async function getAllRole(req, res) {
  try {
    let searchObject = {};
    if (req.query.search && req.query.search !== "undefined") {
      searchObject.name = { $regex: ".*" + req.query.search + ".*" };
    }
    const roles = await Role.find(searchObject);

    return res.status(200).json({ roles: roles });
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
}

async function getRoleByPermission(req, res) {
  try {
    let searchObject = {};
    if (req.user.role.level === 1) {
      searchObject = {
        $or: [{ level: { $gte: 1 } }, { level: { $exists: false } }],
      };
    } else {
      if (req.user.role.level) {
        searchObject = {
          $or: [
            { level: { $gt: req.user.role.level } },
            { level: { $exists: false } },
          ],
        };
      }
    }
    const roles = await Role.find(searchObject);
    return res.status(200).json({ roles: roles });
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
}

module.exports = {
  getAllRole,
  getRoleByPermission,
};
