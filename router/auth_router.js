const express = require('express');
const {clearCookies , register ,login, jwtVerify, getUserDetails, editUserDetails} = require('../controller/auth_controller_user');
const {createImage, getImage} = require('../controller/auth_controller_imageUpload')

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Server Running...');
});
router.get('/clearCookies', clearCookies);
router.post('/registerUser', register);
router.post('/loginUser', login);
router.post('/jwtVerify', jwtVerify);
router.post('/getUserDetails', getUserDetails);
router.post('/editUserDetails', editUserDetails);

router.post('/createImage', createImage);
router.post('/getImage', getImage);

module.exports = router;
