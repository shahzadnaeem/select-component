import { useState } from 'react'
import './App.css'
import { Select, SelectOption, SelectOptions } from './components/Select'

function App() {

  const options:SelectOptions = [
    { name: "First", value: 1 },
    { name: "Second", value: 2 },
    { name: "Third", value: 3 },
    { name: "Last", value: 999 }
  ]

  let [currValue, setCurrValue] = useState<SelectOption|undefined>(options[0])

  let selectedText = "Nothing";
  if (currValue) {
    selectedText = `${currValue.name} = ${currValue.value}`
  }

  return (
    <div className="App">
      <h1>Choose...</h1>
        <h3>You have picked: {selectedText}</h3>
      <Select options={options} currValue={currValue} onChange={o => setCurrValue(o)}></Select>
    </div>
  )
}

export default App
