'use strict';

const db = require('./database');
const Sequelize = require('sequelize');

// Make sure you have `postgres` running!

//---------VVVV---------  your code below  ---------VVV----------

const Task = db.define('Task', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  complete: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  due: Sequelize.DATE
});


Task.belongsTo(Task, {as: 'parent'});

Task.clearCompleted = async()=>{
  await Task.destroy({where: {complete:true} })
}

Task.completeAll = async()=>{
  await Task.update({complete:true}, {where: {complete:false}})
}

Task.prototype.getTimeRemaining = function(){
  
  let diff=Infinity;
  const today = new Date();
  
  if (this.due){
    diff=(this.due - today) ;
  }
 
  return diff;
}
Task.prototype.isOverdue = function(){
  const today =new Date();
  let flag=false;
   
    if ((this.due < today) && (this.complete===true)){
      return false;
    }
    else if (this.due < today){
      return true;
    }
    else if(this.due > today){
      flag=false;
    }

    return flag;
}





Task.prototype.addChild =  async function(child){
    return await Task.create({name:child.name,parentId:this.id});
    
}

Task.prototype.getChildren =  async function(){
  return Task.findAll({where : {parentId: this.id }})
}

Task.prototype.getSiblings =  async function(){
 const siblingsplusOne= await Task.findAll({where:{parentId: this.parentId}})

 const siblings =siblingsplusOne.filter(sibling=>sibling.id!=this.id)
  
  return siblings
}

//---------^^^---------  your code above  ---------^^^----------

module.exports = Task;

