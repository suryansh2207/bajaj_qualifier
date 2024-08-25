import axios from "axios";
import { useState } from "react";
import "./App.css";

function App() {
  const [result, setResult] = useState({});
  const [label, setLabel] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let input = e.target[0].value;
    input = normalizeQuotes(input);

    if (!validateJson(input)) {
      alert("Invalid JSON format");
      return;
    }

    try {
      const response = await axios.post('https://bfhl-code.onrender.com/bfhl', { data: JSON.parse(input).data });
      const responseData = response.data;

      setResult(responseData);
      setDropdownOptions(['Alphabets', 'Numbers', 'Highest Lowercase Alphabet']);
    } catch (err) {
      alert("Error submitting data");
    }
  };

  const normalizeQuotes = (input) => {
    return input.replace(/“|”/g, '"');
  };

  const validateJson = (input) => {
    try {
      const parsedInput = JSON.parse(input);
      if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
        throw new Error("Invalid format: 'data' field missing or not an array");
      }
      setLabel("");
      return true;
    } catch (e) {
      setLabel("Invalid JSON format: 'data' field is required and must be an array");
      return false;
    }
  };

  const handleDropdownChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedOptions(selected);
  };

  const renderResponse = () => {
    if (Object.keys(result).length === 0) return "Waiting...";

    let output = [];

    if (selectedOptions.includes("Numbers")) {
      output = [...output, ...result.numbers];
    }

    if (selectedOptions.includes("Alphabets")) {
      output = [...output, ...result.alphabets];
    }

    if (selectedOptions.includes("Highest Lowercase Alphabet")) {
      output = [...output, ...result.highest_lowercase_alphabet];
    }

    return output.join(", ");
  };

  return (
    <div className="container">
      <h1 className="title">BAJAJ QUALIFIER</h1>
      <form onSubmit={handleSubmit} className="form">
        <input type="text" placeholder="Enter the Input" className="input-field" />
        <button type="submit" className="submit-button">Submit</button>
      </form>

      <div className="label">
        <h7>{label ? label : ""}</h7>
      </div>

      <br />

      {dropdownOptions.length > 0 && (
        <div className="dropdown">
          <label>Select Data to Display:</label>
          <br />
          <select multiple={true} onChange={handleDropdownChange} className="select-box">
            {dropdownOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="output">
        <h7>Output:</h7>
        <pre>{renderResponse()}</pre>
      </div>
    </div>
  );
}

export default App;
