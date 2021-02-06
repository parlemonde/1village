import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

import { errorColor, errorColorDarker } from "src/styles/variables.const";

export const RedButton = withStyles(() => ({
  root: {
    color: "white",
    backgroundColor: errorColor,
    "&:hover": {
      backgroundColor: errorColorDarker,
    },
  },
}))(Button);
