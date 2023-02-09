import asyncHandler from "express-async-handler";
import {Campaign} from "../models/campaignModel.js";
// import Donation from "../models/campaignModel";

const createCampaign = asyncHandler(async (req, res) => {
  // create a dummy product which can be edited later
  const {name, organization, image, user, title, description, total, type} = req.body;
  const campaign = new Campaign( {name, organization, image, user, title, description, total, type});
  const createdCampaign = await campaign.save();
  res.status(201).json(createdCampaign);
});


export {createCampaign };
