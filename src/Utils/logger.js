export const logEvent = (attemptId, eventType, metadata = {}) => {
  const event = {
    eventType,
    timestamp: new Date().toISOString(),
    attemptId,
    metadata: {
      browser: navigator.userAgent,
      ...metadata,
    },
  };

  const existingLogs = JSON.parse(sessionStorage.getItem("eventLogs")) || [];

  existingLogs.push(event);
  sessionStorage.setItem("eventLogs", JSON.stringify(existingLogs));
};
