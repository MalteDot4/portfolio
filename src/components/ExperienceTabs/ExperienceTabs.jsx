import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: "1rem" }}>
          <Typography fontSize={"1.2rem"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function ExperienceTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Box>
        <Tabs
          sx={{
            color: "#fff",
          }}
          value={value}
          centered
          onChange={handleChange}
          aria-label="basic tabs example"
          textColor="inherit"
        >
          <Tab
            sx={{
              fontSize: "1rem",
            }}
            label="ControlExpert "
            {...a11yProps(0)}
          />
          <Tab label="Ford " {...a11yProps(1)} />
          <Tab label="Vodafone" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        As a Frontend Developer at ControlExpert, I worked on the web
        application EasyClaim, an insuretech product. I was responsible for
        implementing the user interface and ensuring that the application was
        visually appealing and functionally sound.
      </TabPanel>
      <TabPanel value={value} index={1}>
        As a Business Analyst of SAP and Power BI products at Ford, I worked on
        analyzing and developing reports for various departments within the
        company. While my time at Ford was brief, I gained valuable experience
        working with SAP and Power BI, and honed my skills in data analysis and
        report development.
      </TabPanel>
      <TabPanel value={value} index={2}>
        As a current Frontend Developer at Vodafone, I am responsible for
        implementing responsive design principles, optimizing website
        performance, and ensuring that the websites I work on meet accessibility
        standards. I collaborate closely with designers to ensure that the
        websites are visually appealing and functionally sound. My role also
        requires staying up-to-date with the latest developments in the field of
        frontend development, which I am passionate about.
      </TabPanel>
    </Box>
  );
}
