import { ChangeEvent, ClipboardEvent, Dispatch } from "react";

const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, digits: string[], setDigits: Dispatch<React.SetStateAction<string[]>>) => {
  const newDigits = [...digits];
  const input = event.target.value;

  if (RegExp(/^\d$/).exec(input)) {
    newDigits[index] = input;
    setDigits(newDigits);

    if (input && index < digits.length - 1) {
      (document.getElementById(`digit-${index + 1}`) as HTMLInputElement)?.focus();
    }
  }
};

const handlePaste = (event: ClipboardEvent<HTMLDivElement>, digits: string[], setDigits: Dispatch<React.SetStateAction<string[]>>) => {
  const pastedData = event.clipboardData.getData('Text').split('');
  const newDigits = new Array(8).fill('');

  pastedData.forEach((char, i) => {
    (i < digits.length && RegExp(/^\d$/).exec(char)) && (newDigits[i] = char);
  });

  setDigits(newDigits);
};

const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, index: number, digits: string[], setDigits: Dispatch<React.SetStateAction<string[]>>) => {
  const newDigits = [...digits];

  if (event.key === 'Backspace') {
    if (digits[index] === '') {
      index > 0 && (document.getElementById(`digit-${index - 1}`) as HTMLInputElement)?.focus();
    } else {
      newDigits[index] = '';
      setDigits(newDigits);
    }
  }
};

const getLastDigit = async (baseUrl: string, digits: string[]) => {
  const res = await fetch(`${baseUrl}/get`, {
    method: "POST",
    body: JSON.stringify({ "first8": `${digits.join("")}` }),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  return (await res.json()).lastDigit;
};

const handleCalculate = async (baseUrl: string, digits: string[], setLastDigit: React.Dispatch<React.SetStateAction<number | null>>) => {
  const lastDigit: number = await getLastDigit(baseUrl, digits);
  
  await fetch(`${baseUrl}/save`, {
    method: "POST",
    body: JSON.stringify({ "first8": `${digits.join("")}`, "lastDigit": lastDigit }),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  setLastDigit(lastDigit);
};

const handleClear = (setDigits: Dispatch<React.SetStateAction<string[]>>, lastDigit: number | null, setLastDigit: React.Dispatch<React.SetStateAction<number | null>>) => {
  setDigits(new Array(8).fill(''));
  lastDigit !== null && setLastDigit(null);
}
  
export {
  handleChange,
  handlePaste,
  handleKeyDown,
  getLastDigit,
  handleCalculate,
  handleClear
}