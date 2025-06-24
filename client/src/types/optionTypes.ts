// types.ts
export type Option = {
    value: string;       // unique id (e.g. "upToDate")
    label: string;       // text shown to the user
    score: number;       // any extra data you want – add more fields as needed
  };
  
  export type OptionCatalog = {
    [category: string]: Option[];
  };


export const OPTIONS: OptionCatalog = {

  secureConfiguration: [
    { value: "none",        label: "None",            score: 0 },
    { value: "upToDate",    label: "Up-to-date OS",   score: 5 },
    { value: "patching",    label: "patching",       score: 7 },
    { value: "whitelisting",label: "whilelisting",  score: 9 }
  ],


  networkSecurityExternal: [
    { value: "none",        label: "None",            score: 0 },
    { value: "basicFw",     label: "Basic firewall",  score: 5 },
    { value: "trafficMonitoring",      label: "traffic-monitoring",       score: 7 },
    { value: "inDepthSystemInspection",      label: "Indepth-System-Inspection",       score: 9 }
  ],


  networkSecurityInternal: [
    { value: "none",        label: "None",            score: 0 },
    { value: "firewall",        label: "firewall",            score: 5 },
    { value: "trafficMonitoring",label: "traffic-monitoring",    score: 7 },
    { value: "inDepthPacketInspection",   label: "in-depth-packet-inspection",      score: 9 }
  ],


  userEducation: [
    { value: "none",        label: "None",            score: 0 },
    { value: "basicTraning",    label: "Basic training", score: 5 },
    { value: "activeSimulatedSocialEngineeringAttacks",    label: "Active Simualted Social Engineering Attacks", score: 7 },
    { value: "stronglyMonitoredPolicies",   label: "Strongly Monitored Policies",       score: 9 }
  ],


  processes: [
    { value: "none",        label: "None",            score: 0 },
    { value: "Inventories",        label: "Invetories",    score: 5 },
    { value: "promptDisablingWhenUsersLeave", label: "Prompt Disabling When the users leave",    score: 9 }
  ],


  authentication: [
    { value: "none",        label: "None",            score: 0 },
    { value: "strongPasswordPolicy",   label: "Strong password policy",score: 5 },
    { value: "regularlyChangedpassword",label: "Regularly-changed-password",   score: 9 }
  ],


  twoFactorAuthentication: [
    { value: "none",        label: "None",            score: 0 },
    { value: "2factorAuthentication",         label: "2-factor-authentication",    score: 9 },
  ],


  antiMalware: [
    { value: "none",        label: "None",            score: 0 },
    { value: "useAntiMalware",         label: "use-anti-malware", score: 9 },
  ],


  accessControl: [
    { value: "none",        label: "None",            score: 0 },
    { value: "accessControl",        label: "access control",            score: 9 },
  ],


  encryption: [
    { value: "none",        label: "None",            score: 0 },
    { value: "implementEncryption",      label: "Implement Encryption",         score: 9 },
  ]
};
