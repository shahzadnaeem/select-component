import { useEffect, useRef, useState } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show) {
      setSelectedIdx(options.findIndex((opt) => opt === currValue) || 0);
    }
  }, [show]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.code === "Tab") && !show) return;

      e.preventDefault();

      if (e.target != containerRef.current) return;
      switch (e.code) {
        case "Enter":
        case "Space":
          if (show) {
            setValue(options[selectedIdx]);
          }
          toggleShow();
          break;

        case "Tab":
        case "ArrowUp":
        case "ArrowDown": {
          if (!show) {
            setShow(true);
            break;
          }

          let newValue = selectedIdx +
            (((e.code === "ArrowDown") || e.code == "Tab") ? 1 : -1);
          if (newValue < 0) newValue = options.length - 1;
          else if (newValue >= options.length) newValue = 0;

          setSelectedIdx(newValue);
          break;
        }

        case "KeyX":
          clearValue();
          break;

        case "Escape":
          clearShow();
          break;
      }
    };
    containerRef.current?.addEventListener("keydown", handler);

    return () => {
      containerRef.current?.removeEventListener("keydown", handler);
    };
  }, [show, selectedIdx, options]);

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

      onChange(value);
    }
  }

  function isOptionSelected(option: SelectOption) {
    return currValue === option;
  }

  const valueToShow = currValue
    ? `${currValue.name} (${currValue.value})`
    : "Please choose...";

  const valueStyle = currValue ? styles.value : styles.novalue;

  return (
    <>
      <div
        ref={containerRef}
        tabIndex={0}
        className={styles.container}
        onClick={() => toggleShow()}
        onBlur={() => clearShow()}
      >
        <span className={valueStyle}>{valueToShow}</span>

        <nav className={styles.controls}>
          <button
            className={styles["btn-clear"]}
            onClick={(ev) => {
              ev.stopPropagation();
              containerRef.current?.focus();
              clearValue();
            }}
          >
            &times;
          </button>
          <span className={styles.divider}></span>
          <span className={styles.caret}>▿</span>
        </nav>

        <ul className={`${styles.options} ${show ? styles.show : ""}`}>
          {options.map((opt, i) => (
            <li
              onClick={(ev) => {
                ev.stopPropagation();
                setValue(opt);
                clearShow();
              }}
              onMouseEnter={() => setSelectedIdx(i)}
              onMouseMove={() => setSelectedIdx(i)}
              key={opt.value}
              className={`${styles.option} ${
                isOptionSelected(opt) ? styles.selected : ""
              } ${i == selectedIdx ? styles.highlighted : ""}`}
            >
              {opt.name} ({opt.value})
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
