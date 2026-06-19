import jwt from "jsonwebtoken";
import db from "../_helpers/db.js";

/**
 * Socket.IO middleware to authenticate and authorize users
 * Verifies JWT token and attaches user info to socket
 */
export default async function socketAuthorize(socket, next) {
  try {
    // Get token from handshake auth or query
    const token =
      socket.handshake.auth.token || socket.handshake.headers.authorization;

    if (!token) {
      return next(new Error("Authentication token required"));
    }

    // Remove 'Bearer ' prefix if present
    const cleanToken = token.replace(/^Bearer\s+/i, "");

    // Verify JWT token
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);

    // Fetch account from database
    const account = await db.Account.findByPk(decoded.id);

    if (!account) {
      return next(new Error("Account not found"));
    }

    // Attach user info to socket for use in event handlers
    socket.user = {
      id: account.id,
      email: account.email,
      firstName: account.firstName,
      lastName: account.lastName,
      role: account.role,
    };

    console.log(
      `Socket authenticated: ${socket.id} - User: ${account.email} (${account.role})`,
    );

    next();
  } catch (error) {
    console.error("Socket authentication error:", error.message);
    return next(new Error("Invalid or expired token"));
  }
}
