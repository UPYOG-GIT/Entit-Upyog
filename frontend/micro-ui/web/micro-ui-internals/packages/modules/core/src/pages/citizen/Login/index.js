import React, { useEffect, useMemo, useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { AppContainer, PageBasedInput, BackButton, Card, Toast, LabelPageBasedInput, CardHeader, CardText, SearchOnRadioButtons, CardLabelError, Dropdown } from "@upyog/digit-ui-react-components";
import { Route, Switch, useHistory, useRouteMatch, useLocation } from "react-router-dom";
import { loginSteps } from "./config";
import SelectMobileNumber from "./SelectMobileNumber";
import SelectOtp from "./SelectOtp";
import SelectName from "./SelectName";
import Typography from "@material-ui/core/Typography";
import { TextField, Button, InputLabel, MenuItem, Box } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import useInterval from "../../../hooks/useInterval";


const TYPE_REGISTER = { type: "register" };
const TYPE_LOGIN = { type: "login" };
const DEFAULT_USER = "digit-user";
const DEFAULT_REDIRECT_URL = "/digit-ui/citizen";

/* set citizen details to enable backward compatiable */
const setCitizenDetail = (userObject, token, tenantId) => {
  let locale = JSON.parse(sessionStorage.getItem("Digit.initData"))?.value?.selectedLanguage;
  localStorage.setItem("Citizen.tenant-id", tenantId);
  localStorage.setItem("tenant-id", tenantId);
  localStorage.setItem("citizen.userRequestObject", JSON.stringify(userObject));
  localStorage.setItem("locale", locale);
  localStorage.setItem("Citizen.locale", locale);
  localStorage.setItem("token", token);
  localStorage.setItem("Citizen.token", token);
  localStorage.setItem("user-info", JSON.stringify(userObject));
  localStorage.setItem("Citizen.user-info", JSON.stringify(userObject));
}

const getFromLocation = (state, searchParams) => {

  return state?.from || searchParams?.from || DEFAULT_REDIRECT_URL;

};



const Login = ({ stateCode, isUserRegistered = true }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { path, url } = useRouteMatch();
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isOtpValid, setIsOtpValid] = useState(true);
  const [tokens, setTokens] = useState(null);
  const [params, setParmas] = useState(isUserRegistered ? {} : location?.state?.data);
  const [errorTO, setErrorTO] = useState(null);

  const searchParams = Digit.Hooks.useQueryParams();

  // // Function to parse the query string
  // const getQueryParams = (query) => {
  //   return new URLSearchParams(query);
  // };

  // const queryParams = getQueryParams(location.search);
  // const token = queryParams.get('token'); // Get the 'token' parameter

  // console.log("token "+token);

  const [isSignup, setSignup] = useState(false);

  const [mobileNumber, setMobileNumber] = useState();
  const [otp, setOtp] = useState();
  const [name, setName] = useState();
  const [guardianName, setGuardianName] = useState();
  const { data: cities, isLoading } = Digit.Hooks.useTenants();

  const [selectedCity, setSelectedCity] = useState(() => ({ code: Digit.ULBService.getCitizenCurrentTenant(true) }));
  const [showError, setShowError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40);

  const { pathname } = useLocation();

  const relationshipOptions = ["S/O", "D/O", "W/O"];
  const [relation, setRelation] = useState("");


  // console.log("city" + JSON.stringify(city))
  // console.log("cities" + JSON.stringify(cities))


  useEffect(() => {
    let errorTimeout;
    if (error) {
      if (errorTO) {
        clearTimeout(errorTO);
        setErrorTO(null);
      }
      errorTimeout = setTimeout(() => {
        setError("");
      }, 5000);
      setErrorTO(errorTimeout);
    }
    return () => {
      errorTimeout && clearTimeout(errorTimeout);
    };
  }, [error]);

  useEffect(() => {
    if (!user) {
      return;
    }
    Digit.SessionStorage.set("citizen.userRequestObject", user);
    Digit.UserService.setUser(user);
    setCitizenDetail(user?.info, user?.access_token, selectedCity?.code)
    const redirectPath = location.state?.from || DEFAULT_REDIRECT_URL;
    history.replace(redirectPath);
  }, [user]);

  const stepItems = useMemo(() =>
    loginSteps.map(
      (step) => {
        const texts = {};
        for (const key in step.texts) {
          texts[key] = t(step.texts[key]);
        }
        return { ...step, texts };
      },
      [loginSteps]
    )
  );

  const handleResendOtp = () => {
    onResend();
    setTimeLeft(2);
  };

  useInterval(
    () => {
      setTimeLeft(timeLeft - 1);
    },
    timeLeft > 0 ? 1000 : null
  );

  const getUserType = () => Digit.UserService.getType();

  const handleOtpChange = (otp) => {
    setOtp(otp.target.value);
  };

  const handleMobileChange = (e) => {
    // const { value } = event.target;
    // setMobileNumber(e.target.value);

    const newValue = e.target.value;
    setMobileNumber(newValue);
    if (newValue.length < 10 || newValue < 10) {
      setError(true);
    } else {
      setError(false);
    }

  };

  const handleNameChange = (e) => {
    // const { value } = event.target;
    // setName(e.target.value);

    const value = e.target.value;
    const trimmedValue = value.replace(/\s+/g, ' ');
    const isValid = /^[A-Za-z ]*$/.test(trimmedValue);

    if (isValid) {
      // Update the name state or perform any other necessary actions
      const titleCaseValue = trimmedValue.toLowerCase().replace(/(^|\s)\w/g, (match) => match.toUpperCase());
      setName(titleCaseValue);
    } else {
      // Display an error message or handle invalid input
      title: t("TL_NAME_ERROR_MESSAGE");
    }
  };

  const handleGuardianNameChange = (e) => {
    // const { value } = event.target;
    // setName(e.target.value);

    const value = e.target.value;
    const trimmedValue = value.replace(/\s+/g, ' ');
    const isValid = /^[A-Za-z ]*$/.test(trimmedValue);

    if (isValid) {
      // Update the name state or perform any other necessary actions
      const titleCaseValue = trimmedValue.toLowerCase().replace(/(^|\s)\w/g, (match) => match.toUpperCase());
      setGuardianName(titleCaseValue);
    } else {
      // Display an error message or handle invalid input
      title: t("TL_NAME_ERROR_MESSAGE");
    }

   
  
  };

  const selectMobileNumber = async () => {
    // setParmas({ ...params, mobileNumber });
    const data = {
      mobileNumber,
      //tenantId: stateCode,
      tenantId: selectedCity?.code,
      userType: getUserType(),
    };

    Digit.SessionStorage.set("CITIZEN.COMMON.HOME.CITY", selectedCity);

    if (isUserRegistered) {
      const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_LOGIN } });

      if (!err) {
        // Store the timestamp when OTP is sent
        const sentTimestamp = Date.now();
        history.replace(`${path}/otp`, {
          from: getFromLocation(location.state, searchParams),
          role: location.state?.role,
          sentTimestamp: sentTimestamp,
        });
        // console.log("DateTime" + Date.now())
        return;
      } else {
        if (!(location.state && location.state.role === "FSM_DSO")) {
          history.push(`/digit-ui/citizen/register/name`, {
            from: getFromLocation(location.state, searchParams),
            data: data,
          });
        }
      }
      if (location.state?.role) {
        setError(
          location.state?.role === "FSM_DSO"
            ? t("ES_ERROR_DSO_LOGIN")
            : "User not registered."
        );
      }
    } else {
      const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_REGISTER } });
      if (!err) {
        // Store the timestamp when OTP is sent
        const sentTimestamp = Date.now();
        history.replace(`${path}/otp`, {
          from: getFromLocation(location.state, searchParams),
          sentTimestamp: sentTimestamp,
        });
        return;
      }
    }
  };




  const selectName = async () => {

    let par = location?.state?.data;
    setParmas({ ...par, name });
    const data = {
      ...par,
      //tenantId: stateCode,
      tenantId: selectedCity?.code,
      userType: getUserType(),
      name
    };

    //setParmas({ ...par, name });

    const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_REGISTER } });
    if (res) {
      history.replace(`${path}/otp`, { from: getFromLocation(location.state, searchParams) });
    }

  };



  const concatGuardianName = relation + " " + guardianName;
  // console.log("concatGuardianName" + concatGuardianName); 
  const selectOtp = async () => {

    try {
      setIsOtpValid(true);
      const sentTimestamp = location.state?.sentTimestamp;

      if (sentTimestamp && Date.now() - sentTimestamp > 5 * 60 * 1000) {
        setIsOtpValid(false);
        return;
      }

      //const { mobileNumber, otp, name } = params;

      if (isUserRegistered) {

        const requestData = {
          username: mobileNumber,
          password: otp,
          //tenantId: stateCode,
          tenantId: selectedCity?.code,
          userType: getUserType(),
        };


        const { ResponseInfo, UserRequest: info, ...tokens } = await Digit.UserService.authenticate(requestData);
        // console.log("info :"+JSON.stringify(info));
        const usersResponse1 = await Digit.UserService.userSearch(info?.tenantId, { uuid: [info?.uuid] }, {});

        // console.log("usersResponse11: " + JSON.stringify(usersResponse1));
        if (usersResponse1 && usersResponse1.user[0].roles.length > 1 && usersResponse1.user && usersResponse1.user.length) {
          const date = usersResponse1?.user[0]?.validityDate;
          const dateTimeParts = date.split(/[- :]/);
          const dateTimeObject = new Date(dateTimeParts[2], dateTimeParts[1] - 1, dateTimeParts[0], dateTimeParts[3], dateTimeParts[4], dateTimeParts[5]);
          info.validityDate = dateTimeObject.getTime();
        } else {
          info.validityDate = null;
        }


        if (location.state?.role) {

          const roleInfo = info.roles.find((userRole) => userRole.code === location.state.role);


          if (!roleInfo || !roleInfo.code) {

            setError(t("ES_ERROR_USER_NOT_PERMITTED"));
            setTimeout(() => history.replace(DEFAULT_REDIRECT_URL), 5000);
            return;
          }
        }
        if (window?.globalConfigs?.getConfig("ENABLE_SINGLEINSTANCE")) {
          //info.tenantId = Digit.ULBService.getStateId();
          info.tenantId = selectedCity?.code;
        }
        // console.log("info1 :"+JSON.stringify(info));
        setUser({ info, ...tokens });

      } else if (!isUserRegistered) {
        const requestData = {
          name,
          guardian: concatGuardianName,
          username: mobileNumber,
          otpReference: otp,
          //tenantId: stateCode,
          tenantId: selectedCity?.code,
        };

        const { ResponseInfo, UserRequest: info, ...tokens } = await Digit.UserService.registerUser(requestData, stateCode);

        if (window?.globalConfigs?.getConfig("ENABLE_SINGLEINSTANCE")) {
          //info.tenantId = Digit.ULBService.getStateId();
          info.tenantId = selectedCity?.code;
        }

        setUser({ info, ...tokens });
      }
    } catch (err) {
      setIsOtpValid(false);
    }
  };

  const resendOtp = async () => {
    // const { mobileNumber } = params;
    const data = {
      mobileNumber,
      //tenantId: stateCode,
      tenantId: selectedCity?.code,
      userType: getUserType(),

    };
    // console.log("data------" + JSON.stringify(data));
    if (!isUserRegistered) {
      const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_REGISTER } });
    } else if (isUserRegistered) {
      const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_LOGIN } });
    }
  };

  const sendOtp = async (data) => {
    try {
      const res = await Digit.UserService.sendOtp(data, stateCode);
      return [res, null];
    } catch (err) {
      return [null, err];
    }
  };
  const handleLogin = (e) => {
    e.preventDefault();

  };

  const handleRegister = (e) => {
    e.preventDefault();

  };

  const handleSubmit = (e) => {
    e.preventDefault();

  };
  function onSubmit() {
    e.preventDefault();
    //console.log("selectedCity-----"+selectedCity);
    if (selectedCity) {
      Digit.SessionStorage.set("CITIZEN.COMMON.HOME.CITY", selectedCity);
      history.push("/digit-ui/citizen/obps-home");
    } else {
      setShowError(true);
    }
  }



  const texts = useMemo(
    () => ({
      header: t("CS_COMMON_CHOOSE_LOCATION"),
      submitBarLabel: t("CORE_COMMON_CONTINUE"),
    }),
    [t]
  );

  function selectCity(city) {
    setSelectedCity(city);
    setShowError(false);

  }

 
  return (
    <div

    //  style={{ paddingRight: '5000px'}}
    >
      <BackButton
        style={{ fontWeight: 'bold', fontSize: '1.5em', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
      <Switch>
        {/* <AppContainer> */}

        <div>
          <form >
            <Box
              display="flex"
              flexDirection={"column"}

              // width={400}
              // maxHeight='none'
              //  height='auto'
              alignItems="center"
              justifyContent={"center"}
              margin="auto"
              marginTop={5}
              padding={5}

              borderRadius={1}
              boxShadow={"5px 5px 10px #ccc"}
              sx={{
                ":hover": {
                  boxShadow: '10px 10px 20px #ccc'
                }, backgroundColor: "white", width: {
                  xs: '100%', // 0px
                  sm: '60%', // 600px
                  md: '40.33%', // 900px
                  lg: '28%', // 1200px
                  xl: '20%', // 1536px
                }

              }}

            >

              <Box display="flex" alignItems="center">
                <img src="https://try-digit-eks-yourname.s3.ap-south-1.amazonaws.com/logo.png" alt="Logo" />
                <Typography variant="h6">| Chhattisgarh</Typography>
              </Box>
              <Typography variant="h6" padding={4} style={{ marginTop: 5, padding: 4, color: '#484848', fontWeight: 500, fontSize: 16 }}>{location.pathname === '/digit-ui/citizen/register/name' || location.pathname === '/digit-ui/citizen/register/otp' ? "Register" : "Login"}</Typography>

              {location.pathname === "/digit-ui/citizen/register/name" && <TextField fullWidth
                label="Name"
                variant="standard"
                padding={5}
                margin="normal"
                value={name}
                onChange={handleNameChange}
              ></TextField>


              }
              {location.pathname === "/digit-ui/citizen/register/name" &&
                <Dropdown
                  selected={relation}
                  select={(val) => setRelation(val)}
                  style={{ width: '100%', margin: 5 }}
                  option={relationshipOptions}
                  showArrow
                  placeholder="Select"
                  autoComplete="off"

                ></Dropdown>
              }

              {location.pathname === "/digit-ui/citizen/register/name" && <TextField fullWidth
                label="Guardian Name"
                variant="standard"
                padding={5}
                margin="normal"
                value={guardianName}
                onChange={handleGuardianNameChange}
              ></TextField>
              }
              <Route path={`${path}`} exact></Route>

              <TextField
                fullWidth
                required
                style={{ padding: 5 }}
                type={"number"}
                label="Mobile Number"
                variant="standard"
                padding={5}
                margin="normal"
                value={mobileNumber}
                onChange={handleMobileChange}
                error={error}
                helperText={error ? "Invalid Mobile Number" : ""}
                inputProps={{
                  onInput: (e) => {
                    e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                  }
                }}
              />




              {location.pathname === "/digit-ui/citizen/login/otp" || location.pathname === "/digit-ui/citizen/register/otp" ? (

                <><TextField
                  fullWidth
                  required
                  label="Enter OTP"
                  style={{ padding: 5 }}
                  type={"number"}
                  variant="standard"
                  margin="normal"
                  padding={5}
                  inputProps={{
                    onInput: (e) => {
                      e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 6)
                    }
                  }}

                  value={otp}
                  onChange={handleOtpChange} /> {timeLeft > 0 ? (
                    <CardText style={{ color: "red" }}>{`${t("CS_RESEND_ANOTHER_OTP")} ${timeLeft} ${t("CS_RESEND_SECONDS")}`}</CardText>
                  ) : (
                    <p className="card-text-button" onClick={resendOtp} style={{ color: "red" }}>
                      {t("CS_RESEND_OTP")}
                    </p>
                  )}
                  {!isOtpValid && <CardLabelError>{t("CS_INVALID_OTP")}</CardLabelError>}


                </>

              ) : (

                <FormControl variant="standard" fullWidth required>
                  <InputLabel id="cities-label">Select Municipal Corporation</InputLabel>
                  <Select
                    labelId="cities-label"
                    id="cities"
                    value={selectedCity.code}
                    onChange={(e) => setSelectedCity({ code: e.target.value })}
                    label="Select City"
                    error={showError}
                  >
                    {cities &&
                      cities.map((city) => (

                        <MenuItem key={city.code} value={city.code}>
                          {city.name} {"Municipal Corporation"}
                        </MenuItem>
                      ))}
                  </Select>
                  {showError && <CardLabelError>{t("CS_CITIZEN_DETAILS_ERROR_MSG1")}</CardLabelError>}

                </FormControl>


              )}


              {location.pathname === "/digit-ui/citizen/login" ? (
                <Button
                  fullWidth
                  variant="contained"

                  onClick={selectMobileNumber}
                  style={{
                    backgroundColor: '#FE7A51',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    marginTop: '45px',
                    //marginBottom: '0px'
                  }}
                >
                  Next
                </Button>
              ) : location.pathname === "/digit-ui/citizen/register/name" ? (
                <Button
                  fullWidth
                  variant="contained"

                  onClick={selectName}
                  style={{
                    backgroundColor: '#FE7A51',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    margin: '25px',
                  }}
                >
                  Register
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={selectOtp}
                  style={{
                    backgroundColor: '#FE7A51',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    margin: '25px',
                  }}
                >
                  Continue
                </Button>
              )}



              {/* <Button
                onClick={handleButtonClick}
                style={{
                  padding: '10px 20px',
                  marginTop: '8px',
                  marginBottom: '10px'
                }}
              >
                {isSignup ? 'Login' : 'Register'}
              </Button> */}

            </Box>
          </form>
        </div>

        <Route path={`${path}`} exact>
          {/* <SelectMobileNumber
            onSelect={selectMobileNumber}
            config={stepItems[0]}
            mobileNumber={params.mobileNumber || ""}
            onMobileChange={handleMobileChange}
            showRegisterLink={isUserRegistered && !location.state?.role}
            t={t}
          /> */}

        </Route>
        <Route path={`${path}/otp`}>
          {/* <SelectOtp
            config={{ ...stepItems[1], texts: { ...stepItems[1].texts, cardText: `${stepItems[1].texts.cardText} ${params.mobileNumber || ""}` } }}
            onOtpChange={handleOtpChange}
            onResend={resendOtp}
            onSelect={selectOtp}
            otp={params.otp}
            error={isOtpValid}
            t={t}
          /> */}
        </Route>
        <Route path={`${path}/name`}>
          <SelectName config={stepItems[2]} onSelect={selectName} t={t} />
        </Route>
        {error && <Toast error={true} label={error} onClose={() => setError(null)} />}
        {/* </AppContainer> */}
      </Switch>
    </div >


  );

};

export default Login;
