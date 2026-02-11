import { useEffect, useState, useRef } from "react";

const attemptId = "ATTEMPT_001";
const MAX_VIOLATIONS = 3;

export default function TestScreen() {
  const [violations, setViolations] = useState(0);
  const [warning, setWarning] = useState("");
  const [isTerminated, setIsTerminated] = useState(false);

  // Prevent multiple termination calls
  const terminatedRef = useRef(false);

  // Unified logger
  const logEvent = (eventType, metadata = {}) => {
    const event = {
      eventType,
      timestamp: new Date().toISOString(),
      attemptId,
      metadata: {
        browser: navigator.userAgent,
        ...metadata,
      },
    };

    const existingLogs =
      JSON.parse(localStorage.getItem("eventLogs")) || [];

    existingLogs.push(event);
    localStorage.setItem("eventLogs", JSON.stringify(existingLogs));
  };

  useEffect(() => {
    if (isTerminated) return;

    const handleViolation = (type) => {
      setViolations((prev) => {
        const newCount = prev + 1;

        logEvent(type, {
          focusState: "blurred",
          violationCount: newCount,
        });

        setWarning("⚠️ Tab switching is not allowed!");

        if (newCount >= MAX_VIOLATIONS && !terminatedRef.current) {
          terminatedRef.current = true;
          terminateTest();
        }

        return newCount;
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation("TAB_SWITCH_DETECTED");
      }
    };

    const handleBlur = () => {
      handleViolation("WINDOW_BLUR_DETECTED");
    };

    const handleFocus = () => {
      logEvent("FOCUS_RESTORED", { focusState: "focused" });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [isTerminated]);

  const terminateTest = () => {
    setIsTerminated(true);
    logEvent("TEST_TERMINATED", {
      reason: "MAX_VIOLATIONS_REACHED",
    });
  };

  // 🔒 TEST CLOSED SCREEN
  if (isTerminated) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          background: "#111",
          color: "#fff",
        }}
      >
        <h1>🚫 Test Closed</h1>
        <p>
          You have exceeded the maximum allowed violations.
        </p>
        <p>
          Please contact the administrator.
        </p>
      </div>
    );
  }

  // 🧪 NORMAL TEST SCREEN
  return (
    <div style={{ padding: "20px" }}>
      <h2>Secure Assessment</h2>
      <p>Violations: {violations} / {MAX_VIOLATIONS}</p>

      {warning && (
        <div style={{ color: "red", fontWeight: "bold" }}>
          {warning}
        </div>
      )}

      <p>Question: What is React?</p>
      <textarea rows="4" cols="50" />

      <br /><br />
      <button>Submit Test</button>
    </div>
  );
}