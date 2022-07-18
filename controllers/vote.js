const Users = require('../models/User')
const Questions = require('../models/Question');

module.exports = async (req, res) => {

    console.log("Inside Vote!")
    console.log("loggedIn: " + loggedIn)
    console.log(req.body)

    var revisedScore;

    if (req.body.action == "upvoteQuestion") {
        console.log("Inside upvoteQuestion")
        const thisQuestion = await Questions.findById(req.body.questionID);
        revisedScore = thisQuestion.upvotes;
        revisedScore++;
        await Questions.updateOne({ _id : thisQuestion._id}, {$set : {upvotes : revisedScore}})   
        
        // Update User's Statistics
        const relevantUserID = thisQuestion.userid;
        const relevantUser = await Users.findById(relevantUserID);
        askedScore = relevantUser.askedscore;
        askedScore++;
        await Users.updateOne({ _id : relevantUser }, {$set : {askedscore : askedScore}})

    }

    if (req.body.action == "downvoteQuestion") {
        console.log("Inside downvoteQuestion")
        const thisQuestion = await Questions.findById(req.body.questionID);
        revisedScore = thisQuestion.upvotes;
        revisedScore--;
        await Questions.updateOne({ _id : thisQuestion._id}, {$set : {upvotes : revisedScore}})    

        // Update User's Statistics
        const relevantUserID = thisQuestion.userid;
        const relevantUser = await Users.findById(relevantUserID);
        askedScore = relevantUser.askedscore;
        askedScore--;
        await Users.updateOne({ _id : relevantUser }, {$set : {askedscore : askedScore}})

        // Notify the Individual Who Posted the Question
        console.log("Start to notify poster")
        const userWhoPostedQuestion = await Users.findOne({_id : relevantUserID})
        console.log("found userWhoPostedQuestion")
        const user_email = userWhoPostedQuestion.email
        var nodemailer = require('nodemailer');

        var transporter = nodemailer.createTransport({
            service: 'Outlook365',
            auth: {
                user: 'admin',
                pass: 'Kerensky312'
            }
        });

        var mailOptions = {
            from: 'admin@thetaxgaap.com',
            to: user_email,
            subject: 'TheTaxGaap : Someone Downvoted Your Question.',
            text: 'You should check the site at www.thetaxgaap.com.  ' + relevantUser.username + ' just downvited your question.  This is their rationale. ' + req.body.rationale
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
    
    // Upvote Answer
    if (req.body.action == "upvoteAnswer") {
        console.log("Inside upvoteAnswer")
        const thisQuestion = await Questions.findById(req.body.questionID);
        console.log("After thisQuestion")
        const arrayIndex = req.body.index;
        revisedScore = thisQuestion.answers[arrayIndex].upvotes;
        console.log(revisedScore);
        revisedScore++;
        thisQuestion.answers[arrayIndex].upvotes = revisedScore;
        console.log("After update answer")
        await thisQuestion.save(function (err) {
            console.log(err)
        })      
        
        // Upgrade User's Stats
        console.log("Upgrade User's Stats")
        const respondentID = thisQuestion.answers[arrayIndex].respondentID;
        console.log("RespondentID: " + respondentID)
        const thisRespondent = await Users.findById(respondentID);
        console.log("Update answerscore")
        var currentAnswerScore = thisRespondent.answerscore;
        currentAnswerScore++;
        
        console.log("Update rank")
        var respondentRank = thisRespondent.rank;
        respondentRank++;
        await Users.updateOne({ _id : respondentID}, {$set : {answerscore : currentAnswerScore, rank : respondentRank}});

        // Notify the Individual Who Posted the Answer
        try {
            console.log("Start to notify respondent")
            const user_email = thisRespondent.email
            var nodemailer = require('nodemailer');

            var transporter = nodemailer.createTransport({
                service: 'Outlook365',
                auth: {
                    user: 'admin',
                    pass: 'Kerensky312'
                }
            });

            var mailOptions = {
                from: 'admin@thetaxgaap.com',
                to: user_email,
                subject: 'TheTaxGaap : Someone Downvoted Your Answer',
                text: 'You should check the site at www.thetaxgaap.com.  ' + thisRespondent.username + ' just downvited your question.  This is their rationale. ' + req.body.rationale
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        } catch {

            console.log("WARNING: Email was not sent on downvote.")

        }
    }

    // Downvote Answer
    if (req.body.action == "downvoteAnswer") {
        console.log("Inside downvoteAnswer")
        const thisQuestion = await Questions.findById(req.body.questionID);
        console.log("After thisQuestion")
        const arrayIndex = req.body.index;
        revisedScore = thisQuestion.answers[arrayIndex].upvotes;
        console.log(revisedScore);
        revisedScore--;
        thisQuestion.answers[arrayIndex].upvotes = revisedScore;
        console.log("After update answer")
        await thisQuestion.save(function (err) {
            console.log(err)
        })              
        
        // Downgrade User's Stats
        console.log("Downgrade User's Stats")
        const respondentID = thisQuestion.answers[arrayIndex].respondentID;
        console.log("RespondentID: " + respondentID)
        const thisRespondent = await Users.findById(respondentID);
        console.log("Update answerscore")
        var currentAnswerScore = thisRespondent.answerscore;
        currentAnswerScore--;
        console.log("Update rank")
        var respondentRank = thisRespondent.rank;
        respondentRank--;
        await Users.updateOne({ _id : respondentID}, {$set : {answerscore : currentAnswerScore, rank : respondentRank}});

        // Notify the Individual Who Posted the Answer
        try {
            console.log("Start to notify respondent")
            const user_email = thisRespondent.email
            var nodemailer = require('nodemailer');

            var transporter = nodemailer.createTransport({
                service: 'Outlook365',
                auth: {
                    user: 'admin',
                    pass: 'Kerensky312'
                }
            });

            var mailOptions = {
                from: 'admin@thetaxgaap.com',
                to: user_email,
                subject: 'TheTaxGaap : Someone Downvoted Your Answer',
                text: 'You should check the site at www.thetaxgaap.com.  ' + thisRespondent.username + ' just downvited your question.  This is their rationale. ' + req.body.rationale
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        } catch {

            console.log("WARNING: Email was not sent on downvote.")

        }


        

    }


    console.log("Revised Score: " + revisedScore);

    res.json({"revisedScore" : revisedScore});
}