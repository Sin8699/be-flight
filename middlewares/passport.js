const passportJWT = require('passport-jwt');
const User = require('../models/user');

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_SECRET || '';
jwtOptions.issuer = process.env.JWT_ISSUER || '';

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(jwtOptions, async function (jwt_payload, done) {
      let user = await User.getUser({ id: jwt_payload.id });
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
  );
};
