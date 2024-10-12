import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  // Get the token from the cookies
  const token = req.cookies.auth_token;
  const role=req.cookies.role;

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ message: 'authorization denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Attach user information to request (from token payload)
    req.user = decoded.id; // 'decoded' contains the data (e.g., user ID)
    req.role=decoded.role
    // Continue with the next middleware or route handler
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid User' });
  }
};
