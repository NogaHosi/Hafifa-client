import { useState } from "react";

const useConsts = () => {
  const [digits, setDigits] = useState<string[]>(new Array(8).fill(''));
  const [lastDigit, setLastDigit] = useState<number | null>(null);
  const isInputFull: boolean = !(/^\d{8}$/.test(digits.join("")));
  const isInputValid: boolean = !(/^\d.*$/.test(digits.join("")));
  const baseUrl: string = "http://localhost:3000";

  return {
    digits,
    setDigits,
    lastDigit,
    setLastDigit,
    isInputFull,
    baseUrl,
    isInputValid
  };
};

export default useConsts;
