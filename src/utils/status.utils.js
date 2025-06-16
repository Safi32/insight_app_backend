const User = require("../models/user.model");
const UserStatus = require("../models/userStatus.model");
const UserIncidents = require("../models/userIncidents.model");
const UserBehaviours = require("../models/userBehaviours.model");
const { getMissingFields } = require("./api.utils");

const setStatus = async (userId, status) => {
  if (getMissingFields(["userId", "status"], { userId, status })) return;

  const newLog = new UserStatus({
    timeStamp: Date.now(),
    userId: userId,
    status: status,
  });
  await newLog.save();
};


const setIncident = async (userId, incident) => {
    if (getMissingFields(["userId", "incident"], { userId, incident })) return;
    
    const newLog = new UserIncidents({
        timeStamp: Date.now(),
        userId: userId,
        incident: incident,
    });
    await newLog.save();
};

const setBehaviour = async (userId, behaviour) => {
  if (getMissingFields(["userId", "behaviour"], { userId, behaviour })) return;

  const newLog = new UserBehaviours({
    timeStamp: Date.now(),
    userId: userId,
    behaviour: behaviour,
  });
  await newLog.save();
};

module.exports = {
  setStatus,
  setIncident,
  setBehaviour,
};
