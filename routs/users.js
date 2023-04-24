const express = require('express');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const router = express.Router();

router.get('/:userID', async (req, res) => {
    try {
        const user = await User.findById(req.params.userID);
        res.json(user)
    } catch (err) {
        res.json({ message: err })
    }
})
// router.get('/followers/:userID', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.userID);
//         res.json(user.followers)
//     } catch (err) {
//         res.json({ message: err })
//     }
// })

router.post('/changePassword', async (req, res) => {

    let userId = req.body.userId;
    let currentPass = req.body.currentPass;
    let newPass = req.body.newPass;
    console.log(userId, currentPass, newPass)
    try {
        const user = await User.findById(userId);

        if (user) {
            bcrypt.compare(currentPass, user.password, async function (err, result) {
                // result == true

                if (err) {
                    console.log('login err', err)
                    res.status(500).json({ message: 'Something went wrong!' })
                    return
                }

                if (result) {
                    bcrypt.hash(newPass, saltRounds, async function (err, hash) {
                        const updatedUser = await User.updateOne(
                            { _id: user._id },
                            {
                                $set: {
                                    password: hash,
                                }
                            });
                        res.status(200).json({ message: 'password changed succesfully!' });
                    })
                } else {
                    res.status(404).json({ message: 'User Not Found!' });
                }
            });
        }


    } catch (err) {

        res.status(500).json({ message: err.message })
    }
})
router.post('/login', async (req, res) => {

    let email = req.body.email;
    let pass = req.body.password;

    try {
        const user = await User.findOne({ email });

        if (user) {
            bcrypt.compare(pass, user.password, function (err, result) {
                // result == true

                if (err) {
                    console.log('login err', err)
                    res.status(500).json({ message: 'Something went wrong!' })
                    return
                }

                if (result) {
                    res.status(200).json(user);
                } else {
                    res.status(404).json({ message: 'User Not Found!' });
                }
            });
        }

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post('/register', async (req, res) => {
    console.log('New User', req.body);

    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let phone = req.body.phone || '';
    let web_presense = [];
    let professional_info = [];
    let interests = [];
    let password = req.body.password;

    bcrypt.hash(password, saltRounds, async function (err, hash) {
        const user = new User({
            first_name: first_name,
            last_name: last_name,
            about: '',
            email: email,
            password: hash,
            phone: phone,
            web_presense: web_presense,
            professional_info: professional_info,
            interests: interests,
        });

        try {
            const savedPost = await user.save();
            console.log('Added to database..')
            res.json(savedPost)
        } catch (err) {
            console.log(err)
        }
    });
})


router.patch('/:userID', async (req, res) => {

    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let phone = req.body.phone;

    try {
        const updatedUser = await User.updateOne(
            { _id: req.params.userID },
            {
                $set: {
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    phone: phone,
                }
            });

        console.log(req.body)
        console.log("updated", updatedUser)

        res.json(updatedUser)
    } catch (err) {
        res.json({ message: err })
    }
})
router.patch('/web_presense/:userID', async (req, res) => {

    let web_presense = req.body.web_presense;

    try {
        const updatedUser = await User.updateOne(
            { _id: req.params.userID },
            {
                $set: {
                    web_presense: web_presense,
                }
            });

        console.log(req.body)
        console.log("updated", updatedUser)

        res.json(updatedUser)
    } catch (err) {
        res.json({ message: err })
    }
})
router.patch('/profInfo/:userID', async (req, res) => {

    let profInfo = req.body.profInfo;

    try {
        const updatedUser = await User.updateOne(
            { _id: req.params.userID },
            {
                $set: {
                    professional_info: profInfo,
                }
            });

        console.log(req.body)
        console.log("updated", updatedUser)

        res.json(updatedUser)
    } catch (err) {
        res.json({ message: err })
    }
})

router.patch('/about/:userID', async (req, res) => {

    try {
        const updatedUser = await User.updateOne(
            { _id: req.params.userID },
            {
                $set: {
                    about: req.body.about,
                }
            });
        console.log("updated", updatedUser)
        res.json(updatedUser)
    } catch (err) {
        console.log('err', err)
        res.json({ message: err })
    }

})
router.patch('/interests/:userID', async (req, res) => {
    console.log(req.body)
    try {
        const updatedUser = await User.updateOne(
            { _id: req.params.userID },
            {
                $set: {
                    interests: req.body.interests,
                }
            });
        console.log("updated", updatedUser)
        res.json(updatedUser)
    } catch (err) {
        console.log('err', err)
        res.status(500).json({ message: err })
    }

})

module.exports = router;