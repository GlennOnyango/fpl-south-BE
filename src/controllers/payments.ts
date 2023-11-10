import jwt from "jsonwebtoken";

export const postRequestPayment = (req: any, res: any, next: any) => {
  console.log(req.body);
  //get bearer token from request header
  //verify token

  const bearerToken = req.headers.authorization.split(" ")[1];

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

      //
    }
  );
};
