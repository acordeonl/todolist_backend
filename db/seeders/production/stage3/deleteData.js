var { db } = require('../../../../db/models');
const Chatkit = require('@pusher/chatkit-server');
const chatkit = new Chatkit.default({
    instanceLocator: process.env.chatkit_instance_prefix + ':' + process.env.chatkit_instance,
    key: process.env.chatkit_secret_key_id + ':' + process.env.chatkit_secret_key
});

async function clearChatkit() {
    let rooms = await chatkit.getRooms({ includePrivate: true });
    rooms.forEach(async room => {
        await chatkit.deleteRoom({
            id: room.id
        });
    });
    let users = await chatkit.getUsers();
    await Promise.all ( users.map( user => chatkit.deleteUser({ userId: user.id })) ) ;
}

async function clearData () {
    await clearChatkit() ; 
    let res =await db.users.destroy({
        where: {}
    });
    process.exit() ;
}

clearData();
