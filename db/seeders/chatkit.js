const Chatkit = require('@pusher/chatkit-server');
const chatkit = new Chatkit.default({
    instanceLocator: process.env.chatkit_instance_prefix+':'+process.env.chatkit_instance,
    key: process.env.chatkit_secret_key_id+':'+process.env.chatkit_secret_key
}) ; 


async function createUsers () {
    try
    {
        await chatkit.createUser({
          id: `User1`,
          name: 'User1'
        }) ; 
        await chatkit.createUser({
          id: `User2`,
          name: 'User2'
        }) ;
        await chatkit.createUser({
          id: `User3`,
          name: 'User3'
        }) ;
        await chatkit.createUser({
          id: `User4`,
          name: 'User4'
        }) ;
        await chatkit.createUser({
          id: `User5`,
          name: 'User5'
        }) ;
        await chatkit.createUser({
          id: `User6`,
          name: 'User6'
        }) ;
        await chatkit.createUser({
          id: `User7`,
          name: 'User7'
        }) ;
        await chatkit.createUser({
          id: `User8`,
          name: 'User8'
        }) ;
        await chatkit.createUser({
          id: `User9`,
          name: 'User9'
        }) ;
        console.log('created users');
    } catch(err){
        console.log(err);
    }
}

createUsers() ; 