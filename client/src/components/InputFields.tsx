import { useState } from "react";
import { Box, Button, FormControl, InputLabel, List, ListItem, ListItemButton, ListItemText, MenuItem, Select, Slider, Typography } from "@mui/material";
import SecurityScoreCard from "./SecurityScoreCard";
import SecurityCard from "./SecurityCard";
import { useLocation } from "react-router-dom";

function SecurityDashboard() {

  const defaultModels = ["0", "1", "2", "3", "4", "5", "6", "7"];
  const [targetCost, setTargetCost] = useState(45);
  const [indirectCost, setIndirectCost] = useState(36);
  const location = useLocation();
  const { vertices, controlGroups, controlLevels, edges } = location.state || {};

  console.log(" Received in SecurityDashboard:", {
    vertices,
    controlGroups,
    controlLevels,
    edges,
  });
  const handleAddClick = () => {
    
   
  };

  

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      p: 3
    }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <SecurityScoreCard score={45} />
        <Box>
        
          {controlGroups.map((group) => {
          const groupId = group.id;
          console.log(groupId);
          
        // Find matching control levels for this group
        const options = controlLevels
          .filter((lvl) => lvl.groupId === groupId)
          .map((lvl) => ({
            value: String(lvl.level), // string for Select
            label: lvl.name,
          }));
          console.log("options",options);
          
        return (
          <SecurityCard
            key={groupId}
            title={group.name}
            icon="🛡️"
            value={  "adsfasd"}          
            options={options}
          />
        );
      })}

          <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
            <Box sx={{ width: 200 }}>
          <Typography variant="subtitle1" gutterBottom>
            Targets (Click to Select)
          </Typography>

          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: 1,
              maxHeight: 120,
              overflowY: "auto",
              backgroundColor: "white",
            }}
          >
            <List dense>
              {defaultModels.map((model) => (
                <ListItem key={model} disablePadding>
                  <ListItemButton>
                    <ListItemText primary={model} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
        <Box sx={{ width: 250, p: 2 }}>
          <Typography gutterBottom>Target Cost: {targetCost}</Typography>
          <Slider
            value={targetCost}
            onChange={(e, val) => setTargetCost(val)}
            min={0}
            max={10}
            step={1}
            valueLabelDisplay="auto"
          />

          <Typography gutterBottom sx={{ mt: 3 }}>
            Indirect Cost: {indirectCost}
          </Typography>
          <Slider
            value={indirectCost}
            onChange={(e, val) => setIndirectCost(val)}
            min={0}
            max={10}
            step={1}
            valueLabelDisplay="auto"
          />
        </Box>
        </Box>
        
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
            Optimise
          </Button>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 3, mt: 3 }}>
        <Button 
          variant="outlined" 
          sx={{ bgcolor: '#e8f5e9', color: '#1b5e20', width: 200 }}
        >
          Edit Model
        </Button>

        <Button 
          variant="outlined" 
          sx={{ bgcolor: '#fff3e0', color: '#e65100', width: 200 }}
        >
          Save Model
        </Button>
      </Box>

      </Box>
    </Box>
  );
}

export default SecurityDashboard;