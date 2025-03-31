import * as express from "express"
import User from "../models/user";

declare global{
    namespace express{
        interface Request{
            user?:User;
        }
    }
}