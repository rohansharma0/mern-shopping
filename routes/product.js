const express = require("express");
const router = express.Router();

const {
    getProductById,
    createProduct,
    getProduct,
    getAllProduct,
    photo,
    deleteProduct,
    updateProduct,
    getAllUniqueCategories,
} = require("../controllers/product");
const { isAuthenticated, isSignedIn, isAdmin } = require("../controllers/auth");

const { getUserById } = require("../controllers/user");

//params

router.param("userId", getUserById);
router.param("productId", getProductById);

//routes

//create - POST
router.post(
    "/product/create/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    createProduct
);

//read - GET

router.get("/product/:productId", getProduct);

router.get("/products", getAllProduct);

router.get("/product/photo/:productId", photo);

router.get("/product/categories", getAllUniqueCategories);

//delete - DELETE
router.delete(
    "/product/:productId/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    deleteProduct
);

//update - PUT

router.put(
    "/product/:productId/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateProduct
);

module.exports = router;
