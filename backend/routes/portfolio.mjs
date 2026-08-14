import express from "express";
import {
  addPortfolioItem,
  editPortfolioItem,
  deletePortfolioItem,
} from "../controllers/imageController.mjs";
import verifyJwt from "../middleware/verifyJwt.mjs";
import { upload } from "../middleware/multer.mjs";

const portfolioRouter = express.Router();

portfolioRouter.use(verifyJwt);

portfolioRouter.post("/portfolio", upload.single("image"), addPortfolioItem);
portfolioRouter.patch("/portfolio/:itemId", upload.single("image"), editPortfolioItem);
portfolioRouter.delete("/portfolio/:itemId", deletePortfolioItem);

export default portfolioRouter;