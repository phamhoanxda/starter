const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Nothing here',
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Nothing here',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Nothing here',
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Nothing here',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Nothing here',
  });
};

module.exports = {
  getAllUsers: getAllUsers,
  getUser: getUser,
  createUser: createUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
};
