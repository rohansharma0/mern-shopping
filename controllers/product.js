const Product = require("../models/product");
const formidable = require("formidable");

const _ = require("lodash");

const fs = require("fs");

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "Problem with image",
            });
        }
        //destructure the fields

        const { name, description, price, category, stock } = fields;

        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                error: "Please include all fields",
            });
        }

        let product = new Product(fields);

        //handle file
        if (file.photo) {
            if (file.photo.size > 3 * 1024 * 1024) {
                return res.status(400).json({
                    error: "File size too big!",
                });
            }

            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        //save to DB
        product.save((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "Failed to save product to DB",
                });
            }

            res.json({ product });
        });
    });
};

exports.getProduct = (req, res) => {
    return res.json(res.product);
};

//middleware
exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType);
        res.send(req.product.photo.data);
    }
    next();
};

exports.getAllProduct = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    Product.find()
        .select("-photo")
        .populate("category")
        .sort([[sortBy, "asc"]])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "No products found",
                });
            }
            res.json(products);
        });
};

exports.deleteProduct = (req, res) => {
    const product = req.product;

    product.remove((err, deleteProduct) => {
        if (err) {
            return res.status(400).json({
                error: "Faild to delete product",
            });
        }
        res.json({
            message: "Deletion was successful",
            deleteProduct,
        });
    });
};

exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "Problem with image",
            });
        }

        //updatation file

        let product = req.product;

        product = _.extend(product, fields);

        //handle file
        if (file.photo) {
            if (file.photo.size > 3 * 1024 * 1024) {
                return res.status(400).json({
                    error: "File size too big!",
                });
            }

            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        //save to DB
        product.save((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "Failed to update",
                });
            }

            res.json(product);
        });
    });
};

exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
        .populate("category")
        .exec((err, product) => {
            if (err) {
                return "Product not found";
            }
            req.product = product;
            next();
        });
};

exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err, category) => {
        if (err) {
            return res.status(400).json({
                error: "No category found",
            });
        }
        res.json(category);
    });
};

exports.updateStock = (req, res, next) => {
    let myOperation = req.body.order.products.map((product) => {
        return {
            updateOne: {
                filter: { _id: product._id },
                update: {
                    $inc: { stock: -product.count, sold: +product.count },
                },
            },
        };
    });

    Product.bulkWrite(myOperation, {}, (err, products) => {
        if (err) {
            return res.status(400).json({
                error: "Bulk operation failed",
            });
        }
        next();
    });
};
