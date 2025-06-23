import { PrivateRoute } from "@upyog/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, Switch, useLocation } from "react-router-dom";

const EmployeeApp = ({ path, url, userType }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const mobileView = innerWidth <= 640;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const inboxInitialState = {
    searchParams: {
      tenantId: tenantId,
    },
  };

  const HRMSResponse = Digit?.ComponentRegistryService?.getComponent("HRMSResponse");
  const HRMSDetails = Digit?.ComponentRegistryService?.getComponent("HRMSDetails");
  const Inbox = Digit?.ComponentRegistryService?.getComponent("HRInbox");
  const CreateEmployee = Digit?.ComponentRegistryService?.getComponent("HRCreateEmployee");
  const EditEmpolyee = Digit?.ComponentRegistryService?.getComponent("HREditEmpolyee");
  const PayTypeRate = Digit?.ComponentRegistryService?.getComponent("PayTypeRate");
  const EdcrRuleEntry = Digit?.ComponentRegistryService?.getComponent("EdcrRuleEntry");
  const SlabEntry = Digit?.ComponentRegistryService?.getComponent("SlabEntry");
  const ProptymasterEntry = Digit?.ComponentRegistryService?.getComponent("ProptymasterEntry");
  const CateEntry = Digit?.ComponentRegistryService?.getComponent("CateEntry");
  const SubCateEntry = Digit?.ComponentRegistryService?.getComponent("SubCateEntry");
  const PayTpEntry = Digit?.ComponentRegistryService?.getComponent("PayTpEntry");
  const ArchitectDetailsInbox = Digit?.ComponentRegistryService?.getComponent("ArchitectDetailsInbox");
  const ArchitectDetailsInbox1 = Digit?.ComponentRegistryService?.getComponent("ArchitectDetailsInbox1");
  const ArchitectDetailsInbox2 = Digit?.ComponentRegistryService?.getComponent("ArchitectDetailsInbox2");
  const UpdateBillAmount = Digit?.ComponentRegistryService?.getComponent("UpdateBillAmount");
  
  
  return (
    <Switch>
      <React.Fragment>
        <div className="ground-container">
          <p className="breadcrumb" style={{ marginLeft: mobileView ? "2vw" : "revert" }}>
            <Link to="/digit-ui/employee" style={{ cursor: "pointer", color: "#666" }}>
              {t("HR_COMMON_BUTTON_HOME")}
            </Link>{" "}
            / <span>{location.pathname === "/digit-ui/employee/hrms/inbox" ? t("HR_COMMON_HEADER") : t("HR_COMMON_HEADER")}</span>
          </p>
          <PrivateRoute
            path={`${path}/architectdetailsinbox`}
            component={() => (
              <ArchitectDetailsInbox  />
            )}
          />
          <PrivateRoute
            path={`${path}/inbox`}
            component={() => (
              <Inbox parentRoute={path} businessService="hrms" filterComponent="HRMS_INBOX_FILTER" initialStates={inboxInitialState} isInbox={true} />
            )}
          />
          <PrivateRoute path={`${path}/create`} component={() => <CreateEmployee />} />
          <PrivateRoute path={`${path}/response`} component={(props) => <HRMSResponse {...props} parentRoute={path} />} />
          {/* add by manisha yadu for pattyperate entry */}
          <PrivateRoute path={`${path}/rateEntry`} component={()=><PayTypeRate/>} />
          <PrivateRoute path={`${path}/slabEntry`} component={()=><SlabEntry/>} />
          <PrivateRoute path={`${path}/details/:tenantId/:id`} component={() => <HRMSDetails />} />
          <PrivateRoute path={`${path}/edit/:tenantId/:id`} component={() => <EditEmpolyee />} />
          <PrivateRoute path={`${path}/proptymaster`} component={()=><ProptymasterEntry/>} />
          <PrivateRoute path={`${path}/cateEntry`} component={()=><CateEntry/>}/>
          <PrivateRoute path={`${path}/subcateEntry`} component={()=><SubCateEntry/>}/>
          <PrivateRoute path={`${path}/paytyEntry`} component={()=><PayTpEntry/>}/>
          <PrivateRoute path={`${path}/edcrRuleEntry`} component={()=><EdcrRuleEntry/>} />
          <PrivateRoute path={`${path}/paymentAmountUpdate`} component={()=><UpdateBillAmount/>} />
        </div>
      </React.Fragment>
    </Switch>
  );
};

export default EmployeeApp;
