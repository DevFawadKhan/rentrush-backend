import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  // Get the token from the cookies
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json('authorization denied' );
  }

  try {

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

  
    req.user = decoded.id; 
    req.role=decoded.role
    next();
  } catch (error) {
    return res.status(403).json('Invalid User');
  }
};
