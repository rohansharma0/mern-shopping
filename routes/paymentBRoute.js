const express = require("express");
const router = express.Router();

const { isAuthenticated, isSignedIn, isAdmin } = require("../controllers/auth");

const { getToken, processPayment } = require("../controllers/paymentB");
const { getUserById } = require("../controllers/user");

router.param("userId", getUserById);

router.get(
    "/payment/gettoken/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    getToken
);

router.get(
    "/payment/braintree/:userId",
    isSignedIn,
    isAuthenticated,
    processPayment
);

module.exports = router;
