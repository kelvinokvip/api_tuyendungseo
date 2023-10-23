const TelegramBot = require("node-telegram-bot-api");

let bot;
let group_log = "-938357260";
let error_log = "-993919105";
bot = new TelegramBot("6365256732:AAEOzv1RVUojas-j0zcquY9Fwepuay50qmc", {
  polling: true,
});

async function handleGetId() {
  try {
    bot.addListener("text", async function (message) {
      if (message.text === "/getid") {
        await bot.sendMessage(
          message.from.id,
          `Your telegram Id: ${message.from.id}`
        );
        handleLogTelegram(JSON.stringify(message));
      }
    });
  } catch (error) {
    return error;
  }
}

async function handleSendMessageTelegram(telegramId, message) {
  try {
    await bot.sendMessage(telegramId, message, { parse_mode: "html" });
  } catch (error) {
    return error;
  }
}

function handleLogTelegram(message) {
  try {
    bot.sendMessage(group_log, message, { parse_mode: "html" });
  } catch (error) {
    return error;
  }
}
function handleLogError(message) {
  try {
    bot.sendMessage(error_log, message, { parse_mode: "html" });
  } catch (error) {
    return error;
  }
}
// async function handleSendMessageToAssistantsCheck(message) {
//   try {
//     let roles = await Role.findOne({ name: "Trợ lý duyệt" });
//     let userList = await userModel.find({ role: roles?._id });
//     let count = 0;
//     Promise.all(
//       userList?.map((item) => {
//         if (item?.telegram) {
//           handleSendMessageTelegram(item?.telegram, message);
//           count++;
//         }
//       })
//     );
//     return count;
//   } catch (error) {
//     console.log(error);
//   }
// }
// async function handleSendMessageToLeader(message) {
//   try {
//     let roles = await Role.findOne({ name: "Leader" });
//     let userList = await userModel.find({ role: roles?._id });
//     let count = 0;

//     Promise.all(
//       userList?.map((item) => {
//         if (item?.telegram) {
//           handleSendMessageTelegram(item?.telegram, message);
//           count++;
//         }
//       })
//     );
//     return count;
//   } catch (error) {
//     console.log(error);
//   }
// }
// async function handleSendMessageToLeaderTeam(teamid, message) {
//   try {
//     let roles = await Role.findOne({ name: "Leader" });
//     let userList = await userModel.find({ role: roles?._id, team: teamid });
//     let count = 0;

//     Promise.all(
//       userList?.map((item) => {
//         if (item?.telegram) {
//           handleSendMessageTelegram(item?.telegram, message);
//           count++;
//         }
//       })
//     );
//     return count;
//   } catch (error) {
//     console.log(error);
//   }
// }
// async function handleSendMessageToAssistantsBankCheck(message) {
//   try {
//     let roles = await Role.findOne({ name: "Trợ lý bank" });
//     let userList = await userModel.find({ role: roles?._id });
//     let count = 0;
//     handleLogTelegram(message);

//     Promise.all(
//       userList?.map((item) => {
//         if (item?.telegram) {
//           handleSendMessageTelegram(item?.telegram, message);
//           count++;
//         }
//       })
//     );
//     return count;
//   } catch (error) {
//     console.log(error);
//   }
// }
// async function handleSendMessageToSuperAdmin(message) {
//   try {
//     let roles = await Role.findOne({ name: "Super admin" });
//     let userList = await userModel.find({ role: roles?._id });
//     let count = 0;

//     Promise.all(
//       userList?.map((item) => {
//         if (item?.telegram) {
//           handleSendMessageTelegram(item?.telegram, message);
//           count++;
//         }
//       })
//     );
//     return count;
//   } catch (error) {
//     console.log(error);
//   }
// }

handleGetId();
module.exports = {
  handleSendMessageTelegram,
  //   handleSendMessageToAssistantsCheck,
  //   handleSendMessageToLeader,
  //   handleSendMessageToAssistantsBankCheck,
  //   handleSendMessageToSuperAdmin,
  //   handleSendMessageToLeaderTeam,
  //   handleLogTelegram,
};
