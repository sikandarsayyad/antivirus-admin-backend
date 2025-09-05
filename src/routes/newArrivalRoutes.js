import express from "express";
import { getArrivalProducts, addArrivalProduct, deleteArrivalProduct, updateArrivalProduct, getArrivalProductById} from "../controllers/newArrivalController.js";
import multer from "multer";

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "model/pics/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.get("/", getArrivalProducts);
router.post("/", upload.single("image"), addArrivalProduct);
router.delete("/:id", deleteArrivalProduct);
router.put("/:id", upload.single("image"), updateArrivalProduct);
router.get("/:id", getArrivalProductById);

export { router as newArrivalRouter };


//juber// rakesh