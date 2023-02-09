import express from "express";
import {
  createCampaign
} from "../controllers/campaignControllers.js";

const router = express.Router();

// router.route("/raisedExtract").get(raisedExtract);

// router.route("/raisedAdd").post(raisedAdd);

router.route("/create").post(createCampaign);

export default router;
