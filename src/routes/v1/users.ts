import express, { Router } from "express";
import multer from "multer";
import UserController from "../../controllers/v1/users";
import { UserCreationDto, UserDto, UserSignInDto, UserUpdateDto } from "../../dto/v1/users";
import { getDiskStorage, imageFilter } from "../../libs/upload";
import { verifyJWT_MW } from "../../middlewares/auth";
import validator from "../../middlewares/validator";
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

router.post(`/v1/sessions`, UserController.validate("signIn"), validator);
router.post("/v1/sessions", async (req, res, next) => {
   try {
      const token: string | null = await UserController.signIn(new UserSignInDto(req.body));
      if (token == null) {
         return res.status(401).send("Email or Password was wrong");
      }
      return res.send(token);
   } catch (error) {
      next(error);
   }
});

router.post("/v1/users", UserController.validate("createUser"), validator);
router.post("/v1/users", async (req, res, next) => {
   try {
      const user: UserDto = await UserController.createUser(new UserCreationDto(req.body));
      return res.send(user);
   } catch (error) {
      next(error);
   }
});

router.get("/v1/users/:id", verifyJWT_MW);
router.get("/v1/users/:id", async (req, res, next) => {
   try {
      const user: UserDto | null = await UserController.getUser(req.params.id);
      if (user == null) {
         return res.status(404).send(`User with id "${req.params.id}" wasn't found`);
      }
      return res.send(user);
   } catch (error) {
      next(error);
   }
});

router.put("/v1/users/:id", verifyJWT_MW);
router.put("/v1/users/:id", UserController.validate("updateUser"), validator);
router.put("/v1/users/:id", async (req, res, next) => {
   try {
      const userData: UserData = ((req as any).user as UserData);
      if (userData.role !== "admin" && userData.id !== req.params.id) {
         return res.status(401).send("You're not allowed to update this user.");
      }
      const userUpdateDto: UserUpdateDto = new UserUpdateDto(req.body);
      if (userData.role !== "admin") {
         delete userUpdateDto.role;
      }
      const userDto: UserDto | null = await UserController.updateUser(req.params.id, userUpdateDto);
      if (userDto == null) {
         return res.status(404).send(`User with id "${req.params.id}" wasn't found`);
      }
      return res.send(userDto);
   } catch (error) {
      next(error);
   }
});

export const UserRoute = router;