import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function SimpleAccordion() {
  return (
    <div>
      <Accordion
        sx={{
          backgroundColor: "#000",
          color: "#f5cab2",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ fill: "#fff" }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography sx={{ fontSize: "1.2rem" }}>Vodafone X OMR</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Vodafone X OMR</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ backgroundColor: "#000", color: "#f5cab2" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ fill: "white" }} />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography sx={{ fontSize: "1.2rem" }}>
            Vodafone Business Pages
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Vodafone Business</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ backgroundColor: "#000", color: "#f5cab2" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ fill: "#fff" }} />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography sx={{ fontSize: "1.2rem" }}>
            ControlExpert EasyClaim
          </Typography>
        </AccordionSummary>
      </Accordion>
    </div>
  );
}
