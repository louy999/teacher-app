import React from "react";
import { RiNotificationFill } from "react-icons/ri";

const NotificationsClient = ({ userRole }) => {
  console.log(userRole);

  return <RiNotificationFill size={25} className="cursor-pointer" />;
};

export default NotificationsClient;
