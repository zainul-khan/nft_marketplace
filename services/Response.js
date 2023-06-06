module.exports = {

    successResponseData(res, message, data, extras, code = 200) {
        const response = {
            message: message,
            data,
        }

        // if (extras) {
        //     Object.keys(extras).forEach((key) => {
        //         if ({}.hasOwnProperty.call(extras, key)) {
        //             response[key] = extras[key]
        //         }
        //     })
        // }

        if (extras) {
            Object.assign(response, extras)
        }

        return res.status(code).json(response)
    },

    successResponseWithoutData(res, message, code = 200) {
        const response = {
            code,
            message: message,
        }
        return res.status(code).json(response)
    },

    errorResponseWithoutData(res, message, code = 400) {
        const response = {
            error: message,
        }
        return res.status(code).send(response)
    },

    errorResponseData(res ,data, message, code = 400) {
        const response = {
            data,
            error: message
        }
        return res.status(code).send(response)
    },

    joiErrorResponseData(res, err, code = 400){
        let error = {}
        if (err.name == 'ValidationError' && err.isJoi) {
            error.error_message = err.message.replace(/"/g, "");
        }
        const response = {
            code,
            error: error.error_message
        }
        return res.status(code).json(response);
    },

    validationErrorResponseData(res, message, code = 422) {
        const response = {
            message: message
        }
        return res.status(code).send(response)
    },
}