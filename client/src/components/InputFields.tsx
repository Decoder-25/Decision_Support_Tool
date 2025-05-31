import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Typography,
  Button,
  
  OutlinedInput,
  ListItemText,
  Checkbox
} from "@mui/material";

const options = [
  "Secure configuration",
  "Network security (external)",
  "Network security (internal)",
  "User education",
  "Processes",
  "Authentication",
  "2-factor authentication",
  "Anti-malware",
  "Access control",
  "Encryption"
];

const targetOptions = ["start", "webserver", "in LAN", "credentials", "website", "root"];

export default function InputFields() {
  const [targets, setTargets] = React.useState<string[]>([]);

  const handleMultiSelect = (event: any) => {
    const {
      target: { value },
    } = event;
    setTargets(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <Box display="flex" flexWrap="wrap" gap={2} p={3}>
      <Box flex={1} minWidth="300px">
        {options.map((label, index) => (
          <FormControl key={index} fullWidth margin="dense">
            <InputLabel>{label}</InputLabel>
            <Select defaultValue="None" label={label}>
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Basic">Basic</MenuItem>
              <MenuItem value="Advanced">Advanced</MenuItem>
            </Select>
          </FormControl>
        ))}

        <Box mt={2}>
          <Typography gutterBottom>Target cost: 46</Typography>
          <Slider defaultValue={46} max={100} />
        </Box>

        <Box mt={2}>
          <Typography gutterBottom>Target indirect cost: 50</Typography>
          <Slider defaultValue={50} max={100} />
        </Box>

        <Box mt={2}>
          <FormControl fullWidth>
            <InputLabel>Targets (multi-select)</InputLabel>
            <Select
              multiple
              value={targets}
              onChange={handleMultiSelect}
              input={<OutlinedInput label="Targets" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {targetOptions.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={targets.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box display="flex" flexDirection="column" gap={1} mt={3}>
          <Button variant="contained">Optimise</Button>
          <Button variant="outlined">Load Template</Button>
          <Button variant="outlined">New Model</Button>
          <Button variant="outlined">Edit Model</Button>
          <Button variant="outlined">Save Model</Button>
        </Box>

        <Box mt={3}>
          <Button variant="outlined" component="label">
            Choose File
            <input type="file" hidden />
          </Button>
        </Box>

        <Box mt={3}>
          <Typography variant="body2">Total costs: 0</Typography>
          <Typography variant="body2">Total indirect costs: 0</Typography>
          <Typography variant="body2">Max flow to the target(s): 1</Typography>
        </Box>

        <Box mt={2}>
          <Button fullWidth variant="outlined" color="error">
            Clear
          </Button>
        </Box>
      </Box>
    </Box>
  );
}