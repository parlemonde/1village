import classnames from "classnames";
import React from "react";

interface ButtonProps {
  color?: "default" | "primary" | "secondary" | "alert" | "success";
  variant?: "contained" | "outlined" | "inverted";
  type?: "button" | "reset" | "submit";
  children: React.ReactChild | React.ReactChildren;
  style?: React.CSSProperties;
  fullWidth?: boolean;
  onClick?(event: React.MouseEvent<HTMLButtonElement>): void;
}

type RippleStyle = {
  width: string;
  height: string;
  left: string;
  top: string;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  color = "default",
  variant = "contained",
  type,
  style,
  fullWidth = false,
  onClick = () => {},
}: ButtonProps) => {
  const [ripple, setRipple] = React.useState<RippleStyle | null>(null);

  const onSetRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonData = event.currentTarget.getBoundingClientRect();
    const diameter = Math.max(buttonData.width, buttonData.height) * 2;
    const radius = diameter / 2;
    setRipple({
      width: `${diameter}px`,
      height: `${diameter}px`,
      left: `${event.clientX - buttonData.x - radius}px`,
      top: `${event.clientY - buttonData.y - radius}px`,
    });
  };

  const onRemoveRipple = (time: number) => () => {
    setTimeout(() => {
      setRipple(null);
    }, time);
  };

  return (
    <div style={style}>
      <button
        type={type}
        style={{ width: fullWidth ? "100%" : "unset" }}
        onMouseDown={onSetRipple}
        onMouseUp={onRemoveRipple(300)}
        onMouseLeave={onRemoveRipple(0)}
        onClick={onClick}
        className={classnames(`Button--${variant}`, `Button--${color}`)}
      >
        {children}
        {ripple !== null && <span className="ripple" style={ripple}></span>}
        <span
          className="ripple ripple-focus"
          style={{
            width: "50%",
            height: "90%",
            left: "25%",
            top: "5%",
          }}
        ></span>
      </button>
    </div>
  );
};
