const {
  createUser,
  loginUser,
  rotateRefreshToken,
  publicUser,
  findUserById,
  generateAccessToken,
  generateRefreshToken,
  refreshTokens,
} = require('../security');

const register = (req, res) => {
  try {
    const user = createUser({
      username: req.body.username,
      password: req.body.password,
      role: req.body.role || 'user',
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    refreshTokens.add(refreshToken);

    res.status(201).json({
      user: publicUser(user),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = (req, res) => {
  try {
    const user = loginUser(req.body);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    refreshTokens.add(refreshToken);

    res.json({
      user: publicUser(user),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const refresh = (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const result = rotateRefreshToken(refreshToken);

    res.json({
      user: publicUser(result.user),
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const me = (req, res) => {
  const user = findUserById(req.user.sub);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(publicUser(user));
};

module.exports = {
  register,
  login,
  refresh,
  me,
};