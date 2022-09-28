import { useEffect, useRef, useState } from "react";
import styles from "./Select2.module.css";

export type Select2Option = {
  label: string;
  value: string | number;
};

type MultipleSelect2Props = {
  multiple: true;
  value: Select2Option[];
  onChange: (value: Select2Option[]) => void;
};

type SingleSelect2Props = {
  multiple?: false;
  value?: Select2Option;
  onChange: (value: Select2Option | undefined) => void;
};

type Select2Props = {
  options: Select2Option[];
} & (SingleSelect2Props | MultipleSelect2Props);

export function Select2({ multiple, value, onChange, options }: Select2Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  function clearOptions() {
    multiple ? onChange([]) : onChange(undefined);
  }

  function selectOption(option: Select2Option) {
    if (multiple) {
      if (value.includes(option)) {
        onChange(value.filter((o) => o !== option));
      } else {
        onChange([...value, option]);
      }
    } else {
      if (option !== value) onChange(option);
    }
  }

  function isOptionSelected(option: Select2Option) {
    if (multiple) {
      return value.includes(option);
    } else {
      const isSame = option === value;
      const isSameValue = value && (value.value === option.value &&
        value.label === option.label);

      if (isSame !== isSameValue) {
        console.log(
          `WHY2?: isOptionSelected: isSame=${isSame}, isSameValue=${isSameValue}: ${
            JSON.stringify(option)
          } !== ${JSON.stringify(value)}`,
        );
      }

      return isSameValue;
    }
  }

  useEffect(() => {
    if (isOpen) setHighlightedIndex(0);
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target != containerRef.current) return;
      switch (e.code) {
        case "Enter":
        case "Space":
          setIsOpen((prev) => !prev);
          if (isOpen) selectOption(options[highlightedIndex]);
          break;
        case "ArrowUp":
        case "ArrowDown": {
          if (!isOpen) {
            setIsOpen(true);
            break;
          }

          const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
          if (newValue >= 0 && newValue < options.length) {
            setHighlightedIndex(newValue);
          }
          break;
        }
        case "Escape":
          setIsOpen(false);
          break;
      }
    };
    containerRef.current?.addEventListener("keydown", handler);

    return () => {
      containerRef.current?.removeEventListener("keydown", handler);
    };
  }, [isOpen, highlightedIndex, options]);

  return (
    <div
      ref={containerRef}
      onBlur={() => setIsOpen(false)}
      onClick={() => setIsOpen((prev) => !prev)}
      tabIndex={0}
      className={styles.container}
    >
      <span className={styles.value}>
        {multiple
          ? value.map((v) => (
            <button
              key={v.value}
              onClick={(e) => {
                e.stopPropagation();
                selectOption(v);
              }}
              className={styles["option-badge"]}
            >
              {v.label}
              <span className={styles["remove-btn"]}>&times;</span>
            </button>
          ))
          : value?.label}
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          clearOptions();
        }}
        className={styles["clear-btn"]}
      >
        &times;
      </button>
      <div className={styles.divider}></div>
      <div className={styles.caret}></div>

      <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
        {options.map((option, index) => (
          <li
            onClick={(e) => {
              e.stopPropagation();
              selectOption(option);
              setIsOpen(false);
            }}
            onMouseEnter={() => setHighlightedIndex(index)}
            key={option.value}
            className={`${styles.option} ${
              isOptionSelected(option) ? styles.selected : ""
            } ${index === highlightedIndex ? styles.highlighted : ""}`}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
