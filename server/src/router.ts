import express from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes
import itemActions from "./modules/item/itemActions";

router.get("/api/items", itemActions.browse);
router.get("/api/items/:id", itemActions.read);
router.post("/api/items", itemActions.add);

/* ************************************************************************* */
import { hashPassword, login } from "../middlewares/argon.middlewares";
import {
  checkEmail,
  checkEmailAndStoreUserData,
} from "../middlewares/checkEmail.middlewares";
import validateUser from "../validations/userValidations";
import userActions from "./modules/user/userActions";

router.post("/api/login", checkEmailAndStoreUserData, login);

router.post(
  "/api/register",
  validateUser,
  checkEmail,
  hashPassword,
  userActions.add,
);
router.get("/api/users", userActions.browse);
router.get("/api/users/:id", userActions.read);

export default router;
