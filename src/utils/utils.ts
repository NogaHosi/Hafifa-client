import { ChangeEvent, ClipboardEvent, Dispatch, SetStateAction, KeyboardEvent } from "react";

const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, digits: string[], setDigits: Dispatch<SetStateAction<string[]>>) => {
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

const handlePaste = (event: ClipboardEvent<HTMLDivElement>, digits: string[], setDigits: { (value: SetStateAction<string[]>): void; (arg0: any[]): void; }) => {
  const pastedData = event.clipboardData.getData('Text').split('');
  const newDigits = new Array(8).fill('');

  pastedData.forEach((char, index) => {
    (index < digits.length && RegExp(/^\d$/).exec(char)) && (newDigits[index] = char);
  });

  setDigits(newDigits);
};

const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, index: number, digits: string[], setDigits: Dispatch<SetStateAction<string[]>>) => {
  const newDigits = [...digits];

  if (event.key === 'Backspace') {
    if (digits[index] === '') {
      index > 0 && (document.getElementById(`digit-${index - 1}`) as HTMLInputElement)?.focus();
      return;
    }
      newDigits[index] = '';
      setDigits(newDigits);
  }
};

const getLastDigit = async (baseUrl: string, digits: string[]) => {
  const res = await fetch(`${baseUrl}/get`, {
    method: "POST",
    body: JSON.stringify({ "first_eight": `${digits.join("")}` }),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  return (await res.json()).last_digit;
};

const handleCalculate = async (baseUrl: string, digits: string[], setLastDigit: Dispatch<SetStateAction<number | null>>) => {
  const lastDigit: number = await getLastDigit(baseUrl, digits);
  
  await fetch(`${baseUrl}/save`, {
    method: "POST",
    body: JSON.stringify({ "first_eight": `${digits.join("")}`, "last_digit": lastDigit }),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  setLastDigit(lastDigit);
};

const handleClear = (setDigits: Dispatch<SetStateAction<string[]>>, lastDigit: number | null, setLastDigit: Dispatch<SetStateAction<number | null>>) => {
  setDigits(new Array(8).fill(''));
  lastDigit && setLastDigit(null);
};

const isInputFull = (digits: string[]) => {
  return !(/^\d{8}$/.test(digits.join("")));
};

const isInputValid = (digits: string[]) => {
  return !(/^\d.*$/.test(digits.join("")));
};
  
export {
  handleChange,
  handlePaste,
  handleKeyDown,
  getLastDigit,
  handleCalculate,
  handleClear,
  isInputFull,
  isInputValid
}