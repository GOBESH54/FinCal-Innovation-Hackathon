import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "../styles/calculator.module.css";

interface NumericSliderInputProps {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  prefix?: string;
  tooltipText?: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getDecimalPlaces(step: number): number {
  if (!Number.isFinite(step)) return 0;
  const text = step.toString();
  if (!text.includes(".")) return 0;
  return text.split(".")[1]?.length ?? 0;
}

function formatForInput(value: number, step: number): string {
  if (!Number.isFinite(value)) return "0";
  const decimals = getDecimalPlaces(step);
  return decimals > 0
    ? value.toFixed(decimals).replace(/\.?0+$/, "")
    : String(Math.round(value));
}

function NumericSliderInput({
  id,
  label,
  min,
  max,
  step,
  value,
  onChange,
  suffix,
  prefix,
  tooltipText,
}: NumericSliderInputProps) {
  const [textValue, setTextValue] = useState(formatForInput(value, step));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const isFocused = useRef(false);
  const tooltipRef = useRef<HTMLButtonElement>(null);

  const sanitizedSliderValue = useMemo(
    () => clamp(value, min, max),
    [value, min, max]
  );

  const sliderValueText = useMemo(() => {
    const formatted = formatForInput(sanitizedSliderValue, step);
    if (suffix) return `${formatted} ${suffix}`;
    if (prefix) return `${prefix} ${formatted}`;
    return formatted;
  }, [sanitizedSliderValue, step, suffix, prefix]);

  useEffect(() => {
    if (!isFocused.current) {
      setTextValue(formatForInput(sanitizedSliderValue, step));
    }
  }, [sanitizedSliderValue, step]);

  // Close tooltip on Escape
  useEffect(() => {
    if (!tooltipOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setTooltipOpen(false);
        tooltipRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [tooltipOpen]);

  // Close tooltip on outside click
  useEffect(() => {
    if (!tooltipOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node)
      ) {
        setTooltipOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [tooltipOpen]);

  const toggleTooltip = useCallback(() => {
    setTooltipOpen((prev) => !prev);
  }, []);

  const handleTextChange = (rawInput: string) => {
    if (!/^\d*\.?\d*$/.test(rawInput)) {
      return;
    }

    setTextValue(rawInput);

    if (rawInput === "") {
      setErrorMsg(null);
      onChange(min === 0 ? 0 : min);
      return;
    }

    const parsed = Number(rawInput);
    if (!Number.isFinite(parsed)) {
      return;
    }

    if (parsed < min) {
      setErrorMsg(`Minimum allowed value is ${min}`);
    } else if (parsed > max) {
      setErrorMsg(`Maximum allowed value is ${max}`);
    } else {
      setErrorMsg(null);
    }

    onChange(clamp(parsed, min, max));
  };

  const handleBlur = () => {
    isFocused.current = false;

    const parsed = Number(textValue);
    const normalized = Number.isFinite(parsed)
      ? clamp(parsed, min, max)
      : min;
    const finalValue = min === 0 && textValue === "" ? 0 : normalized;

    onChange(finalValue);
    setTextValue(formatForInput(finalValue, step));
    setErrorMsg(null);
  };

  const hasError = errorMsg !== null;
  const errorId = `${id}-error`;
  const tooltipId = `${id}-tooltip`;

  return (
    <div className={styles.inputRow}>
      <div className={styles.labelWithTooltip}>
        <label className={styles.inputLabel} htmlFor={id}>
          {label}
        </label>
        {tooltipText ? (
          <button
            ref={tooltipRef}
            type="button"
            className={`${styles.tooltipTrigger} ${
              tooltipOpen ? styles.tooltipTriggerActive : ""
            }`}
            aria-label={`${label} info`}
            aria-expanded={tooltipOpen}
            aria-controls={tooltipId}
            onClick={toggleTooltip}
          >
            i
            <span
              id={tooltipId}
              role="tooltip"
              className={`${styles.tooltipContent} ${
                tooltipOpen ? styles.tooltipContentVisible : ""
              }`}
            >
              {tooltipText}
            </span>
          </button>
        ) : null}
      </div>
      <div className={styles.inputInline}>
        <div
          className={`${styles.numericWrapper} ${
            hasError ? styles.numericWrapperError : ""
          }`}
        >
          {prefix && <span className={styles.affix}>{prefix}</span>}
          <input
            id={id}
            className={styles.numberInput}
            type="text"
            inputMode={step < 1 ? "decimal" : "numeric"}
            aria-label={label}
            aria-describedby={`${id}-sr-value${hasError ? ` ${errorId}` : ""}`}
            aria-invalid={hasError}
            aria-errormessage={hasError ? errorId : undefined}
            value={textValue}
            onFocus={(event) => {
              isFocused.current = true;
              event.currentTarget.select();
            }}
            onBlur={handleBlur}
            onChange={(event) => handleTextChange(event.target.value)}
          />
          {suffix && <span className={styles.affix}>{suffix}</span>}
        </div>
        <input
          className={styles.sliderInput}
          type="range"
          min={min}
          max={max}
          step={step}
          value={sanitizedSliderValue}
          onChange={(event) => {
            onChange(Number(event.target.value));
            setErrorMsg(null);
          }}
          aria-label={`${label} slider`}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={sanitizedSliderValue}
          aria-valuetext={sliderValueText}
          aria-describedby={`${id}-sr-value`}
        />
        <span id={`${id}-sr-value`} className={styles.srOnly}>
          Current value: {sliderValueText}
        </span>
      </div>
      {hasError && (
        <p
          id={errorId}
          className={styles.inputError}
          role="alert"
          aria-live="assertive"
        >
          {errorMsg}
        </p>
      )}
    </div>
  );
}

export default memo(NumericSliderInput);
