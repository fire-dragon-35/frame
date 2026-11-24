import { useId, type InputHTMLAttributes } from 'react';
import { cx } from '../cx';
import styles from './Slider.module.css';

export interface SliderProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'onChange' | 'min' | 'max' | 'step'
> {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onValueChange: (value: number) => void;
  /** How the current value is shown next to the slider. Default: the number. */
  format?: (value: number) => string;
  /** `inline` puts label, slider and value on one row (filters); `stacked` puts the label above. Default `inline`. */
  layout?: 'inline' | 'stacked';
}

/** A labelled range input that shows its value. A native `<input type="range">`, so keyboard and screen readers work. */
export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onValueChange,
  format = String,
  layout = 'inline',
  id,
  className,
  ...rest
}: SliderProps) {
  const auto = useId();
  const sid = id ?? auto;
  const shown = format(value);
  return (
    <div className={cx(styles.slider, styles[layout], className)}>
      <label htmlFor={sid} className={styles.label}>
        {label}
      </label>
      <input
        id={sid}
        type="range"
        className={styles.range}
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={shown}
        onChange={(e) => onValueChange(Number(e.target.value))}
        {...rest}
      />
      <output htmlFor={sid} className={styles.value}>
        {shown}
      </output>
    </div>
  );
}
