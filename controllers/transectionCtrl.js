const transectionModel = require("../models/transectionModel");
const moment = require("moment");  // Fixed typo here

// Get All Transection Controller
const getAllTransection = async (req, res) => {
    try {
      const { frequency, userid, selectedDate,type } = req.body;
  
      const transections = await transectionModel.find({
        ...(frequency !== 'custom'
          ? {
              date: {
                $gt: moment().subtract(Number(frequency), "d").toDate(),
              },
            }
          : {
              date: {
                $gt: selectedDate[0],
                $lte: selectedDate[1],
              },
            }),
        userid,
        ...(type !== 'all' && {type}),
      });
  
      res.status(200).json(transections);
    } catch (error) {
      console.error("Error in getAllTransection API:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  
//delete transaction Controller
const deleteTransection = async (req, res) =>{
    try{
        await transectionModel.findOneAndDelete({ _id: req.body.transactionId });
        res.status(200).send("Transaction Delete");
    }catch(error){
        console.error(error);
        res.status(500).json(error);
    }
}

//edit transaction Controller
const editTransection = async (req, res) =>{
    try{
        await transectionModel.findOneAndUpdate(
          { _id: req.body.transactionId },
          req.body.payload
        );
        res.status(200).send("Edit Successfully");
    }catch(error){
        console.error(error);
        res.status(500).json(error);
    }
}

// Add Transection Controller
const addTransection = async (req, res) => {
  try {
    const newTransection = new transectionModel(req.body);
    await newTransection.save();

    res.status(201).json({
      success: true,
      message: "Transection Added Successfully",
    });
  } catch (error) {
    console.error("Error in Add Transection API:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getAllTransection, addTransection,editTransection,deleteTransection};
