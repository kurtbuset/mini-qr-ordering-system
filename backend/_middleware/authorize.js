import { expressjwt } from "express-jwt";
import db from "../_helpers/db.js";

export default authorize;

function authorize(roles = []) {
  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === "string") {
    roles = [roles];
  }

  return [
    // Extract JWT token from frontend Authorization header, verify signature, and decode payload to req.auth
    expressjwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),

    // authorize based on user role
    async (req, res, next) => {
      const account = await db.Account.findByPk(req.auth.id);

      if (!account) {
        // account no longer exists or role not authorized
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (roles.length && !roles.includes(account.role)) {
        return res
          .status(403)
          .json({ message: "Forbidden - Insufficient permissions" });
      }

      // authentication and authorization successful
      req.user = {
        id: account.id,
        role: account.role,
      };

      const refreshTokens = await account.getRefreshTokens();
      req.user.ownsToken = (token) =>
        !!refreshTokens.find((x) => x.token === token);
      next();
    },
  ];
}
