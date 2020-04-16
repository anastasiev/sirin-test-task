import {withStyles} from "@material-ui/core/styles";
import {TextField} from "@material-ui/core";

const ColoredTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: '#ff8a65',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#ff8a65',
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: '#ff8a65',
      },
    },
  },
})(TextField);

export default ColoredTextField;