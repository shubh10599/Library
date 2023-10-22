const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const { RESPONS_CODE } = require("../config");

const verifyToken = (req, res, next) => {
  try {
    const authToken = req.headers.token;
    // console.log(authToken);
    //   morgan(authToken);

    if (authToken) {
      jwt.verify(authToken, process.env.token_scrk, (err, decoded) => {
        if (err) return res.status(401).json(
          {
            message : "token not valid!",
            code : RESPONS_CODE.ERROR
          }
        );
        // console.log(decoded);
        req.user = decoded;
        next();
      });
    } else {
      return res.status(401).json({
        message : "you are not authenticate",
        code : RESPONS_CODE.ERROR
      });
    }
  } catch (error) {
    res.send(error);
  }
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).send("you are not allow to at!");
    }
  });
};

const veriftTokenAndUser = (req, res, next) => {
  console.log(req);
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(404).send("error");
    }
  });
};
module.exports = { verifyToken, veriftTokenAndUser, verifyTokenAndAdmin };
