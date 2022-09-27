import { useState } from "react";
import styles from "./Select.module.css";

export type SelectOption = {
  name: string;
  value: string | number;
};

export type SelectOptions = SelectOption[];

export type SelectProps = {
  options: SelectOptions;
  currValue?: SelectOption;
  onChange: (newValue: SelectOption | undefined) => void;
};

export function Select({ options, currValue, onChange }: SelectProps) {
  const [show, setShow] = useState(false);

  function toggleShow() {
    setShow((s) => !s);
  }

  function clearShow() {
    setShow(false);
  }

  function clearValue() {
    onChange(undefined);
    clearShow();
  }

  function setValue(value: SelectOption) {
    if (value !== currValue) {
      onChange(value);
    }
  }

  function isOptionSelected(option: SelectOption) {
    return currValue && currValue.value === option.value && currValue.name === option.name;
  }

  const valueToShow = currValue
    ? `${currValue.name} (${currValue.value})`
    : "Nothing!";

  return (
    <>
      <div
        tabIndex={0}
        className={styles.container}
        onClick={() => toggleShow()}
        onBlur={() => clearShow()}
      >
        <span className={styles.value}>{valueToShow}</span>

        <nav className={styles.controls}>
          <button
            className={styles["btn-clear"]}
            onClick={(ev) => {
              ev.stopPropagation();
              clearValue();
            }}
          >
            &times;
          </button>
          <nav className={styles.divider}></nav>
          <nav className={styles.caret}>⏷</nav>
        </nav>

        <ul className={`${styles.options} ${show ? styles.show : ""}`}>
          {options.map((o, i) => {
            return (
              <li
                key={o.value}
                className={`${styles.option} ${
                  isOptionSelected(o) ? styles.selected : ""
                }`}
                onClick={(ev) => {
                  ev.stopPropagation();
                  setValue(o);
                  clearShow();
                }}
              >
                {o.name} ({o.value})
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
