const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const { signup, signout, signin, isSignedIn } = require("../controllers/auth");

router.post(
    "/signup",
    [
        check("name")
            .isLength({ min: 3 })
            .withMessage("Name should be at least 3 characters."),
        check("email").isEmail().withMessage("Email is required."),
        check("password")
            .isLength({ min: 5 })
            .withMessage("Password should be at least 5 characters."),
    ],
    signup
);

router.post(
    "/signin",
    [
        check("email").isEmail().withMessage("Email is required."),
        check("password")
            .isLength({ min: 5 })
            .withMessage("Password is required."),
    ],
    signin
);

router.get("/signout", signout);

router.get("/testroute", isSignedIn, (req, res) => {
    res.send("A protected route");
});

module.exports = router;
