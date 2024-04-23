import { NotificationCenter } from "@novu/notification-center";
import dynamic from "next/dynamic";
import React, { useCallback } from "react";

const Notifications = () => {
  const onNotificationClick = useCallback((notification) => {
    if (notification?.cta?.data?.url) {
      window.location.href = notification.cta.data.url;
    }
  }, []);

  return (
    <div>
      <NotificationCenter
        colorScheme="dark"
        onNotificationClick={onNotificationClick}
      />
    </div>
  );
};

export default dynamic(() => Promise.resolve(Notifications), {
  ssr: false,
});
