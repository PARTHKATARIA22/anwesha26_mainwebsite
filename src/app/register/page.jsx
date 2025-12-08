"use client";

import { useState, useEffect } from "react";
import Step1 from "./Step1Email";
import Step2 from "./Step2Personal";
import Step3 from "./Step3College";
import Step4 from "./Step4Preview";
import Step5 from "./Step5Success";
import { useAuthUser } from "../../context/AuthUserContext";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [anweshaId, setAnweshaId] = useState(null);

  const { currentUser } = useAuthUser();

  useEffect(() => {
    if (!currentUser) {
    setStep(1);
    return;
}


    switch (currentUser.status) {
      case "1":
        setStep(2);
        break;
      case "2":
        setStep(3);
        break;
      case "3":
        setStep(4);
        break;
      case "successful":
        setAnweshaId(currentUser.anweshaId);
        setStep(5);
        break;
      default:
        setStep(1);
    }
  }, [currentUser]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {step === 1 && <Step1 next={() => setStep(2)} />}
      {step === 2 && <Step2 next={() => setStep(3)} />}
      {step === 3 && <Step3 next={() => setStep(4)} />}
      {step === 4 && (
        <Step4
          next={(id) => {
            setAnweshaId(id);
            setStep(5);
          }}
        />
      )}
      {step === 5 && <Step5 anweshaId={anweshaId} />}
    </div>
  );
}
