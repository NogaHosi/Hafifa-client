import { useState } from 'react';
import { TextField, Box, Button } from '@mui/material';
import './App.css';

const App: React.FC = () => {
  const [digits, setDigits] = useState<string[]>(new Array(8).fill(''));
  const [lastDigit, setLastDigit] = useState<number | null>(null); 

  const baseUrl: string = "http://localhost:3000";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const newDigits = [...digits];
    const input = event.target.value;

    if (input.match(/^\d$/)) {
      newDigits[index] = input;
      setDigits(newDigits);

      if (input && index < digits.length - 1) {
        const nextInput = document.getElementById(`digit-${index + 1}`) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      }
    } else {
      event.preventDefault();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = event.clipboardData.getData('Text').split('');
    const newDigits = [...digits];

    pastedData.forEach((char, i) => {
      (i < digits.length && char.match(/^\d$/)) && (newDigits[i] = char);
    });

    setDigits(newDigits);
    event.preventDefault();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    const newDigits = [...digits];
    if (event.key === 'Backspace') {
      if (digits[index] === '') {
        if (index > 0) {
          const prevInput = document.getElementById(`digit-${index - 1}`) as HTMLInputElement;
          if (prevInput) {
            prevInput.focus();
          }
        }
      } else {
        newDigits[index] = '';
        setDigits(newDigits);
      }
    }
  };

  const getLastDigit = async () => {
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

  const handleClick = async () => {
    await fetch(`${baseUrl}/save`, {
      method: "POST",
      body: JSON.stringify({ "first8": `${digits.join("")}` }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    setLastDigit(await getLastDigit());
  };

  return (
    <>
      <h1>What is my 9th digit?</h1>
      <Box display="flex" justifyContent="center" alignItems="center" width="100%">
        {digits.map((digit, index) => (
          <TextField
            key={index}
            id={`digit-${index}`}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onPaste={handlePaste}
            onKeyDown={(e) => handleKeyDown(e, index)}
            sx={{ margin: '0 8px', width: '40px' }}
          />
        ))}
      </Box>
      <div className="card">
        <Button
          variant="contained"
          disabled={!(/^[0-9]{8}$/.test(digits.join("")))}
          sx={{ padding: "10px", fontWeight: "bold", backgroundColor: "#4d030f", color: "#fcdbe0" }}
          onClick={handleClick}
        >
          Calculate
        </Button>
      </div>
      {lastDigit !== null && (
        <div id="last-digit-text">{`Your last digit is ${lastDigit}`}</div>
      )}
    </>
  );
};

export default App;
