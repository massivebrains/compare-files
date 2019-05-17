const Joi = require('joi');
const fs = require('fs');

module.exports = (payload) => {

    return new Promise(async (resolve, reject) => {

        try {

            let validation = Joi.validate(payload, {

                initial_path: Joi.required(),
                compare_path: Joi.required()
            });

            if (validation.error)
                return resolve({ status: false, type: 'validation', message: 'Validation Error', data: validation.error.details[0].message })

            let { initial_path, compare_path } = payload;

            if (!fs.existsSync(initial_path))
                return resolve({ status: false, type: 'validation', message: 'Initial Path is Invalid. Kindly send a valid file path.', data: initial_path });

            if (!fs.existsSync(compare_path))
                return resolve({ status: false, type: 'validation', message: 'Compare Path is Invalid. Kindly send a valid file path.', data: compare_path });

            let initial_data = fs.readFileSync(initial_path);
            let compare_data = fs.readFileSync(compare_path);

            if (Buffer.compare(initial_data, compare_data) == 0)
                return resolve({ status: true, type: 'valid-files', message: 'Contents Match.', data: payload });

            return resolve({ status: false, type: 'invalid-files', message: 'Contents Do not match.', data: payload });

        } catch (ex) {

            return reject({ status: false, message: ex, data: null });
        }
    })
}