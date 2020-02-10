import express, { Request, Response, Router } from "express";
import UserController from "../../controllers/v1/users";
import { IUser } from "../../models/v1/users";
import { createJWToken } from "../../libs/auth";
import { verifyJWT_MW } from "../../middlewares/auth";

const router: Router = express.Router();

router.post("/v1/signIn", async (req, res) => {
   try {
      const user: IUser | null = await UserController.signIn(req.body.email, req.body.password);
      if (user == null) {
         throw "Email or Password was wrong.";
      }
      const token: any = createJWToken({ sessionData: { id: user._id, role: user.role } });
      return res.send(token);
   } catch (error) {
      console.error(error);
      res.status(400).send("Malformed request payload");
   }
});

router.post("/v1/users", async (req, res) => {
   try {
      const user: IUser = await UserController.createUser(req.body);

      return res.send(user);
   } catch (error) {
      console.error(error);
      if (error != null) {
         if (error.keyValue != null && error.keyValue.email != null) {
            return res.status(400).send(`The mail "${error.keyValue.email}" is already in use`);
         }
      }
      return res.status(400).send("Malformed request payload");
   }

});

router.get("/v1/users/:id", verifyJWT_MW);
router.get("/v1/users/:id", async (req, res) => {
   try {
      const user: IUser | null = await UserController.getUser(req.params.id);

      if (user == null) {
         return res.status(404).send("Not found");
      }

      return res.send(user);
   } catch (error) {
      console.error(error);
      res.status(400).send("Malformed request payload");
   }
});

export const UserRoute = router;