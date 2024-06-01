import { ApiError } from "../helpers/errorHandler.js";

import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.userData;


  if (!token) {
    res.json(new ApiError(401, null, "Access Denied"));
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.json(new ApiError(400, null, "Invalid Token"));
  }
};
