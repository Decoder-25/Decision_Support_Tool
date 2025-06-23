import  { useState } from "react";
import { Box,Typography} from "@mui/material";
import SecurityScoreCard from "./SecurityScoreCard";
import SecurityCard from "./SecurityCard";
function SecurityDashboard() {
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
  const [securityScore, setSecurityScore] = useState(45);

  const defaultOptions = [
    { value: "None", label: "None" },
    { value: "Basic", label: "Basic" },
    { value: "Advanced", label: "Advanced" }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      p: 3
    }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <SecurityScoreCard score={securityScore} />
        <Box>
          <SecurityCard title="Secure Configuration" value={secureConfig} onChange={setSecureConfig} icon="⚙️" options={defaultOptions}/>
          <SecurityCard title="Network Security (External)" value={networkSecExt} onChange={setNetworkSecExt} icon="🌐" options={defaultOptions}/>
          <SecurityCard title="Network Security (Internal)" value={networkSecInt} onChange={setNetworkSecInt} icon="🏠" options={defaultOptions}/>
          <SecurityCard title="User Education" value={userEducation} onChange={setUserEducation} icon="👨‍🎓" options={defaultOptions}/>
          <SecurityCard title="Processes" value={processes} onChange={setProcesses} icon="⚡" options={defaultOptions}/>
          <SecurityCard title="Authentication" value={authentication} onChange={setAuthentication} icon="🔐" options={defaultOptions}/>
          <SecurityCard title="2-Factor Authentication" value={twoFactor} onChange={setTwoFactor} icon="📱" options={defaultOptions}/>
          <SecurityCard title="Anti-malware" value={antimalware} onChange={setAntimalware} icon="🛡️"options={defaultOptions} />
          <SecurityCard title="Access Control" value={accessControl} onChange={setAccessControl} icon="🚪" options={defaultOptions}/>
          <SecurityCard title="Encryption" value={encryption} onChange={setEncryption} icon="🔒" options={defaultOptions}/>
        </Box>
      </Box>
    </Box>
  );
}

export default SecurityDashboard;