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
          color: "#fff",
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
          <Typography>
            {" "}
            Visit:{" "}
            <a
              className="accordion__link"
              target="blank"
              href="https://www.vodafone.de/business/"
            >
              Vodafone X OMR Collaboration
            </a>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ backgroundColor: "#000", color: "#fff" }}>
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
          <Typography>
            Visit:{" "}
            <a
              className="accordion__link"
              target="blank"
              href="https://www.vodafone.de/business/"
            >
              Vodafone Business
            </a>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ backgroundColor: "#000", color: "#fff" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ fill: "#fff" }} />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography sx={{ fontSize: "1.2rem" }}>
            ControlExpert EasyClaim
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Visit:{" "}
            <a
              className="accordion__link"
              target="blank"
              href="https://www.controlexpert.com/uk-en/highlights/easyclaim/"
            >
              Control€xpert Easy Claim Web App
            </a>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
