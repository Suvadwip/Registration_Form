const jwt = require("jsonwebtoken");
class AuthJwt {
  async authJwt(req, res, next) {
    try {
      if (req.cookies && req.cookies.userToken) {
        jwt.verify(req.cookies.userToken,"SUV1234DP", (err,data) => {
          req.user = data
          next()
        });
      }else{
        next()
      }
    } catch (error) {
      throw error;
    }
  }
}
module.exports = new AuthJwt();
