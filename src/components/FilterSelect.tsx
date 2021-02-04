import React from "react";

import Checkbox from "@material-ui/core/Checkbox";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

interface FilterSelectProps {
  options: { key: string | number; label: string }[];
  name: string;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({ name, options }: FilterSelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = React.useState<number>(0);
  const selectedOption = options.length <= selectedOptionIndex ? null : options[selectedOptionIndex];

  return (
    <div style={{ position: "relative", marginLeft: "0.5rem" }}>
      <div
        style={{ display: "inline-block", cursor: "pointer", border: "1px solid #4c3ed9", borderRadius: "5px" }}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <div
          style={{
            padding: "0 0.4rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span className="text text--small" style={{ marginRight: "0.2rem" }}>
            {name}
          </span>
          <span
            className="text text--small bg-primary-light"
            style={{ padding: "0.2rem 0.5rem", borderRadius: "0.8rem", textDecoration: "underline" }}
          >
            {selectedOption?.label || ""}
          </span>
          <ExpandMoreIcon />
        </div>
      </div>

      {isOpen && (
        <ClickAwayListener
          onClickAway={() => {
            setIsOpen(false);
          }}
        >
          <div
            style={{
              display: "inline-block",
              border: "1px solid #4c3ed9",
              borderRadius: "5px",
              position: "absolute",
              top: 0,
              left: 0,
              backgroundColor: "white",
              zIndex: 20,
            }}
          >
            <div
              style={{
                padding: "0 0.4rem",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <span className="text text--small" style={{ marginRight: "0.2rem" }}>
                {name}
              </span>
              <span
                className="text text--small bg-primary-light"
                style={{ padding: "0.2rem 0.5rem", borderRadius: "0.8rem", textDecoration: "underline" }}
              >
                {selectedOption?.label || ""}
              </span>
              <ExpandLessIcon />
            </div>

            <div style={{ padding: "0 0.4rem" }}>
              <FormGroup>
                {options.map((option, index) => (
                  <FormControlLabel
                    key={option.key}
                    style={{ margin: 0, cursor: "pointer" }}
                    control={
                      <Checkbox
                        size="small"
                        style={{ padding: "0", marginRight: "0.5rem" }}
                        checked={selectedOption.key === option.key}
                        onChange={() => {
                          setSelectedOptionIndex(index);
                          setIsOpen(false);
                        }}
                        name={`${option.key}`}
                        color="primary"
                      />
                    }
                    label={
                      <span className="text text--small" style={{ cursor: "pointer" }}>
                        {option.label}
                      </span>
                    }
                  />
                ))}
              </FormGroup>
            </div>
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
};
