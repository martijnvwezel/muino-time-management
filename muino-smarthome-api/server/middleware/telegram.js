// #get bot info
// wget https://api.telegram.org/bot[BOT_ID]:[API_TOKEN]/getMe
// # get chatid for dfdfd_bot = 12312321
// wget https://api.telegram.org/bot[BOT_ID]:[API_TOKEN]/getUpdates
// # lala is the messenger
// wget "https://api.telegram.org/bot[BOT_ID]:[API_TOKEN]/sendMessage?chat_id=[CHAT_ID]&text=lala" 

const userCtrl = require('../controllers/user.controller');
const warningCtrl = require('../controllers/warning.controller');
// const http = require('http');
const https = require('https');
const User = require('../models/user.model');

module.exports = {
    telegram
}

async function telegram( msg) {
    console.log("telgrams send msg ");

    try {
        let users = await User.aggregate([
            {
                $match: {
                    "roles": { "$in": ["admin"] }
                }
            },
            {
                $project: {
                    "telegram": {
                        "bot_id": 1,
                        "api_token": 1,
                        "chat_id": 1,
                    }
                }
            }
        ]);




        users.forEach(elem => {


            // let user = elem.toObject().telegram;
            let user = elem.telegram;
            // console.log(user);

            let telegram_get_link = "https://api.telegram.org/bot" + user.bot_id + ":" + user.api_token + "/sendMessage?chat_id=" + user.chat_id + "&text=" + msg;

            var str = '';
            https.get(telegram_get_link, function (resq) {
                resq.setEncoding('utf8');
                resq.on('data', function (body) {
                    if (body) {
                        str += body;
                    }
                });

                resq.on('end', function () {
                    let jsonarray = JSON.parse(str)
                    if (!jsonarray.ok) {
                        console.log(str);
                    } else {
                        let status = {};
                        status.source = "Telegram"
                        status.type = jsonarray.error_code;
                        status.causedBy = "(telegram.js:47) " + jsonarray.description;
                        status.extra = " ";
                        warningCtrl.saveWarning(status);

                        console.log("(Telgram msg sended): ", msg);
                    }

                });

            }).end();


        });// end foreach


    } catch (e) {
        console.log(e);

        let status = {};
        status.source = "Telegram"
        status.type = "Warning";
        status.causedBy = "(telegram.js:96) Sending telegram to admins failed";
        status.extra = " ; ";
        warningCtrl.saveWarning(status);

    }


    return;
}