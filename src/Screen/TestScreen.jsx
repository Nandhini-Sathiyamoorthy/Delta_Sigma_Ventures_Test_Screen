import { useState } from "react";
import useTestEnforcement from "../Hooks/useTestEnforcement";
import { logEvent } from "../Utils/logger";
import TestContent from "./TestContent";
import TerminatedScreen from "./TerminatedScreen";

const attemptId = "ATTEMPT_001";
const MAX_VIOLATIONS = 3;

export default function TestScreen() {
  const [violations, setViolations] = useState(0);
  const [warning, setWarning] = useState("");
  const [isTerminated, setIsTerminated] = useState(false);

  const terminateTest = () => {
    setIsTerminated(true);
    logEvent(attemptId, "TEST_TERMINATED", {
      reason: "MAX_VIOLATIONS_REACHED",
    });
  };

  useTestEnforcement({
    attemptId,
    maxViolations: MAX_VIOLATIONS,
    setViolations,
    setWarning,
    terminateTest,
    isTerminated,
  });

  if (isTerminated) {
    return <TerminatedScreen />;
  }

  return (
    <TestContent
      violations={violations}
      maxViolations={MAX_VIOLATIONS}
      warning={warning}
    />
  );
}
