// applications routes
const express = require('express');
const router = express.Router();
const contributionController = require('../controllers/ContributionController' );

router.post('/editcharacters', contributionController.addContribution);
router.post('/addcharacters', contributionController.addContribution);
router.get('/getAllPeningRecords', contributionController.getAllPeningContributions);

router.post('/deletecharacters', contributionController.addContribution);
router.get('/getAllContributions', contributionController.getAllContribution);
router.get('/getNonPendingContribution', contributionController.getNonPendingContribution);
router.put('/updateContribution/:caseId', contributionController.updateContributionStatus);

router.get('/getAllContributionsUserName/:userId', contributionController.getAllUserList);
router.get('/getContributionListById/:userId', contributionController.getAllContributionsById)

router.get('/getAddingContributionList', contributionController.getAddingContribution)

module.exports = router;