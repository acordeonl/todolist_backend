var {db}  = require('../db/models');
var bcrypt = require('bcryptjs') ;

function getUsernameAndNumber(str){
    for(let i = str.length-1 ; i >= 0 ; i -- ){
        if(str.charAt(i) >= '0' && str.charAt(i) <= '9')
            continue ; 
        let number = parseInt(str.slice(i+1))  ; 
        number = isNaN(number) ? 0 : number ; 
        return {
            name:str.slice(0,i+1),
            number
        }; 
    }
}
    
module.exports = async (obj) => {
    // save user on database with hash on password field
    if(obj.password)
        obj.password = bcrypt.hashSync(obj.password, bcrypt.genSaltSync(10) ) ; 
    let {name:username} = getUsernameAndNumber(obj.email.substring(0, obj.email.lastIndexOf("@")));
    let users = await db.users.findAll({
        where:{ username: { [db.Sequelize.Op.iLike]: username + '%' } }
    }) ;
    obj.username = username ; 
    users = users.map ( user => getUsernameAndNumber(user.username) ) ; 
    users.sort( ( a , b ) => a.number-b.number )  ;
    if(users.length > 0)
        obj.username += users[users.length-1].number+1 ; 
    let user = await db.users.create(obj) ;
    return user ; 
};
