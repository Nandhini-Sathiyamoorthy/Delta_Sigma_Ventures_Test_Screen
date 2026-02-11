import { useEffect, useRef } from "react";
import { logEvent } from "../Utils/logger";

export default function useTestEnforcement({
  attemptId,
  maxViolations,
  setViolations,
  setWarning,
  terminateTest,
  isTerminated,
}) {
  const terminatedRef = useRef(false);

  useEffect(() => {
    if (isTerminated) return;

    const handleViolation = (type) => {
      setViolations((prev) => {
        const newCount = prev + 1;

        logEvent(attemptId, type, {
          focusState: "blurred",
          violationCount: newCount,
        });

        setWarning("⚠️ Tab switching is not allowed!");

        if (newCount >= maxViolations && !terminatedRef.current) {
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
      logEvent(attemptId, "FOCUS_RESTORED", {
        focusState: "focused",
      });
    };
    const handleCopy = (e) => {
      e.preventDefault();
      handleViolation("COPY_ATTEMPT");
    };

    const handlePaste = (e) => {
      e.preventDefault();
      handleViolation("PASTE_ATTEMPT");
    };

    const handleCut = (e) => {
      e.preventDefault();
      handleViolation("CUT_ATTEMPT");
    };

    const handleRightClick = (e) => {
      e.preventDefault();
      handleViolation("RIGHT_CLICK_ATTEMPT");
    };
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
        e.preventDefault();
        handleViolation("CTRL_C_ATTEMPT");
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
        e.preventDefault();
        handleViolation("CTRL_V_ATTEMPT");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("cut", handleCut);
    document.addEventListener("contextmenu", handleRightClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);

      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("contextmenu", handleRightClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isTerminated]);
}
