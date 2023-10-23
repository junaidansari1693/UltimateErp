const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { query, validationResult, body } = require('express-validator');
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = "ThisPassword";

//ROUTE 1 : Create a user using : POST "localhost:5000/api/auth"  Doesn't require auth
router.post('/createUser', [
    body('firstname', 'Enter valid name').isLength({ min: 3 }),
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Enter strong password at 5 char').isLength({ min: 5 })
], async (req, res) => {
    let success = false;
    //If there r errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    //check whether user with same email exists

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({success,
                error: "Sorry a user with this email already exists"
            })
        }
        //securing password for login
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            firstname: req.body.firstname,
            email: req.body.email,
            password: secPass, 
            Branch : req.body.Branch,
            typeUser: req.body.typeUser ,
            AdmissionYear:req.body.AdmissionYear || '',
        })

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);

        //res.send(user);
        success = true;
        res.json({success, authToken });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("internal server error occured");
    }
})


// ROUTE 2 :Authenticate a user using : POST "/api/auth/login" . No login required

router.post('/login', [
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    let success = false;
    //If there r errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }

    const { email, password } = req.body;
    
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: "Please try to login with correct credentials" })
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success,error: "Please try to login with correct credentials" })
        }
        //console.log(user);
        const data = {
            user: {
                id: user.id
            }
        }
        let typeUser = user.typeUser;
      
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken, typeUser });


    } catch (error) {
        console.log(error.message);
        res.status(500).send("internal server error occured");
    }
})


// ROUTE 3 :Get Loggedin  user details using : POST "/api/auth/getuser" . login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("internal server error occured");
    }
})

module.exports = router;