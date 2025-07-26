import React, { useState, useEffect } from "react";
import { Dropdown, FormStep, Loader, RadioOrSelect, CardText } from "@upyog/digit-ui-react-components";

const SelectVendor = ({ t, config, onSelect, formData, userType }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [vendor, setVendor] = useState([]);
  const [vendorsOption, setVendorsOption] = useState([]);
  // const [vendorData, setVendorData] = useState([]);
  // const [selectedVehicle, setSelectedVehicle] = useState();
  const [selectedOption, setSelectedOption] = useState({});

  // const {
  //   data: vendorData1,
  //   isLoading: isVendorLoading,
  //   isSuccess: isVendorSuccess,
  //   error: vendorError,
  //   refetch: refetchVendor,
  // } = Digit.Hooks.fsm.useDsoSearch(tenantId, { sortBy: "name", sortOrder: "ASC", status: "ACTIVE" }, { enabled: false });

  useEffect(() => {
  const VendorDetails = async () => {
    const vendorDetails = await Digit.FSMService.vendorSearch(tenantId, { sortBy: "name", sortOrder: "ASC", status: "ACTIVE" });
    if (vendorDetails) {
          setVendorsOption(vendorDetails?.vendor);
        }
    // return vendorDetails;
  };
  VendorDetails();
  }, []);
  // console.log("VendorDetails " + JSON.stringify(VendorDetails));


  // console.log("vendorData " + JSON.stringify(vendorData ));
  // console.log("setVendorsOption " + JSON.stringify(setVendorsOption ));
  

  //   useEffect(() => { async () => {
  //   console.log("111111111111");
  //   const vendorDetails = await FSMService.vendorSearch(tenantId, { sortBy: "name", sortOrder: "ASC", status: "ACTIVE" });
  //   return vendorDetails;
  //   // setVendorData(vendorDetails);
  // };}, []);

  // useEffect(() => {
  //   if (vendorData) {
  //     let vendors = vendorData.map((data) => data.dsoDetails);
  //     setVendorsOption(vendors);
  //   }
  // }, [vendorData]);

  
  const selectVendor = (value) => {
    setVendor(value);
    if (userType === "employee") {
      onSelect(config.key, value);
      onSelect("vendorDetail", null);
    }
  };

  if (userType === "employee") {
    return (
      <div>
        {/* <CardText>{t(`ES_FSM_REGISTRY_SELECT_VEHICLE`)}</CardText> */}
        <Dropdown t={t} option={vendorsOption} value={selectedOption} selected={vendor} select={selectVendor} optionKey={"name"} />
      </div>
    );
  }
  return (
    <React.Fragment>
      <FormStep config={config} onSelect={onSubmit} onSkip={onSkip} isDisabled={!genderType} t={t}>
        {/* <CardText>{t(`ES_FSM_REGISTRY_SELECT_VENDOR`)}</CardText> */}
        <Dropdown
          t={t}
          option={vendorsOption}
          value={selectedOption}
          selected={vendor}
          select={selectVendor}
          optionKey={"name"}
        />
      </FormStep>
    </React.Fragment>
  );
};

export default SelectVendor;
