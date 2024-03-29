
const Users = require('../models/User')
const Question = require('../models/Question');

module.exports = async (req, res) => {

    // Update the User's Statistics
    console.log("Updating the User's Statistics")
    const thisUser = await Users.findById(loggedIn)
    const newAsked = thisUser.asked + 1
    const newRank = thisUser.rank + 1
    console.log(newAsked)
    await Users.updateOne({ username : thisUser.username}, {$set : {asked : newAsked, rank : newRank}})

    // Update the Question Database
    //let bodyPlainText = req.body.body.replace(/<\/?[^>]+(>|$)/g, "");  // MAY BE DELETED IN FUTURE
    //bodyPlainText = bodyPlainText.replace(/&(nbsp|amp|quot|lt|gt);/g," ");  // MAY BE DELETED IN FUTURE
    Question.create({title: req.body.title, keyword1: req.body.keyword1, body: req.body.body, userid: req.session.userId, answers:[]}, (error, user) =>{
      console.log("Inside Question.create")
      if(error){
        console.log(error)
        const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message)          
        req.flash('validationErrors',validationErrors)
        req.flash('data',req.body)
        return res.redirect('/posts/new')    
      }        
      res.redirect('/')
  })
 }
