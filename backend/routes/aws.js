import express from "express";
import { getObject } from "../aws/index.js";
const router = express.Router();

router.get("/s3/get", async (req, res, next) => {
	try {
		const key = req.query.key;
		const imageURL = getObject(key);
		return res.send({ imageURL });
	} catch (error) {
		next(error);
	}
});

export default router;
