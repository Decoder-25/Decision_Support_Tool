import React, { useState } from "react";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

function InputFields() {
  const [secureConfig, setSecureConfig] = useState("None");
  const [networkSecExt, setNetworkSecExt] = useState("None");
  const [networkSecInt, setNetworkSecInt] = useState("None");
  const [userEducation, setUserEducation] = useState("None");
  const [processes, setProcesses] = useState("None");
  const [authentication, setAuthentication] = useState("None");
  const [twoFactor, setTwoFactor] = useState("None");
  const [antimalware, setAntimalware] = useState("None");
  const [accessControl, setAccessControl] = useState("None");
  const [encryption, setEncryption] = useState("None");

  return (
    <Box sx={{ p: 2, maxWidth: 350 }}>
      {/* Secure configuration */}
      <FormControl fullWidth margin="dense">
        <InputLabel>Secure configuration</InputLabel>
        <Select
          value={secureConfig}
          label="Secure configuration"
          onChange={e => setSecureConfig(e.target.value)}
        >
          <MenuItem value="None">None</MenuItem>
          <MenuItem value="Basic">Basic</MenuItem>
          <MenuItem value="Advanced">Advanced</MenuItem>
        </Select>
      </FormControl>

      {/* Network security (external) */}
      <FormControl fullWidth margin="dense">
        <InputLabel>Network security (external)</InputLabel>
        <Select
          value={networkSecExt}
          label="Network security (external)"
          onChange={e => setNetworkSecExt(e.target.value)}
        >
          <MenuItem value="None">None</MenuItem>
          <MenuItem value="Basic">Basic</MenuItem>
          <MenuItem value="Advanced">Advanced</MenuItem>
        </Select>
      </FormControl>

      {/* Network security (internal) */}
      <FormControl fullWidth margin="dense">
        <InputLabel>Network security (internal)</InputLabel>
        <Select
          value={networkSecInt}
          label="Network security (internal)"
          onChange={e => setNetworkSecInt(e.target.value)}
        >
          <MenuItem value="None">None</MenuItem>
          <MenuItem value="Basic">Basic</MenuItem>
          <MenuItem value="Advanced">Advanced</MenuItem>
        </Select>
      </FormControl>

      {/* User education */}
      <FormControl fullWidth margin="dense">
        <InputLabel>User education</InputLabel>
        <Select
          value={userEducation}
          label="User education"
          onChange={e => setUserEducation(e.target.value)}
        >
          <MenuItem value="None">None</MenuItem>
          <MenuItem value="Basic">Basic</MenuItem>
          <MenuItem value="Advanced">Advanced</MenuItem>
        </Select>
      </FormControl>

      {/* Processes */}
      <FormControl fullWidth margin="dense">
        <InputLabel>Processes</InputLabel>
        <Select
          value={processes}
          label="Processes"
          onChange={e => setProcesses(e.target.value)}
        >
          <MenuItem value="None">None</MenuItem>
          <MenuItem value="Basic">Basic</MenuItem>
          <MenuItem value="Advanced">Advanced</MenuItem>
        </Select>
      </FormControl>

      {/* Authentication */}
      <FormControl fullWidth margin="dense">
        <InputLabel>Authentication</InputLabel>
        <Select
          value={authentication}
          label="Authentication"
          onChange={e => setAuthentication(e.target.value)}
        >
          <MenuItem value="None">None</MenuItem>
          <MenuItem value="Basic">Basic</MenuItem>
          <MenuItem value="Advanced">Advanced</MenuItem>
        </Select>
      </FormControl>

      {/* 2-factor authentication */}
      <FormControl fullWidth margin="dense">
        <InputLabel>2-factor authentication</InputLabel>
        <Select
          value={twoFactor}
          label="2-factor authentication"
          onChange={e => setTwoFactor(e.target.value)}
        >
          <MenuItem value="None">None</MenuItem>
          <MenuItem value="Basic">Basic</MenuItem>
          <MenuItem value="Advanced">Advanced</MenuItem>
        </Select>
      </FormControl>

      {/* Anti-malware */}
      <FormControl fullWidth margin="dense">
        <InputLabel>Anti-malware</InputLabel>
        <Select
          value={antimalware}
          label="Anti-malware"
          onChange={e => setAntimalware(e.target.value)}
        >
          <MenuItem value="None">None</MenuItem>
          <MenuItem value="Basic">Basic</MenuItem>
          <MenuItem value="Advanced">Advanced</MenuItem>
        </Select>
      </FormControl>

      {/* Access control */}
      <FormControl fullWidth margin="dense">
        <InputLabel>Access control</InputLabel>
        <Select
          value={accessControl}
          label="Access control"
          onChange={e => setAccessControl(e.target.value)}
        >
          <MenuItem value="None">None</MenuItem>
          <MenuItem value="Basic">Basic</MenuItem>
          <MenuItem value="Advanced">Advanced</MenuItem>
        </Select>
      </FormControl>

      {/* Encryption */}
      <FormControl fullWidth margin="dense">
        <InputLabel>Encryption</InputLabel>
        <Select
          value={encryption}
          label="Encryption"
          onChange={e => setEncryption(e.target.value)}
        >
          <MenuItem value="None">None</MenuItem>
          <MenuItem value="Basic">Basic</MenuItem>
          <MenuItem value="Advanced">Advanced</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
export default InputFields;
