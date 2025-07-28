import { BackButton } from "@upyog/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import ErrorBoundary from "../../components/ErrorBoundaries";
import { AppHome } from "../../components/Home";
import TopBarSideBar from "../../components/TopBarSideBar";
import CitizenHome from "./Home";
import LanguageSelection from "./Home/LanguageSelection";
import LocationSelection from "./Home/LocationSelection";
import Login from "./Login";
import UserProfile from "./Home/UserProfile";
import { color, style } from "@material-ui/system";
import { Typography, Box, Chip } from "@material-ui/core";
import { List, ListItem, ListItemText, Alert } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import DashboardApplicationSearch from "./Home/DashboardApplicationSearch";

const getTenants = (codes, tenants) => {
  return tenants.filter((tenant) => codes.map((item) => item.code).includes(tenant.code));
};

const Home = ({
  stateInfo,
  userDetails,
  CITIZEN,
  cityDetails,
  mobileView,
  handleUserDropdownSelection,
  logoUrl,
  DSO,
  stateCode,
  modules,
  appTenants,
  sourceUrl,
  pathname,
}) => {
  const classname = Digit.Hooks.fsm.useRouteSubscription(pathname);
  const { t } = useTranslation();
  const { path } = useRouteMatch();
  sourceUrl = "https://try-digit-eks-yourname.s3.ap-south-1.amazonaws.com";
  const pdfUrl = "https://www.entitcs.com/";

  const appRoutes = modules.map(({ code, tenants }, index) => {
    const Module = Digit.ComponentRegistryService.getComponent(`${code}Module`);
    return (
      <Route key={index} path={`${path}/${code.toLowerCase()}`}>
        <Module stateCode={stateCode} moduleCode={code} userType="citizen" tenants={getTenants(tenants, appTenants)} />
      </Route>
    );
  });

  const [initiatedCount, setInitiatedCount] = useState(0);
  const [citizenApprovalInProcessCount, setCitizenApprovalInProcessCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [departmentInProcessCount, setDepartmentInProcessCount] = useState(0);
  const [reassignedCount, setReassignedCount] = useState(0);
  const [applFeePending, setApplFeePending] = useState(0);
  const [sancFeePending, setSancFeePending] = useState(0);
  const [inprogressCount, setInprogressCount] = useState(0);
  const [totalProposal, setTotalProposal] = useState(0);
  const [directBhawanAnugya, setDirectBhawanAnugya] = useState(0);

  useEffect(async () => {
    const getDashboardCount = await Digit.OBPSAdminService.getDashboardCount();

    // console.log("getDashboardCount--" + JSON.stringify(getDashboardCount))

    getDashboardCount.forEach((dashboardData) => {
      if (dashboardData.initiated !== undefined) {
        const initiatedCount = dashboardData.initiated;
        setInitiatedCount(initiatedCount);
        // console.log("initiatedCount" + initiatedCount);
      }

      if (dashboardData.citizen_approval_inprocess !== undefined) {
        const citizenApprovalInProcessCount = dashboardData.citizen_approval_inprocess;
        setCitizenApprovalInProcessCount(citizenApprovalInProcessCount);
      }

      if (dashboardData.approved !== undefined) {
        const approvedCount = dashboardData.approved;
        setApprovedCount(approvedCount);
      }

      if (dashboardData.rejected !== undefined) {
        const rejectedCount = dashboardData.rejected;
        setRejectedCount(rejectedCount);
      }

      if (dashboardData.direct_bhawan_anugya !== undefined) {
        const directBhawanAnugya = dashboardData.direct_bhawan_anugya;
        setDirectBhawanAnugya(directBhawanAnugya);
      }

      if (dashboardData.department_inprocess !== undefined) {
        const departmentInProcessCount = dashboardData.department_inprocess;
        setDepartmentInProcessCount(departmentInProcessCount);
      }

      if (dashboardData.reassign !== undefined) {
        const reassignedCount = dashboardData.reassign;
        setReassignedCount(reassignedCount);
      }

      if (dashboardData.appl_fee !== undefined) {
        const applFeePending = dashboardData.appl_fee;
        setApplFeePending(applFeePending);
      }

      if (dashboardData.sanc_fee_pending !== undefined) {
        const sancFeePending = dashboardData.sanc_fee_pending;
        setSancFeePending(sancFeePending);
      }

      if (dashboardData.inprogress !== undefined) {
        const inprogressCount = dashboardData.inprogress;
        setInprogressCount(inprogressCount);
      }

      if (dashboardData.total !== undefined) {
        const totalProposal = dashboardData.total;
        setTotalProposal(totalProposal);
      }
    });
  }, []);

  const ModuleLevelLinkHomePages = modules.map(({ code, bannerImage }, index) => {
    let Links = Digit.ComponentRegistryService.getComponent(`${code}Links`) || (() => <React.Fragment />);

    return (
      // <Route key={index} path={`${path}/${code.toLowerCase()}-home`}>
      //   <div className="moduleLinkHomePage">
      //     <img src={bannerImage || stateInfo?.bannerUrl} alt="noimagefound" />
      //     {/* <BackButton className="moduleLinkHomePageBackButton" /> */}
      //     {/* <h1>{t("MODULE_" + code.toUpperCase())}</h1> */}
      //   </div>
      //   <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} >
      //     <Box flex="3" className="leftColumn">
      //       <Chip label="Welcome to Online Building Permission System!" style={{ width: '100%', maxWidth: 500, color: 'white', backgroundColor: '#f47738', marginTop: 20, fontSize: 19 }} />
      //       <Typography variant="body1" style={{ fontFamily: 'Sans-serif', color: '#444444', padding: 10, marginTop: 10, marginRight: 40, fontSize: 20, textAlign: 'justify' }}>
      //         Niwaspass system enables citizens of urban areas of Chhattisgarh to upload their requisite documents as per the set procedure and generate the building permission after various checks of the system. In this system, an unique Chhattisgarh model based initiative has been introduced where citizens having plot size upto 500 Sq. Mtr can get Direct Building Permission by paying a 1/- application fees.
      //       </Typography>

      //       {/* if not responsive remove marginnRight of above*/}
      //       <Typography variant="body1" style={{ fontFamily: 'Sans-serif', color: '#2e2e2e', marginBottom: '1rem', marginLeft: 10, fontSize: 18 }}>
      //         Currently the following ULB's are in this system :
      //       </Typography>

      //       <List sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: -2 }}>
      //         <ListItem>

      //           <ListItemText primary="Birgaon Municipal Corporation" style={{ color: "#444444" }} />
      //         </ListItem>
      //         <ListItem>
      //           <ListItemText primary="Dhamtari Municipal Corporation" style={{ color: "#444444" }} />
      //         </ListItem>
      //         <ListItem>
      //           <ListItemText primary="Bhilai-Charoda Municipal Corporation" style={{ color: "#444444" }} />
      //         </ListItem>
      //       </List>

      //     </Box>
      //     <Box flex="1" className="rightColumn">
      //       <div className="moduleLinkHomePageModuleLinks">
      //         <Links key={index} matchPath={`/fsm-ui/citizen/${code.toLowerCase()}`} userType={"citizen"} />
      //       </div>
      //       <div style={{ display: 'flex', flexWrap: 'wrap', width: '1000%' }}>

      //       </div>

      //     </Box>
      //   </Box>

      //   <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
      //     <Card sx={{
      //       width: '30%', marginBottom: '1rem', backgroundColor: 'white', boxShadow: '0px 0px 20px 5px rgba(0, 0, 0, 0.1)',
      //       borderRadius: '10px',
      //     }}>
      //       <CardContent>
      //         <Typography style={{ fontSize: 30, justifyContent: 'center', display: 'flex', color: '#EA7738' }}
      //           gutterBottom>
      //           {totalProposal}
      //         </Typography>
      //         <Typography style={{ color: '#EA7738', justifyContent: 'center', display: 'flex' }}>
      //           Total Application
      //         </Typography>
      //       </CardContent>
      //     </Card>

      //     <Card sx={{
      //       width: '30%', marginBottom: '1rem', backgroundColor: 'white', boxShadow: '0px 0px 20px 5px rgba(0, 0, 0, 0.1)',
      //       borderRadius: '10px',
      //     }}>
      //       <CardContent>
      //         <Typography style={{ fontSize: 30, justifyContent: 'center', display: 'flex', color: '#EA7738' }}
      //           gutterBottom>
      //           {initiatedCount}
      //         </Typography>
      //         <Typography style={{ color: '#EA7738', justifyContent: 'center', display: 'flex' }}>
      //           Initiated Application
      //         </Typography>
      //       </CardContent>
      //     </Card>
      //     <Card sx={{
      //       width: '30%', marginBottom: '1rem', backgroundColor: 'white', boxShadow: '0px 0px 20px 5px rgba(0, 0, 0, 0.1)',
      //       borderRadius: '10px',
      //     }}>
      //       <CardContent>
      //         <Typography style={{ fontSize: 30, justifyContent: 'center', display: 'flex', color: '#EA7738' }}
      //           gutterBottom>
      //           {approvedCount}
      //         </Typography>
      //         <Typography style={{ color: '#EA7738', justifyContent: 'center', display: 'flex' }}>
      //           Approved Application
      //         </Typography>
      //       </CardContent>
      //     </Card>

      //     <Card sx={{
      //       width: '30%', marginBottom: '1rem', backgroundColor: 'white', boxShadow: '0px 0px 20px 5px rgba(0, 0, 0, 0.1)',
      //       borderRadius: '10px',
      //     }}>
      //       <CardContent>
      //         <Typography style={{ fontSize: 30, justifyContent: 'center', display: 'flex', color: '#EA7738' }}
      //           gutterBottom>
      //           {directBhawanAnugya}
      //         </Typography>
      //         <Typography style={{ color: '#EA7738', justifyContent: 'center', display: 'flex' }}>
      //           Direct Bhawan Anugya
      //         </Typography>
      //       </CardContent>
      //     </Card>

      //     {/* Additional Typography components */}

      //     <Card sx={{
      //       width: '30%', marginBottom: '1rem', backgroundColor: 'white', boxShadow: '0px 0px 20px 5px rgba(0, 0, 0, 0.1)',
      //       borderRadius: '10px',
      //     }}>
      //       <CardContent>
      //         <Typography style={{ fontSize: 30, justifyContent: 'center', display: 'flex', color: '#EA7738' }}
      //           gutterBottom>
      //           {inprogressCount}/{citizenApprovalInProcessCount}
      //         </Typography>
      //         <Typography style={{ color: '#EA7738', justifyContent: 'center', display: 'flex' }}>
      //           Architect / Citizen Inprocess
      //         </Typography>
      //       </CardContent>
      //     </Card>

      //     <Card sx={{
      //       width: '30%', marginBottom: '1rem', backgroundColor: 'white', boxShadow: '0px 0px 20px 5px rgba(0, 0, 0, 0.1)',
      //       borderRadius: '10px',
      //     }}>
      //       <CardContent>
      //         <Typography style={{ fontSize: 30, justifyContent: 'center', display: 'flex', color: '#EA7738' }}
      //           gutterBottom>
      //           {departmentInProcessCount}
      //         </Typography>
      //         <Typography style={{ color: '#EA7738', justifyContent: 'center', display: 'flex' }}>
      //           Department Inprocess
      //         </Typography>
      //       </CardContent>
      //     </Card>
      //     <Card sx={{
      //       width: '30%', marginBottom: '1rem', backgroundColor: 'white', boxShadow: '0px 0px 20px 5px rgba(0, 0, 0, 0.1)',
      //       borderRadius: '10px',
      //     }}>
      //       <CardContent>
      //         <Typography style={{ fontSize: 30, justifyContent: 'center', display: 'flex', color: '#EA7738' }}
      //           gutterBottom>
      //           {applFeePending}
      //         </Typography>
      //         <Typography style={{ color: '#EA7738', justifyContent: 'center', display: 'flex' }}>
      //           Pre Fee Pending
      //         </Typography>
      //       </CardContent>
      //     </Card>
      //     <Card sx={{
      //       width: '30%', marginBottom: '1rem', backgroundColor: 'white', boxShadow: '0px 0px 20px 5px rgba(0, 0, 0, 0.1)',
      //       borderRadius: '10px',
      //     }}>
      //       <CardContent>
      //         <Typography style={{ fontSize: 30, justifyContent: 'center', display: 'flex', color: '#EA7738' }}
      //           gutterBottom>
      //           {sancFeePending}
      //         </Typography>
      //         <Typography style={{ color: '#EA7738', justifyContent: 'center', display: 'flex' }}>
      //           Post Fee Pending
      //         </Typography>
      //       </CardContent>
      //     </Card>
      //     <Card sx={{
      //       width: '30%', marginBottom: '1rem', backgroundColor: 'white', boxShadow: '0px 0px 20px 5px rgba(0, 0, 0, 0.1)',
      //       borderRadius: '10px',
      //     }}>
      //       <CardContent>
      //         <Typography style={{ fontSize: 30, justifyContent: 'center', display: 'flex', color: '#EA7738' }}
      //           gutterBottom>
      //           {rejectedCount}
      //         </Typography>
      //         <Typography style={{ color: '#EA7738', justifyContent: 'center', display: 'flex' }}>
      //           Rejected Cases
      //         </Typography>
      //       </CardContent>
      //     </Card>
      //   </div>

      //   <Box flex="6" marginBottom={2}>
      //     <Alert severity="info" sx={{ maxWidth: 1300, padding: '1rem', justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      //       <Typography variant="h6" align="center">Notice</Typography>
      //       <Typography variant="body1" align="center">*Grievance Redressal Number - 1100 (Toll Free)</Typography>
      //       <Typography variant="body1" align="center">Install WhatsApp application on your mobile and click on <a href="#">CLICK HERE</a></Typography>
      //       <Typography variant="body1" align="center">Inside that, you will get links to join WhatsApp group of BPMS Support of all municipal corporation, add yourself in your respective municipal corporation by clicking on it</Typography>
      //     </Alert>

      //   </Box>

      // </Route>
      <Route key={index} path={`${path}/${code.toLowerCase()}-home`}>
        <div className="moduleLinkHomePage">
          <img src={bannerImage || stateInfo?.bannerUrl} alt="noimagefound" />
          {/* <BackButton className="moduleLinkHomePageBackButton" /> */}
          {/* <h1>{t("MODULE_" + code.toUpperCase())}</h1> */}
        </div>
        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }}>
          <Box flex="3" className="leftColumn">
            <Chip
              label="Welcome to Faecal Desludging Service System!"
              style={{ width: "100%", maxWidth: 500, color: "white", backgroundColor: "#f47738", marginTop: 20, fontSize: 19 }}
            />
            <Typography
              variant="body1"
              style={{
                fontFamily: "Sans-serif",
                color: "#444444",
                padding: 10,
                marginTop: 10,
                marginRight: 40,
                fontSize: 20,
                textAlign: "justify",
              }}
              component="div" // This is important to allow nested <ul> to render properly
            >
              <ul style={{ paddingLeft: "1.2em", listStyleType: "disc", margin: 0 }}>
                <li style={{ marginBottom: "0.5em" }}>
                  Desludging is a service that involves the collection of faecal sludge, which is material that is collected from septic tanks or pit
                  latrines.
                </li>
                <li style={{ marginBottom: "0.5em" }}>
                  The desludging module allows citizens to create applications for desludging, paying the fees for the service delivery online.
                </li>
                <li style={{ marginBottom: "0.5em" }}>The module makes it easier to operate and manage a desludging service.</li>
                <li style={{ marginBottom: "0.5em" }}>
                  It eliminates the current manual process by streamlining and capturing information end-to-end, ensuring waste pick-up and disposal
                  at the correct treatment plant.
                </li>
                <li>
                  This ensures a better citizen service experience with the Urban Local Body (ULB) while promoting a cleaner and healthier
                  environment.
                </li>
              </ul>
            </Typography>

            {/* if not responsive remove marginnRight of above*/}
          </Box>
          <Box flex="1" className="rightColumn">
            <div className="moduleLinkHomePageModuleLinks">
              <Links key={index} matchPath={`/fsm-ui/citizen/${code.toLowerCase()}`} userType={"citizen"} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", width: "1000%" }}></div>
          </Box>
        </Box>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
          <Card
            sx={{
              width: "30%",
              marginBottom: "1rem",
              backgroundColor: "white",
              boxShadow: "0px 0px 20px 5px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
          >
            <CardContent>
              <Typography style={{ fontSize: 30, justifyContent: "center", display: "flex", color: "#EA7738" }} gutterBottom>
                {0}
              </Typography>
              <Typography style={{ color: "#EA7738", justifyContent: "center", display: "flex" }}>Total Request</Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              width: "30%",
              marginBottom: "1rem",
              backgroundColor: "white",
              boxShadow: "0px 0px 20px 5px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
          >
            <CardContent>
              <Typography style={{ fontSize: 30, justifyContent: "center", display: "flex", color: "#EA7738" }} gutterBottom>
                {0}
              </Typography>
              <Typography style={{ color: "#EA7738", justifyContent: "center", display: "flex" }}>Work Progress</Typography>
            </CardContent>
          </Card>
          <Card
            sx={{
              width: "30%",
              marginBottom: "1rem",
              backgroundColor: "white",
              boxShadow: "0px 0px 20px 5px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
          >
            <CardContent>
              <Typography style={{ fontSize: 30, justifyContent: "center", display: "flex", color: "#EA7738" }} gutterBottom>
                {0}
              </Typography>
              <Typography style={{ color: "#EA7738", justifyContent: "center", display: "flex" }}>Request Completed</Typography>
            </CardContent>
          </Card>
        </div>

        <Box flex="6" marginBottom={2}>
          <Alert
            severity="info"
            sx={{ maxWidth: 1300, padding: "1rem", justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <Typography variant="h6" align="center">
              Notice
            </Typography>
            <Typography variant="body1" align="center">
              *Grievance Redressal Number - 1100 (Toll Free)
            </Typography>
            <Typography variant="body1" align="center">
              Install WhatsApp application on your mobile and click on <a href="#">CLICK HERE</a>
            </Typography>
            <Typography variant="body1" align="center">
              Inside that, you will get links to join WhatsApp group of BPMS Support of all municipal corporation, add yourself in your respective
              municipal corporation by clicking on it
            </Typography>
          </Alert>
        </Box>
      </Route>
    );
  });

  return (
    <div className={classname}>
      <TopBarSideBar
        t={t}
        stateInfo={stateInfo}
        userDetails={userDetails}
        CITIZEN={CITIZEN}
        cityDetails={cityDetails}
        mobileView={mobileView}
        handleUserDropdownSelection={handleUserDropdownSelection}
        logoUrl={logoUrl}
        showSidebar={true}
      />
      <div
        className={"main center-container mb-25"}
        style={
          location?.pathname === "/fsm-ui/citizen/select-location" ||
          location?.pathname === "/fsm-ui/citizen/register/name" ||
          location?.pathname === "/fsm-ui/citizen/register/otp" ||
          location?.pathname === "/fsm-ui/citizen/select-language" ||
          location?.pathname === "/fsm-ui/citizen/login/otp" ||
          location?.pathname === "/fsm-ui/citizen/login"
            ? {
                // backgroundImage: `url("https://try-digit-eks-yourname.s3.ap-south-1.amazonaws.com/background_pic1.png")`, width: '100%', backgroundRepeat: 'no-repeat', height: 'auto'
                // backgroundImage: `url("https://try-digit-eks-yourname.s3.ap-south-1.amazonaws.com/banner1.png")`,
                backgroundImage: `url("https://try-digit-eks-yourname.s3.ap-south-1.amazonaws.com/fsm_login_bg.png")`,
                width: "100%",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                height: "auto",
                // opacity: 0.5,
              }
            : {}
        }
      >
        <Switch>
          <Route exact path={path}>
            <CitizenHome />
          </Route>

          <Route exact path={`${path}/select-language`}>
            <LanguageSelection />
          </Route>

          <Route exact path={`${path}/select-location`}>
            <LocationSelection />
          </Route>

          <Route path={`${path}/all-services`}>
            <AppHome userType="citizen" modules={modules} />
          </Route>

          <Route path={`${path}/login`}>
            <Login stateCode={stateCode} />
          </Route>

          <Route path={`${path}/register`}>
            <Login stateCode={stateCode} isUserRegistered={false} />
          </Route>

          <Route path={`${path}/user/profile`}>
            <UserProfile stateCode={stateCode} userType={"citizen"} cityDetails={cityDetails} />
          </Route>
          <Route path={`${path}/obps-search`}>
            <DashboardApplicationSearch />
          </Route>

          <ErrorBoundary>
            {appRoutes}
            {ModuleLevelLinkHomePages}
          </ErrorBoundary>
        </Switch>
      </div>
      <div style={{ width: "100%", bottom: 0 }}>
        <div style={{ display: "flex", justifyContent: "center", color: "#22394d", height: "auto" }}>
          <img
            style={{ cursor: "pointer", display: "inline-flex", height: "1.4em" }}
            alt={"Powered by UPYOG"}
            src={`${sourceUrl}/digit-footer+copy.png`}
            onError={"this.src='./../digit-footer+copy.png'"}
            onClick={() => {
              window.open("https://upyog.niua.org/", "_blank").focus();
            }}
          ></img>
          <span style={{ margin: "0 10px" }}>|</span>
          <span
            style={{ cursor: "pointer", fontSize: "16px", fontWeight: "400" }}
            onClick={() => {
              window.open("https://niua.in/", "_blank").focus();
            }}
          >
            Copyright © 2022 National Institute of Urban Affairs
          </span>
          <span style={{ margin: "0 10px" }}>|</span>
          <a style={{ cursor: "pointer", fontSize: "16px", fontWeight: "400" }} href={pdfUrl} target="_blank">
            Developed by{" "}
          </a>
          <img
            style={{ cursor: "pointer", display: "inline-flex", height: "1.4em" }}
            alt={"Developed By Entit Consulatncy Services"}
            src={`${sourceUrl}/entit-logo.png`}
            onError={"this.src='./../entit-logo.png'"}
            onClick={() => {
              window.open("https://www.entitcs.com/", "_blank").focus();
            }}
          ></img>
        </div>
      </div>
    </div>
  );
};

export default Home;
