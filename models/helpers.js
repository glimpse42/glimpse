resInfo = (success, message, payload = {}) => {

    return {
        success: success,
        message: message,
        payload: payload,
        timestamp: new Date().getTime()
    };
};

// Result object for failed operations
exports.resFail = (message, payload = {}) => resInfo(false, message, payload);

// Result object for successful operations
exports.resSucc = (message, payload = {}) => resInfo(true, message, payload);