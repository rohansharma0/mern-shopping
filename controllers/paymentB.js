const braintree = require("braintree");

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: "y2bk3knp4j3mtryy",
    publicKey: "psf73ch35x5vhygt",
    privateKey: "fa7dbcfbcd4809b0449d80b751fa8edd",
});

exports.getToken = (req, res) => {
    gateway.clientToken.generate({}, (err, response) => {
        // pass clientToken to your front-end
        if (err) {
            return res.status(500).send({
                error: err,
            });
        } else {
            res.send(response);
        }
    });
};

exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amountFromTheClient = req.body.amount;
    gateway.transaction.sale(
        {
            amount: amountFromTheClient,
            paymentMethodNonce: nonceFromTheClient,
            options: {
                submitForSettlement: true,
            },
        },
        (err, result) => {
            if (err) {
                return res.status(500).send(err);
            } else {
                return res.send(result);
            }
        }
    );
};
