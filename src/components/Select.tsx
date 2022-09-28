import { useEffect, useState } from "react";
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
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    if (show) {
      setSelectedIdx(0);
      console.log(`setSelectedIdx(0)`);
    }
  }, [show]);

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
      const idx = options.findIndex((opt) => opt === value);

      console.log(`setValue: ${JSON.stringify(value)}, idx=${idx}`);

      onChange(value);
    }
  }

  function isOptionSelected(option: SelectOption) {
    const isSame = currValue === option;
    const isSameValue = currValue && (currValue.value === option.value &&
      currValue.name === option.name);

    if (isSame !== isSameValue) {
      console.log(
        `WHY?: isOptionSelected: isSame=${isSame}, isSameValue=${isSameValue}: ${
          JSON.stringify(option)
        } !== ${JSON.stringify(currValue)}`,
      );
    }

    return isSameValue;
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
          {options.map((opt, i) => (
            <li
              onClick={(ev) => {
                ev.stopPropagation();
                setValue(opt);
                clearShow();
              }}
              key={opt.value}
              className={`${styles.option} ${
                isOptionSelected(opt) ? styles.selected : ""
              }`}
            >
              {opt.name} ({opt.value})
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
