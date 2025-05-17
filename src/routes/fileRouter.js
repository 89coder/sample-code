import express from "express";
import {uplaodFileController,countFileController } from "../controller/fileController";
import upload from "../utils/uploadFile";
const router = express.Router()



router.post("/upload-file",upload.array("uplaodFiles",5),uplaodFileController)
router.get("/count-file",countFileController)

export default router