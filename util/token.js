
const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next) => {
  const bearerToken = req.headers.authorization.split(" ")[1];
  let decodedToken = "";

  jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json({
        status: "error",
        error: err,
      });
    }

    decodedToken = decoded;
  });
  return decodedToken;
};

module.exports = { verifyToken };   