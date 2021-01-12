import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

const red = "#d93939";
const darkerRed = "#ad2d2d";

export const RedButton = withStyles(() => ({
  root: {
    color: "white",
    backgroundColor: red,
    "&:hover": {
      backgroundColor: darkerRed,
    },
  },
}))(Button);
