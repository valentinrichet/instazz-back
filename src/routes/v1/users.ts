import express, { Router } from "express";
import multer from "multer";
import UserController from "../../controllers/v1/users";
import { createJWToken } from "../../libs/auth";
import { getDiskStorage, imageFilter } from "../../libs/upload";
import { verifyJWT_MW } from "../../middlewares/auth";
import validator from "../../middlewares/validator";
import { IUser } from "../../models/v1/users";
import { UserData } from "../../types/user_data";

const router: Router = express.Router();

router.post("/v1/test", async (req, res) => {
   let upload = multer({ storage: getDiskStorage("a"), fileFilter: imageFilter }).single('profile');
   upload(req, res, function (err) {
      /*
      if (req.fileValidationError) {
         return res.send(req.fileValidationError);
      }
      */
      if (!req.file) {
         return res.send('Please select an image to upload');
      }
      else if (err instanceof multer.MulterError) {
         return res.send(err);
      }
      else if (err) {
         return res.send(err);
      }

      // Display uploaded image for user validation
      res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`);
   });
});

router.post("/v1/signIn", UserController.validate("signIn"), validator, async (req, res) => {
   try {
      const user: IUser | null = await UserController.signIn(req.body.email, req.body.password);
      if (user == null) {
         return res.status(401).send({ error: "Email or Password was wrong" });
      }
      const details: { sessionData: UserData } = { sessionData: { id: user._id, role: user.role } };
      const token: any = createJWToken(details);
      return res.send(token);
   } catch (error) {
      console.error(error);
      return res.status(500).send("There was an issue with the server, please try later...");
   }
});

router.post("/v1/users", UserController.validate("createUser"), validator, async (req, res) => {
   try {
      const user: IUser = await UserController.createUser(req.body);
      return res.send(user);
   } catch (error) {
      console.error(error);
      if (error != null) {
         if (error.keyValue != null) {
            const extractedErrors: any[] = [];
            if (error.keyValue.email != null) {
               extractedErrors.push({ "email": `The mail "${error.keyValue.email}" is already in use` });
            }
            if (error.keyValue.username != null) {
               extractedErrors.push({ "username": `The username "${error.keyValue.username}" is already in use` });
            }
            return res.status(422).send(extractedErrors);
         }
      }
      return res.status(500).send("There was an issue with the server, please try later...");
   }
});

router.get("/v1/users/:id", verifyJWT_MW);
router.get("/v1/users/:id", async (req, res) => {
   try {
      const user: IUser | null = await UserController.getUser(req.params.id);

      if (user == null) {
         return res.status(404).send(`User with id "${req.params.id}" wasn't found`);
      }

      return res.send(user);
   } catch (error) {
      console.error(error);
      return res.status(500).send("There was an issue with the server, please try later...");
   }
});

router.put("/v1/users/:id", verifyJWT_MW);
router.put("/v1/users/:id", async (req, res) => {
   try {
      let user: IUser | null = await UserController.getUser(req.params.id);
      const userData: UserData = ((req as any).user as UserData);

      if (user == null || (userData.id !== req.params.id)) {
         return res.status(401).send("You're not allowed to update this user.");
      }

      if (req.body.email != null) {
         user.email = req.body.email;
      }
      if (req.body.description != null) {
         user.description = req.body.description;
      }

      await UserController.updateUser({ _id: user?._id, email: user?.email, description: user?.description });

      return res.send(user);
   } catch (error) {
      console.error(error);
      return res.status(400).send("Malformed request payload");
   }
});

export const UserRoute = router;