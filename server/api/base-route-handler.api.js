module.exports = async (req, res, next, apiHandler) => {
    try {
        apiHandler(req, res, next).catch((e) => {
            handleError(req, res, next, e);
        });
    } catch (e) {
        handleError(req, res, next, e);
    }
};

function handleError(req, res, next, e) {
    next(e);
}
