import BillDenomination from '../models/denomination.js';

export const getBillDenomination = async (req, res) => {
  try {
    const billDenominations = await BillDenomination.find();
    res.json(billDenominations);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving bill denominations', error: err });
  }
};

// API to get a bill denomination by ID
export const getBillDenominationById = async (req, res) => {
  try {
    const billDenomination = await BillDenomination.findById(req.params._id);
    res.json(billDenomination);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving bill denomination', error: err });
  }
};

// API to create a new bill denomination
export const postBillDenomination = async (req, res) => {
  try {
    const { denominations, totalCashOnhand,EnteredBy  } = req.body;
    
    const newBillDenomination = new BillDenomination({ denominations,
      totalCashOnhand,
      EnteredBy
    
    });
    await newBillDenomination.save();
    res.status(201).json(newBillDenomination);
  } catch (err) {
    res.status(500).json({ message: 'Error creating bill denomination', error: err });
  }
};
  

// API to update a bill denomination by ID
// API to update a bill denomination by ID
export const updateBillDenomination = async (req, res) => {
    try {
      const billDenominationId = req.params._id;
      const { type, quantity, total, id } = req.body;
      // Find the bill denomination by ID and update its properties
      const updatedBillDenomination = await BillDenomination.findByIdAndUpdate(
        billDenominationId,
        { type, quantity, total, id },
        { new: true }
      );
      if (!updatedBillDenomination) {
        return res.status(404).json({ message: 'Bill denomination not found' });
      }
      res.json(updatedBillDenomination);
    } catch (err) {
      res.status(500).json({ message: 'Error updating bill denomination', error: err });
    }
  };
  
// API to delete a bill denomination by ID
export const deleteBillDenomination = async (req, res) => {
    try {
      const billDenominationId = req.params._id;
      // Find the bill denomination by ID and delete it
      const deletedBillDenomination = await BillDenomination.findByIdAndDelete(billDenominationId);
      if (!deletedBillDenomination) {
        return res.status(404).json({ message: 'Bill denomination not found' });
      }
      res.json({ message: 'Bill denomination deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting bill denomination', error: err });
    }
  };
  

