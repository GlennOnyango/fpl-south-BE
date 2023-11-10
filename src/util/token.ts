import jwt from "jsonwebtoken";

const verifyToken = (req: any, res: any, next: any) => {
  const bearerToken = req.headers.authorization.split(" ")[1];
  let decodedToken = "";

  jwt.verify(
    bearerToken,
    process.env.JWT_SECRET as string,
    (err: any, decoded: any) => {
      if (err) {
        console.log(err);
        return res.status(401).json({
          status: "error",
          error: err,
        });
      }

      decodedToken = decoded;
    }
  );
  return decodedToken;
};

module.exports = { verifyToken };
