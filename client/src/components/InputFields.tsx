import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import SecurityScoreCard from "./SecurityScoreCard";
import SecurityCard from "./SecurityCard";
import { OPTIONS } from "../types/optionTypes";

function SecurityDashboard() {
  const [secureConfig, setSecureConfig] = useState("None");
  const [secureConfigValue, setSecureConfigValue] = useState(0);

  const [networkSecExt, setNetworkSecExt] = useState("None");
  const [networkSecExtValue, setNetworkSecExtValue] = useState(0);

  const [networkSecInt, setNetworkSecInt] = useState("None");
  const [networkSecIntValue, setNetworkSecIntValue] = useState(0);

  const [userEducation, setUserEducation] = useState("None");
  const [userEducationValue, setUserEducationValue] = useState(0);

  const [processes, setProcesses] = useState("None");
  const [processesValue, setProcessesValue] = useState(0);

  const [authentication, setAuthentication] = useState("None");
  const [authenticationValue, setAuthenticationValue] = useState(0);

  const [twoFactor, setTwoFactor] = useState("None");
  const [twoFactorValue, setTwoFactorValue] = useState(0);

  const [antimalware, setAntimalware] = useState("None");
  const [antimalwareValue, setAntimalwareValue] = useState(0);

  const [accessControl, setAccessControl] = useState("None");
  const [accessControlValue, setAccessControlValue] = useState(0);

  const [encryption, setEncryption] = useState("None");
  const [encryptionValue, setEncryptionValue] = useState(0);

  const [securityScore, setSecurityScore] = useState(0);

  // Function to log all captured values
  const handleAddClick = () => {
    console.log('secureConfig:', secureConfig, 'score:', secureConfigValue);
    console.log('networkSecExt:', networkSecExt, 'score:', networkSecExtValue);
    console.log('networkSecInt:', networkSecInt, 'score:', networkSecIntValue);
    console.log('userEducation:', userEducation, 'score:', userEducationValue);
    console.log('processes:', processes, 'score:', processesValue);
    console.log('authentication:', authentication, 'score:', authenticationValue);
    console.log('twoFactor:', twoFactor, 'score:', twoFactorValue);
    console.log('antimalware:', antimalware, 'score:', antimalwareValue);
    console.log('accessControl:', accessControl, 'score:', accessControlValue);
    console.log('encryption:', encryption, 'score:', encryptionValue);
   
  };

  // Helper function to update both value and score
  const updateValueAndScore = (setValue, setValueScore, options, newValue) => {
    setValue(newValue);
    const selectedOption = options.find(option => option.value === newValue);
    const score = selectedOption ? selectedOption.score : 0;
    setValueScore(score);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      p: 3
    }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <SecurityScoreCard score={securityScore} />
        <Box>
          <SecurityCard 
            title="Secure Configuration" 
            value={secureConfig} 
            onChange={(value) => updateValueAndScore(setSecureConfig, setSecureConfigValue, OPTIONS.secureConfiguration, value)}
            icon="⚙️" 
            options={OPTIONS.secureConfiguration}
          />
          <SecurityCard 
            title="Network Security (External)" 
            value={networkSecExt} 
            onChange={(value) => updateValueAndScore(setNetworkSecExt, setNetworkSecExtValue, OPTIONS.networkSecurityExternal, value)}
            icon="🌐" 
            options={OPTIONS.networkSecurityExternal}
          />
          <SecurityCard 
            title="Network Security (Internal)" 
            value={networkSecInt} 
            onChange={(value) => updateValueAndScore(setNetworkSecInt, setNetworkSecIntValue, OPTIONS.networkSecurityInternal, value)}
            icon="🏠" 
            options={OPTIONS.networkSecurityInternal}
          />
          <SecurityCard 
            title="User Education" 
            value={userEducation} 
            onChange={(value) => updateValueAndScore(setUserEducation, setUserEducationValue, OPTIONS.userEducation, value)}
            icon="👨‍🎓" 
            options={OPTIONS.userEducation}
          />
          <SecurityCard 
            title="Processes" 
            value={processes} 
            onChange={(value) => updateValueAndScore(setProcesses, setProcessesValue, OPTIONS.processes, value)}
            icon="⚡" 
            options={OPTIONS.processes}
          />
          <SecurityCard 
            title="Authentication" 
            value={authentication} 
            onChange={(value) => updateValueAndScore(setAuthentication, setAuthenticationValue, OPTIONS.authentication, value)}
            icon="🔐" 
            options={OPTIONS.authentication}
          />
          <SecurityCard 
            title="2-Factor Authentication" 
            value={twoFactor} 
            onChange={(value) => updateValueAndScore(setTwoFactor, setTwoFactorValue, OPTIONS.twoFactorAuthentication, value)}
            icon="📱" 
            options={OPTIONS.twoFactorAuthentication}
          />
          <SecurityCard 
            title="Anti-malware" 
            value={antimalware} 
            onChange={(value) => updateValueAndScore(setAntimalware, setAntimalwareValue, OPTIONS.antiMalware, value)}
            icon="🛡️" 
            options={OPTIONS.antiMalware}
          />
          <SecurityCard 
            title="Access Control" 
            value={accessControl} 
            onChange={(value) => updateValueAndScore(setAccessControl, setAccessControlValue, OPTIONS.accessControl, value)}
            icon="🚪" 
            options={OPTIONS.accessControl}
          />
          <SecurityCard 
            title="Encryption" 
            value={encryption} 
            onChange={(value) => updateValueAndScore(setEncryption, setEncryptionValue, OPTIONS.encryption, value)}
            icon="🔒" 
            options={OPTIONS.encryption}
          />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={handleAddClick}
            sx={{ 
              px: 4, 
              py: 1.5,
              borderRadius: 2,
              fontWeight: 'bold'
            }}
          >
            Add
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default SecurityDashboard;