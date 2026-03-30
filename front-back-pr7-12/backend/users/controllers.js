const { users, publicUser, findUserById, findUserByUsername } = require('../security');

const getAll = (req, res) => {
  res.json(users.map(publicUser));
};

const getById = (req, res) => {
  const user = findUserById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(publicUser(user));
};

const update = (req, res) => {
  const user = findUserById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const hasFields =
    req.body?.username !== undefined ||
    req.body?.password !== undefined ||
    req.body?.role !== undefined ||
    req.body?.blocked !== undefined;

  if (!hasFields) {
    return res.status(400).json({ error: 'Nothing to update' });
  }

  if (req.body.username !== undefined) {
    const username = String(req.body.username).trim();

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const existing = findUserByUsername(username);

    if (existing && existing.id !== user.id) {
      return res.status(400).json({ error: 'User already exists' });
    }

    user.username = username;
  }

  if (req.body.password !== undefined) {
    const password = String(req.body.password).trim();

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    user.password = password;
  }

  if (req.body.role !== undefined) {
    if (!['user', 'seller', 'admin'].includes(req.body.role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    user.role = req.body.role;
  }

  if (req.body.blocked !== undefined) {
    user.blocked = Boolean(req.body.blocked);
  }

  res.json(publicUser(user));
};

const blockUser = (req, res) => {
  const user = findUserById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.blocked = true;
  res.status(204).send();
};

module.exports = {
  getAll,
  getById,
  update,
  blockUser,
};