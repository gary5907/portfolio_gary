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
// Skills routes
import skillsActions from "./modules/skills/skillsActions";

router.get("/api/skills", skillsActions.browse);
router.get("/api/skills/search/:term", skillsActions.search);
router.get("/api/skills/:id", skillsActions.read);
router.post("/api/skills", skillsActions.add);
router.put("/api/skills/:id", skillsActions.edit);
router.delete("/api/skills/:id", skillsActions.destroy);

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
