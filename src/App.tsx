import { FC } from 'react';
import { TextField, Box, Button } from '@mui/material';
import './App.css';
import useConsts from "./utils/consts"
import { handleChange, handlePaste, handleKeyDown, handleCalculate, handleClear } from './utils/utils';

const App: FC = () => {
  const { digits, setDigits, lastDigit, setLastDigit, isInputFull, isInputValid, baseUrl } = useConsts();

  return (
    <>
      <h1>What is my 9th digit?</h1>
      <Box className="top">
        {digits.map((digit, index) => (
          <TextField
            className="input-box"
            key={index}
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
          disabled={isInputFull}
          onClick={() => handleCalculate(baseUrl, digits, setLastDigit)}
          sx={{backgroundColor: "#4d030f", color: "#fcdbe0"}}
        >
          Calculate
        </Button>
        <Button
          id="clear-btn"
          variant="outlined"
          disabled={isInputValid}
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