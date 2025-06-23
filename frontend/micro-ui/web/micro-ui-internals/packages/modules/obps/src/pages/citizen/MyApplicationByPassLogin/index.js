import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, KeyNote, Loader, SubmitBar, Header } from "@upyog/digit-ui-react-components";
import { Fragment } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { getBPAFormData } from "../../../utils/index";

const getServiceType = () => {
  return `BPA_APPLICATIONTYPE_BUILDING_PLAN_SCRUTINY`;
};

const MyApplicationByPassLogin = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  // const [decryptionDone, setDecryptionDone] = useState(false);
  const [user, setUser] = useState(null);
  const [finalData, setFinalData] = useState([]);
  const [swsUserDetails, setSwsUserDetails] = useState(null);
  // const [swsUserDetails, setSwsUserDetails] = useState({
  //   "name":"",
  //   "mobileNumber":"",
  //   "emailId":""
  // });
  const location = useLocation();
  // Function to parse the query string
  const getQueryParams = (query) => {
    return new URLSearchParams(query);
  };

  const queryParams = getQueryParams(location.search);
  const enryptedUserDetails = queryParams.get("userDetails"); // Get the 'userDetails' parameter

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
  };

  useEffect(async () => {
    const text = "cAvv1qnzPFMJfF0KW8RtfzXuv0V1/gzBDbZ9T5FEoNvbGjnH7/Vpm6eCQH87ibdBzlsbkBYUN8trJ22pkAoVvQ==";
    // console.log("Hellooooo")
    const decryptionRequest = {
      encryptedSwsUser: enryptedUserDetails,
    };

    // console.log("decryptionRequest"+JSON.stringify(decryptionRequest));
    const decryptionResponse = await Digit.UserService.decryptForSws(decryptionRequest);
    // const usersResponse = await Digit.OBPSService.decryptForSws(decryptionRequest);
    // console.log("Decrypted :" + usersResponse);
    const userDetails = decryptionResponse.split("#");
    // console.log("users1"+users1);
    const user1 = {
      name: userDetails[0],
      mobileNumber: userDetails[1],
      emailId: userDetails[2],
      enterpriseName: userDetails[3],
      unitRegistrationNo: userDetails[4],
      SwsApplicationId: userDetails[5],
      ulbName: userDetails[6],
    };
    // setSwsUserDetails({
    //   name: userDetails[0],
    //   mobileNumber: userDetails[1],
    //   emailId: userDetails[2]
    // });
    setSwsUserDetails(user1);
    // setuserDetails(usersResponse);
  }, []);

  // console.log("userDetails" + JSON.stringify(swsUserDetails));

  useEffect(async () => {
    try {
      if (!swsUserDetails) {
        return;
      }
      // console.log("userDetails" + JSON.stringify(swsUserDetails));
      // console.log(swsUserDetails.mobileNumber)
      const requestData = {
        // username: swsUserDetails.mobileNumber,
        username: 6464646479,
        password: 123456,
        //tenantId: stateCode,
        tenantId: swsUserDetails.ulbName,
        userType: "citizen",
      };

      // console.log("userDetails" + JSON.stringify(userDetails));

      const { ResponseInfo, UserRequest: info, ...tokens } = await Digit.UserService.authenticate(requestData);
      console.log("info "+JSON.stringify(info));

      const usersResponse1 = await Digit.UserService.userSearch(info?.tenantId, { uuid: [info?.uuid] }, {});

      setUser({ info, ...tokens });
      setLoading(false);
    } catch (err) {
      // setError(err);
    }
    // finally {

    // }
  }, [swsUserDetails]);
  // }

  useEffect(() => {
    if (!user) {
      return;
    }
    Digit.SessionStorage.set("citizen.userRequestObject", user);
    Digit.UserService.setUser(user);
    setCitizenDetail(user?.info, user?.access_token, user?.info?.tenantId);
    Digit.SessionStorage.set("CITIZEN.COMMON.HOME.CITY", { code: user?.info?.tenantId });
  }, [user]);

  const history = useHistory();

  const [labelMessage, setLableMessage] = useState(false);
  const tenantId = Digit.ULBService.getCitizenCurrentTenant();

  const userInfo = Digit.UserService.getUser();
  const requestor = userInfo?.info?.mobileNumber;
  const { data: bpaData, isLoading: isBpaSearchLoading, revalidate: bpaRevalidate } = Digit.Hooks.obps.useBPASearch(tenantId, {
    requestor,
    limit: -1,
    offset: 0,
  });
  const { isMdmsLoading, data: mdmsData } = Digit.Hooks.obps.useMDMS(Digit.ULBService.getStateId(), "BPA", ["RiskTypeComputation"]);

  useEffect(() => {
    return () => {
      setFinalData([]);
      revalidate?.();
      bpaRevalidate?.();
    };
  }, []);

  useEffect(() => {
    if (!isBpaSearchLoading) {
      let searchConvertedArray = [];
      let sortConvertedArray = [];

      if (bpaData?.length) {
        bpaData?.forEach((bpaDta) => {
          bpaDta.sortNumber = 0;
          bpaDta.modifiedTime = bpaDta.auditDetails.lastModifiedTime;
          bpaDta.type = "BPA";
          searchConvertedArray.push(bpaDta);
        });
      }
      sortConvertedArray = [].slice.call(searchConvertedArray).sort(function (a, b) {
        return new Date(b.modifiedTime) - new Date(a.modifiedTime) || a.sortNumber - b.sortNumber;
      });
      setFinalData(sortConvertedArray);
      let userInfos = sessionStorage.getItem("Digit.citizen.userRequestObject");
      const userInfoDetails = userInfos ? JSON.parse(userInfos) : {};
      if (userInfoDetails?.value?.info?.roles?.length == 1 && userInfoDetails?.value?.info?.roles?.[0]?.code == "CITIZEN") setLableMessage(true);
    }
  }, [isBpaSearchLoading, bpaData]);

  if (isBpaSearchLoading) {
    return <Loader />;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <Fragment>
      <Header>{`${t("BPA_MY_APPLICATIONS")} (${finalData?.length})`}</Header>
      {finalData?.map((application, index) => {
        return (
          <Card key={index}>
            <KeyNote keyValue={t("BPA_APPLICATION_NUMBER_LABEL")} note={application?.applicationNo} />
            <KeyNote
              keyValue={t("BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL")}
              note={application?.businessService !== "BPA_OC" ? t(`WF_BPA_BUILDING_PLAN_SCRUTINY`) : t(`WF_BPA_BUILDING_OC_PLAN_SCRUTINY`)}
            />
            <KeyNote keyValue={t("BPA_COMMON_SERVICE")} note={t(`BPA_SERVICETYPE_NEW_CONSTRUCTION`)} />
            <KeyNote
              keyValue={t("TL_COMMON_TABLE_COL_STATUS")}
              note={t(`WF_BPA_${application?.state}`)}
              noteStyle={application?.status === "APPROVED" ? { color: "#00703C" } : { color: "#D4351C" }}
            />
            <KeyNote keyValue={t("BPA_COMMON_SLA")} note={application?.sla} />
            {application.action === "SEND_TO_ARCHITECT" || application.status !== "INITIATED" ? (
              <Link to={{ pathname: `/digit-ui/citizen/obps/bpa/${application?.applicationNo}`, state: { tenantId: "" } }}>
                <SubmitBar label={t("TL_VIEW_DETAILS")} />
              </Link>
            ) : (
              <div>
                {labelMessage ? (
                  <Link to={{ pathname: `/digit-ui/citizen/obps/bpa/${application?.applicationNo}`, state: { tenantId: "" } }}>
                    <SubmitBar label={t("TL_VIEW_DETAILS")} />
                  </Link>
                ) : (
                  <SubmitBar label={t("BPA_COMP_WORKFLOW")} onSubmit={() => getBPAFormData(application, mdmsData, history, t)} />
                )}
              </div>
            )}
          </Card>
        );
      })}
    </Fragment>
  );
};

export default MyApplicationByPassLogin;
