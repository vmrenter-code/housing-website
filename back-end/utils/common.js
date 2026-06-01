/* --- Helper Funtions --- */
function serverError(err, res) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
}

function error(res, code, m) {
    return res.status(code).json({ message: m });
}

module.exports = {
    serverError,
    userError
};