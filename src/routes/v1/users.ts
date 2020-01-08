import express, { Request, Response, Router } from "express";
import UserController from "../../controllers/v1/users";
import { IUser } from "../../models/v1/users";

const router: Router = express.Router();

router.get("/", function (req: Request, res: Response) {
   res.send("GET route on things.");
});

router.post("/", function (req: Request, res: Response) {
   res.send("POST route on things.");
});

router.post("/api/user", async (req, res) => {
   try {
      const user: IUser = await UserController.CreateUser({
         firstName: req.body.firstName,
         lastName: req.body.lastName,
         email: req.body.email
      });

      return res.send(user);
   } catch (error) {
      console.error(error);
      res.status(400).send("Malformed request payload");
   }

});

router.get("/api/user/:id", async (req, res) => {
   try {
      const user: IUser | null = await UserController.GetUser(req.params.id);

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


