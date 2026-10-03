// Rolling digits that never mount or unmount: each slot is a fixed 0–9 strip that slides,
// so a value changing on every scroll frame stays stable and interruptible.
const DIGITS = [..."0123456789"];

export const Odometer = ({ text, className = "" }) => (
  <span className={`odometer ${className}`} aria-hidden="true">
    {[...text].map((char, position) =>
      /\d/.test(char) ? (
        <span key={position} className="odometer-digit">
          <span style={{ transform: `translateY(${-Number(char) * 10}%)` }}>
            {DIGITS.map((digit) => <span key={digit}>{digit}</span>)}
          </span>
        </span>
      ) : (
        <span key={position} className="odometer-sep">{char}</span>
      ),
    )}
  </span>
);
