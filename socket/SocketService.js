const userModel = require("../models/user.model");

const socketService = async (socket) => {
  console.log("user connected", socket.id);
  const updateSocketId = await userModel.findOneAndUpdate(
    { _id: socket.userId },
    {
      $addToSet: {
        socketId: socket.id,
      },
    },
    { new: true }
  );

  const userStatus = await userModel.findByIdAndUpdate(socket.userId, {
    online: true,
  });
  socket.on("disconnect", async () => {
    console.log("user disconnect", socket.id);
    const updateSocketId = await userModel.findOneAndUpdate(
      { _id: socket.userId },
      {
        $pull: {
          socketId: socket?.id,
        },
      },
      { new: true }
    );
    if (updateSocketId?.socketId?.length === 0) {
      const userStatus = await userModel.findByIdAndUpdate(
        socket.userId,
        { online: false },
        { new: true }
      );
    }
  });
};

module.exports = socketService;
