const userService = require('../services/user');
const jwt = require('jsonwebtoken');

const {userDataValidation} = require('../middleware/validation');

class UserController {
    /**
     * @description function written to register user
     * @param {*} A valid req is expected
     * @param {*} res
     */
    async registrationApi(req, res) {
        let dataValidation = userDataValidation.validate(req.body);
        if (dataValidation.error) {
            return res.status(400).send({
                message: dataValidation.error.details[0].message
            });
        }

        const userData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        }

        await userService.createUserInfo(userData, (error, data) => {
            return ((error) ? res.status(500).send({success: false, message: "Some error occurred while registering user" }) : res.send({success: true, message: "User registered!", data: data}));
        });
    }

    /**
    * @description this function handles the login API
    * @param {*} req 
    * @param {*} res 
    * @returns 
    */
    loginApi(req, res) {
        const userData = {
            email: req.body.email,
            password: req.body.password
        }

        userService.loginUser(userData, (error, token) => {
            return ((error) ? res.status(500).send({message: error}) : res.send({success: true, message: "User login successful!", token: token}));
        })
    }

    /**
    * @description this function handles the forgot password api to send link to user for resetting password
    * @param {*} req 
    * @param {*} res 
    * @returns 
    */
    forgotPasswordApi(req, res) {
        const userData = {
            email: req.body.email
        }

        console.log("Controller Data: ", userData)
        userService.forgotPassword(userData, (error, data) => {
            return ((error) ? res.status(500).send({message: error}) : res.send({success: true, message: "Password reset link Sent to your email successfully!"}));
        })
    }
    
    /**
    * @description this function handles reset password api where user can update his password into database
    * @param {*} req 
    * @param {*} res 
    * @returns 
    */
    passwordResetApi(req, res) {
        const userPassword = {
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        }

        const userToken = req.headers.token;
        if(userPassword.password == userPassword.confirmPassword) {
            userService.resetPassword(userPassword, userToken, (error, data) => {
                return ((error) ? res.status(500).send({message: error}) : res.send({success: true, message: "Password is changed successfully!"}));
            })
        }else {
            return res.status(500).send({message: "Please enter same password in both password and confirmPassword fields"});
        }
    }
}

//exporting th whole class to utilize or call function created in this class
module.exports = new UserController();