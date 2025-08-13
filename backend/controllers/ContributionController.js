const Contribution = require('../models/contribution');
const User = require('../models/user');

exports.addContribution = async (req, res) => {
    try {
        const count = await Contribution.countDocuments();
        const newContributionId = String(count + 1)
        const newContribution = new Contribution({
            ...req.body,
            contribution_id: newContributionId
        });
        await newContribution.save();
        res.status(201).send("Contribution has been added successfully");
    } catch (error) {
        console.error("Failed to add contribution", error);
        res.status(500).send("Error adding contribution:" + error.message);
    }
};

exports.getAllContribution = async (req, res) => {
    try {
        const allChangeCase = await Contribution.find({});
        res.status(200).json(allChangeCase);
    }catch (error) {
        console.error("Failed to retrieve all contributions", error);
        res.status(500).json({ message: "Error retrieving all contributions: " + error.message });
    }
};

exports.getAllContributionsById = async (req, res) => {
    try {
        const { userId } = req.params;
        const allContribution = await Contribution.find({$or: [
                { "user_id._id": userId },
                { "reviewed_by._id": userId }
            ]});
        res.status(200).json(allContribution);
    }catch (error) {
        console.error("Error when getting contributions of the user:", error);
        res.status(500).json({ message: "Error getting contributions of the user: " + error.message });
    }
};

exports.getAddingContribution = async (req, res) => {
    try {
        const allApprovedContributions = await Contribution.find({ action: "AddCharacter", status: "Approved" });
        res.status(200).json(allApprovedContributions);
    } catch (error) {
        console.error("Error retrieving pending contributions:", error);
        res.status(500).json({ message: "Error retrieving non-pending contributions: " + error.message });
    }
};

exports.updateContributionStatus = async (req, res) => {
    try {
        const {caseId} = req.params;
        const { newStatus, operatorId } = req.body;
        const updatedContribution = await Contribution.findOneAndUpdate({ _id: caseId }, { $set: { status: newStatus, reviewed_by: { _id: operatorId }} }, { new: true });
        console.log(updatedContribution);
        res.status(200).json(updatedContribution);

    } catch (error) {
        console.error("Error when update pending contributions:", error);
        res.status(500).json({ message: "Error retrieving non-pending contributions: " + error.message });
    }
};

exports.getAllUserList = async(req, res) => {
    try {
        const { userId } = req.params;
        const currentUser = await User.findOne({_id: userId});
        res.status(200).json(currentUser);
    }catch (error) {
        console.error("Failed to find specific user", error);
        res.status(500).json({ message: "Error retrieving user: " + error.message });
    }
}

exports.getAllPeningContributions = async (req, res) =>{
    try {
        const allPendingContributions = await Contribution.find({ status: "Pending" });
        res.status(200).json(allPendingContributions);
    } catch (error) {
        console.error("Error retrieving pending contributions:", error);
        res.status(500).json({ message: "Error retrieving non-pending contributions: " + error.message });
    }
};

// get the handled application history
exports.getNonPendingContribution = async (req, res) => {
    try {
        const nonPendingContributions = await Contribution.find({ status: { $ne: "Pending" } });
        res.status(200).json(nonPendingContributions);
    } catch (error) {
        console.error("Error retrieving non-pending contributions:", error);
        res.status(500).json({ message: "Error retrieving non-pending contributions: " + error.message });
    }
};