const jwt = require("jsonwebtoken");

exports.postRequestPayment = (req, res, next) => {
  console.log(req.body);
  //get bearer token from request header
  //verify token

  const bearerToken = req.headers.authorization.split(" ")[1];

  jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json({
        status: "error",
        error: err,
      });
    }

    //
    const options = {
      clientId: process.env.K2_CLIENT_ID,
      clientSecret: process.env.K2_CLIENT_SECRET,
      apiKey: process.env.K2_API_KEY,
      baseUrl: process.env.K2_BASE_URL,
    };

    //Including the kopokopo module
    var K2 = require("k2-connect-node")(options);

    const StkService = K2.StkService;

    var stkOptions = {
      paymentChannel: "M-PESA STK Push",
      tillNumber: "K000000",
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      currency: "KES",
      amount: req.body.amount,
      // A maximum of 5 key value pairs
      metadata: {
        customerId: "123456789",
        reference: "123456",
        notes: "Payment for invoice 123456",
      },
      // This is where once the request is completed kopokopo will post the response
      callbackUrl: "https://my-valid-url.com/endpoint",
      accessToken: decoded.kopoResponse.access_token,
    };

    StkService.initiateIncomingPayment(stkOptions)
      .then((response) => {
        console.log(response);
        res.status(200).json({
          status: "success",
          data: response,
        });
        // => 'https://sandbox.kopokopo.com/api/v1/incoming_payments/247b1bd8-f5a0-4b71-a898-f62f67b8ae1c'
      })
      .catch((error) => {
        console.log(error);
        res.status(400).json({
          status: "error",
          error: error,
        });
      });

    //
  });
};
