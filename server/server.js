const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Cache-control', 'no-store');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    return next();
});

app.use(compression());
app.use(cors({
    origin: '*',
}));

app.use(bodyParser.json({
    limit: '5mb',
}));

app.use('/api/v1', require('./api'));

app.use((req, res) => {
    // each api call should return data property in locals, otherwise it will be considered as not found
    const {
        data,
        ...restProps
    } = res.locals;

    if (typeof data === 'undefined') {
        return res.status(404).send({ error: 'Api Endpoint Not Found' });
    }

    res.json({
        result: data,
        ...restProps,
    });

});


(async () => {
    const insecurePort = process.env.insecurePort || 5000;

    try {
        http.createServer(app).listen(insecurePort, () => {
            console.log('\x1b[32m', `1. Not Secure Server is running on port ${insecurePort}!\t`, '\x1b[0m');
        });

    } catch (e) {
        process.exit(1);
    }
})();


