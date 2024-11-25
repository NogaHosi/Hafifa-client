import { FC, useState } from 'react';
import { TextField, Box, Button } from '@mui/material';
import './App.css';
import BASE_URL from "./utils/consts"
import { handleChange, handlePaste, handleKeyDown, handleCalculate, handleClear, isInputFull, isInputValid } from './utils/utils';

const App: FC = () => {
  const [digits, setDigits] = useState<string[]>(new Array(8).fill(''));
  const [lastDigit, setLastDigit] = useState<number | null>(null);

  return (
    <>
      <h1>What is my 9th digit?</h1>
      <Box className="top">
        {digits.map((digit, index) => (
          <TextField
            className="input-box"
            key={`digit-${index}`}
            id={`digit-${index}`}
            value={digit}
            onChange={(e) => handleChange(e, index, digits, setDigits)}
            onPaste={(e) => handlePaste(e, digits, setDigits)}
            onKeyDown={(e) => handleKeyDown(e, index, digits, setDigits)}
          />
        ))}
      </Box>
      <div className="card">
        <Button
          id="calculate-btn"
          variant="contained"
          disabled={isInputFull(digits)}
          onClick={() => handleCalculate(BASE_URL, digits, setLastDigit)}
          sx={{backgroundColor: "#4d030f", color: "#fcdbe0"}}
        >
          Calculate
        </Button>
        <Button
          id="clear-btn"
          variant="outlined"
          disabled={isInputValid(digits)}
          onClick={() => handleClear(setDigits, lastDigit, setLastDigit)}
          sx={{color: "#4d030f", borderColor: "#4d030f"}}
        >
          Clear
        </Button>
      </div>
      {lastDigit !== null && (
        <div id="last-digit-text">{`Your last digit is ${lastDigit}`}</div>
      )}
    </>
  );
};

export default App;