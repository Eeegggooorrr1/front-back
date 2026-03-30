const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const {
  ACCESS_SECRET,
  REFRESH_SECRET,
  ACCESS_EXPIRES_IN,
  REFRESH_EXPIRES_IN,
} = require('./config');

const users = [
  {
    id: nanoid(6),
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    blocked: false,
  },
  {
    id: nanoid(6),
    username: 'seller',
    password: 'seller123',
    role: 'seller',
    blocked: false,
  },
  {
    id: nanoid(6),
    username: 'user',
    password: 'user123',
    role: 'user',
    blocked: false,
  },
];

const refreshTokens = new Set();

function publicUser(user) {
  const { password, ...data } = user;
  return data;
}

function findUserById(id) {
  return users.find((u) => u.id === id) || null;
}

function findUserByUsername(username) {
  return users.find((u) => u.username === username) || null;
}

function generateAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      username: user.username,
      role: user.role,
    },
    ACCESS_SECRET,
    {
      expiresIn: ACCESS_EXPIRES_IN,
    }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      username: user.username,
      role: user.role,
    },
    REFRESH_SECRET,
    {
      expiresIn: REFRESH_EXPIRES_IN,
    }
  );
}

function createUser(data) {
  const username = (data.username || '').trim();
  const password = (data.password || '').trim();
  const role = data.role || 'user';

  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  if (!['user', 'seller', 'admin'].includes(role)) {
    throw new Error('Invalid role');
  }

  if (findUserByUsername(username)) {
    throw new Error('User already exists');
  }

  const user = {
    id: nanoid(6),
    username,
    password,
    role,
    blocked: false,
  };

  users.push(user);
  return user;
}

function loginUser(data) {
  const username = (data.username || '').trim();
  const password = (data.password || '').trim();

  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  const user = findUserByUsername(username);

  if (!user || user.password !== password) {
    throw new Error('Invalid credentials');
  }

  if (user.blocked) {
    throw new Error('User is blocked');
  }

  return user;
}

function rotateRefreshToken(refreshToken) {
  if (!refreshToken) {
    throw new Error('Refresh token is required');
  }

  if (!refreshTokens.has(refreshToken)) {
    throw new Error('Invalid refresh token');
  }

  let payload;

  try {
    payload = jwt.verify(refreshToken, REFRESH_SECRET);
  } catch (error) {
    refreshTokens.delete(refreshToken);
    throw new Error('Invalid refresh token');
  }

  const user = findUserById(payload.sub);

  if (!user || user.blocked) {
    throw new Error('User not found');
  }

  refreshTokens.delete(refreshToken);

  const accessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  refreshTokens.add(newRefreshToken);

  return {
    user,
    accessToken,
    refreshToken: newRefreshToken,
  };
}

module.exports = {
  users,
  refreshTokens,
  publicUser,
  findUserById,
  findUserByUsername,
  generateAccessToken,
  generateRefreshToken,
  createUser,
  loginUser,
  rotateRefreshToken,
};