const express = require('express');
const { addTransection, getAllTransection,editTransection,deleteTransection} = require('../controllers/transectionCtrl');

const router = express.Router();

// Add Transaction - POST Method
router.post('/add-transection', addTransection);

// Get All Transactions - POST Method
router.post('/get-transection', getAllTransection);

// Edit All Transactions - POST Method
router.post('/edit-transection', editTransection);

// Delete All Transactions - POST Method
router.post('/delete-transection', deleteTransection);

module.exports = router;
