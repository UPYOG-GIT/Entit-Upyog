import React, { useState, useEffect } from "react";
import { Dropdown, FormStep, Loader, RadioOrSelect, CardText } from "@upyog/digit-ui-react-components";

const SelectVehicle = ({ t, config, onSelect, formData, userType }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [vehicles, setVehicles] = useState([]);
  const [vehiclesOption, setVehiclesOption] = useState([]);
  // const [vendorId, setVendorId] = useState(null);
  const [filteredVehiclesOption, setfilteredVehiclesOption] = useState([]);
  const [selectedOption, setSelectedOption] = useState({});
  // const [selectedVehicle, setSelectedVehicle] = useState();

  
  // if(formData.selectvendor){
  //   // setVendorId(formData?.selectvendor?.id);
  //   const vendorId = formData?.selectvendor?.id;
  //   // setfilteredVehiclesOption(vehiclesOption.filter(vehicle => vehicle.vendorId === vendorId));
  // }
  // // console.log("vendorId  "+vendorId)
  // // console.log("vehiclesOption "+JSON.stringify(vehiclesOption))
  // console.log("filteredVehiclesOption "+JSON.stringify(filteredVehiclesOption))
  
  const {
    data: vehicleData,
    isLoading: isVehicleDataLoading,
    isSuccess: isVehicleSuccess,
    error: vehicleError,
    refetch: refetchVehicle,
  } = Digit.Hooks.fsm.useVehiclesSearch({
    tenantId,
    filters: {
      status: "ACTIVE",
      sortBy: "registrationNumber",
      sortOrder: "ASC",
      vehicleWithNoVendor: true,
    },
  });
  useEffect(() => {
    if (vehicleData) setVehiclesOption(vehicleData?.vehicle || []);
  }, [vehicleData]);


  const selectVehicle = (value) => {
    setVehicles(value);
    if (userType === "employee") {
      onSelect(config.key, value);
      onSelect("vehicleDetail", null);
    }
  };

  if (userType === "employee") {
    return (
      <div>
        {/* <CardText>{t(`ES_FSM_REGISTRY_SELECT_VEHICLE`)}</CardText> */}
        <Dropdown 
          t={t} 
          option={vehiclesOption} 
          value={selectedOption} 
          selected={vehicles} 
          select={selectVehicle} 
          optionKey={"registrationNumber"} 
        />
      </div>
    );
  }
  return (
    <React.Fragment>
      <FormStep config={config} onSelect={onSubmit} onSkip={onSkip} isDisabled={!genderType} t={t}>
        <CardText>{t(`ES_FSM_REGISTRY_SELECT_VEHICLE`)}</CardText>
        <Dropdown
          t={t}
          option={vehiclesOption}
          value={selectedOption}
          selected={vehicles}
          select={selectVehicle}
          optionKey={"registrationNumber"}
        />
      </FormStep>
    </React.Fragment>
  );

};

export default SelectVehicle;
