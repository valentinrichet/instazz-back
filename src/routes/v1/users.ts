import express, { Router } from "express";
import multer from "multer";
import UserController from "../../controllers/v1/users";
import { UserCreationDto, UserDto, UserSignInDto, UserUpdateDto, UserFollowDto } from "../../dto/v1/users";
import { getDiskStorage, imageFilter } from "../../libs/upload";
import { verifyJWT_MW, isAdminOrUser_MW } from "../../middlewares/auth";
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
      const userId: string = req.params.id;
      const user: UserDto | null = await UserController.getUser(userId);
      if (user == null) {
         return res.status(404).send(`User with id "${userId}" wasn't found`);
      }
      return res.send(user);
   } catch (error) {
      next(error);
   }
});

router.put("/v1/users/:id", isAdminOrUser_MW);
router.put("/v1/users/:id", UserController.validate("updateUser"), validator);
router.put("/v1/users/:id", async (req, res, next) => {
   try {
      const userId: string = req.params.id;
      const userData: UserData = ((req as any).user as UserData);
      const userUpdateDto: UserUpdateDto = new UserUpdateDto(req.body);
      if (userData.role !== "admin") {
         delete userUpdateDto.role;
      }
      const userDto: UserDto | null = await UserController.updateUser(userId, userUpdateDto);
      if (userDto == null) {
         return res.status(404).send(`User with id "${userId}" wasn't found`);
      }
      return res.send(userDto);
   } catch (error) {
      next(error);
   }
});

router.post("/v1/users/:id/following", isAdminOrUser_MW);
router.post("/v1/users/:id/following", UserController.validate("followUser"), validator);
router.post("/v1/users/:id/following", async (req, res, next) => {
   try {
      const userId: string = req.params.id;
      const userFollowDto: UserFollowDto = new UserFollowDto(req.body);
      await UserController.follow(userId, userFollowDto);
      return res.status(204).send();
   } catch (error) {
      next(error);
   }
});

router.delete("/v1/users/:id/following/:followerId", isAdminOrUser_MW);
router.delete("/v1/users/:id/following/:followerId", UserController.validate("followUser"), validator);
router.delete("/v1/users/:id/following/:followerId", async (req, res, next) => {
   try {
      const userId: string = req.params.id;
      const followingId: string = req.params.followerId;
      await UserController.unfollow(userId, followingId);
      return res.status(204).send();
   } catch (error) {
      next(error);
   }
});


export const UserRoute = router;