import express, { Request, Response, Router } from "express";

const router: Router = express.Router();

router.get('/', function(req: Request, res: Response){
    res.send('GET route on things.');
 });

 router.post('/', function(req: Request, res: Response){
    res.send('POST route on things.');
 });
 
 export const UserRoute = router;