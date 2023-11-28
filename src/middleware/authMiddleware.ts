import jwt from "jsonwebtoken";

export const checkAuth = (req: any, res: any, next: any) => {
  // check if Authorization header is present

  if (!req.headers.authorization) {
    return res.status(401).json({
      status: "error",
      error: "Authorization header is required",
    });
  }

  // check if Authorization header is valid
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log(decoded); 
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({
      status: "error",
      error: "Invalid token",
    });
  }
};


export const checkAdmin = (req: any, res: any, next: any) => {
  // check if Authorization header is present

  if (!req.headers.authorization) {
    return res.status(401).json({
      status: "error",
      error: "Authorization header is required",
    });
  }

  // check if Authorization header is valid
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    req.userId = decoded.userId;
    req.admin = decoded.admin;
    next();
  } catch (err) {
    return res.status(401).json({
      status: "error",
      error: "Invalid token",
    });
  }
}