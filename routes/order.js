const express = require("express");
const router = express.Router();

const { isAuthenticated, isSignedIn, isAdmin } = require("../controllers/auth");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const { updateStock } = require("../controllers/product");

const {
    getOrderId,
    createOrder,
    getAllOrders,
    updateStatus,
    getOrderStatus,
} = require("../controllers/order");

//params

router.param("userId", getUserById);
router.param("orderId", getOrderId);

//routes
//create - POST

router.post(
    "/order/create/:userId",
    isSignedIn,
    isAuthenticated,
    pushOrderInPurchaseList,
    updateStock,
    createOrder
);

//read - GET

router.get(
    "/order/all/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    getAllOrders
);

router.get(
    "order/status/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    getOrderStatus
);

//update - PUT

router.put(
    "/order/:orderId/status/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateStatus
);

//delete - DELETE
module.exports = router;
