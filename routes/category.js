const express = require("express");
const router = express.Router();

const {
    getCategoryId,
    createCategory,
    getCategory,
    getAllCategory,
    updateCategory,
    deleteCategory,
} = require("../controllers/category");
const { isAdmin, isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//params
router.param("userId", getUserById);
router.param("categoryId", getCategoryId);

//routers

//create - POST
router.post(
    "/category/create/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    createCategory
);
//read - GET
router.get("/category/:categoryId", getCategory);

router.get("/categories", getAllCategory);

//update - PUT
router.put(
    "/category/:categoryId/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateCategory
);

//delete - DELETE
router.delete(
    "/category/:categoryId/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    deleteCategory
);

module.exports = router;
