const User = require("../models/User");
const Order = require("../models/order");

exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "No user was found in DB",
            });
        }
        req.profile = user;
        next();
    });
};

exports.getUser = (req, res) => {
    //hide salt and password from exposings
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;

    return res.json(req.profile);
};

exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        { _id: req.profile._id },
        { $set: req.body },
        { new: true, useFindAndModify: false },
        (err, user) => {
            if (err) {
                return res
                    .status(400)
                    .json({ error: "You are not authorized" });
            }

            //hide salt and password from exposings
            user.salt = undefined;
            user.encry_password = undefined;
            user.createdAt = undefined;
            user.updatedAt = undefined;

            return res.json(user);
        }
    );
};

exports.userPurchaseList = (req, res) => {
    Order.find({
        user: req.profile._id,
    })
        .populate("user", "_id name")
        .exec((err, order) => {
            if (err) {
                return res.status(400).json({
                    error: "No Order in this account.",
                });
            }
            return res.json({ order });
        });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
    let purchaseList = [];

    req.body.order.products.forEach((product) => {
        purchaseList.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction,
        });
    });

    //store this in DB

    User.findOneAndUpdate(
        { _id: req.profile.id },
        { $push: { purchases: purchaseList } },
        { new: true },
        (err, purchases) => {
            if (err) {
                return res.status(400).json({
                    error: "Unable to save purchase list.",
                });
            }
            next();
        }
    );
};
