import { useState } from "react";
import "./App.css";
import { Select, SelectOption, SelectOptions } from "./components/Select";

import { Select2, Select2Option } from "./components/Select2";

function App() {
  const options: SelectOptions = [
    { name: "First", value: 1 },
    { name: "Second", value: 2 },
    { name: "Third", value: 3 },
    { name: "Last", value: 999 },
  ];

  const options2 = [
    { label: "First", value: 1 },
    { label: "Second", value: 2 },
    { label: "Third", value: 3 },
    { label: "Fourth", value: 4 },
    { label: "Fifth", value: 5 },  
  ]

  const [currValue, setCurrValue] = useState<SelectOption | undefined>(
    options[0],
  );

  const [value2, setValue2] = useState<Select2Option | undefined>(options2[0])

  let selectedText = "Nothing";
  if (currValue) {
    selectedText = `${currValue.name} = ${currValue.value}`;
  }

  let selectedText2 = "Nothing";
  if (value2) {
    selectedText2 = `${value2.label} = ${value2.value}`;
  }

  function onChange(option: SelectOption | undefined) {
    const optIdx = options.findIndex((o) => o === option);

    console.log(`App::onChange(${JSON.stringify(option)}): optIdx = ${optIdx}`);

    setCurrValue(option);
  }

  return (
    <div className="App">
      <h1>Choose...</h1>
      <h3>You have picked: {selectedText}</h3>
      <Select options={options} currValue={currValue} onChange={onChange} />

      <h1>Select 2</h1>
      <h3>You have picked: {selectedText2}</h3>

      <Select2 options={options2} value={value2} onChange={o => setValue2(o)} />

    </div>
  );
}

export default App;
