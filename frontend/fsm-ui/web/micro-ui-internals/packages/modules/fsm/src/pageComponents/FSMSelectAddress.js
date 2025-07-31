import React, { useEffect, useState } from "react";
import { FormStep, CardLabel, Dropdown, RadioButtons, LabelFieldPair, RadioOrSelect, TextInput } from "@upyog/digit-ui-react-components";
import Timeline from "../components/TLTimelineInFSM";
import { useLocation } from "react-router-dom";

const FSMSelectAddress = ({ t, config, onSelect, userType, formData }) => {
  const allCities = Digit.Hooks.fsm.useTenants();
  let tenantId = Digit.ULBService.getCurrentTenantId();
  // let tenantId = Digit.ULBService.getCitizenCurrentTenant();
  // let tenantId = Digit.ULBService.getCurrentUlb().code;
  // console.log("getCurrentUlb "+Digit.ULBService.getCurrentUlb().code)
  // console.log("formData "+JSON.stringify(formData?.cpt?.details?.address?.ward?.code))
  if (userType !== "employee") {
    tenantId = Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code;
  }
  const propertyWard = formData?.cpt ? formData?.cpt?.details?.address?.ward?.code : "";
  const propertyName = formData?.cpt ? formData?.cpt?.details?.address?.ward?.name : "";
  const propertyLocality = formData?.cpt ? formData?.cpt?.details?.localityList : "";
  // console.log("propertyLocality "+JSON.stringify(propertyLocality))
  const location = useLocation();
  const isNewVendor = location.pathname.includes("new-vendor");
  const isEditVendor = location.pathname.includes("modify-vendor");
  const inputs = [
    {
      active: true,
      code: "WITHIN_ULB_LIMITS",
      i18nKey: "WITHIN_ULB_LIMITS",
      name: "Witnin ULB Limits",
    },
    {
      active: true,
      code: "FROM_GRAM_PANCHAYAT",
      i18nKey: "FROM_GRAM_PANCHAYAT",
      name: "From Gram Panchayat",
    },
  ];
  if (formData && formData.address) {
    // Check if propertyLocation does not exist in address
    if (!formData.address.hasOwnProperty("propertyLocation")) {
      // Assign default value to propertyLocation
      formData.address.propertyLocation = inputs[0];
    }
  }

  const { pincode, city } = formData?.address || "";
  // const cities =
  //   userType === "employee"
  //     ? allCities.filter((city) => city.code === tenantId)
  //     : pincode
  //     ? allCities.filter((city) => city?.pincode?.some((pin) => pin == pincode))
  //     : allCities;
  // const cities = city.code;
  // const cities = allCities.map(city => city.code)
  const cities = allCities.filter((city) => city.code === tenantId);
  const [selectedCity, setSelectedCity] = useState(
    () => formData?.address?.city || Digit.SessionStorage.get("fsm.file.address.city") || Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")
  );
  const [newLocality, setNewLocality] = useState();
  const { data: fetchedLocalities } = Digit.Hooks.useBoundaryLocalities(
    selectedCity?.code,
    "revenue",
    {
      enabled: !!selectedCity,
    },
    t
  );

  const { data: fetchedZone } = Digit.Hooks.useBoundaryLocalities(
    selectedCity?.code,
    "zone",
    {
      enabled: !!selectedCity,
    },
    t
  );
  const { data: urcConfig } = Digit.Hooks.fsm.useMDMS(tenantId, "FSM", "UrcConfig");
  const isUrcEnable = urcConfig && urcConfig.length > 0 && urcConfig[0].URCEnable;
  const [selectLocation, setSelectLocation] = useState(() =>
    formData?.address?.propertyLocation
      ? formData?.address?.propertyLocation
      : Digit.SessionStorage.get("locationType")
      ? Digit.SessionStorage.get("locationType")
      : inputs[0]
  );

  const [localities, setLocalities] = useState();
  const [localitiesOption, setLocalitiesOption] = useState();
  const [zones, setZones] = useState();
  const [wards, setWards] = useState();
  const [selectedLocality, setSelectedLocality] = useState();
  const [selectedZone, setSelectedZone] = useState();
  const [selectedWard, setSelectedWard] = useState();
  const [matchedBlock, setMatchedBlock] = useState();
  const [matchedZone, setMatchedZone] = useState();
  useEffect(() => {
    if (propertyWard && propertyName) {
      // const matchedBlock = fetchedZone
      //   .flatMap((zone) => zone.children || []) // collect all block-level items
      //   .find((block) => block.code === propertyWard); // find block with matching code
      const matchedZone = fetchedZone.find((zone) => (zone.children || []).some((child) => child.code === propertyWard));

      const matchedBlock = matchedZone ? (matchedZone.children || []).find((child) => child.code === propertyWard) : null;

      setMatchedBlock(matchedBlock);
      setMatchedZone(matchedZone);
    }
  }, [propertyWard, propertyName]);

  useEffect(() => {
    if (propertyWard && propertyName && propertyLocality) {
      setWards([matchedBlock]);
      setZones([matchedZone]);
      setLocalitiesOption(propertyLocality);
      // setSelectedWard(matchedBlock);
    }
  }, [matchedBlock, matchedZone]);
  useEffect(() => {
    if (fetchedZone) {
      const zone = fetchedZone;
      setZones(zone);
    }
  }, [fetchedZone]);

  useEffect(() => {
    if (cities) {
      if (cities.length === 1) {
        setSelectedCity(cities[0]);
      }
    }
  }, [cities]);

  useEffect(() => {
    if (selectedCity && selectLocation) {
      if (userType === "employee") {
        onSelect(config.key, {
          ...formData[config.key],
          city: selectedCity,
          propertyLocation: selectLocation,
        });
      }
    }
    if ((!isUrcEnable || isNewVendor || isEditVendor) && selectedCity && fetchedLocalities) {
      let __localityList = fetchedLocalities;

      let filteredLocalityList = [];

      if (formData?.address?.locality) {
        setSelectedLocality(formData.address.locality);
      }

      if (formData?.address?.pincode) {
        filteredLocalityList = __localityList.filter((obj) => obj.pincode?.find((item) => item == formData.address.pincode));
        if (!formData?.address?.locality) setSelectedLocality();
      }

      if (userType === "employee") {
        onSelect(config.key, { ...formData[config.key], city: selectedCity });
      }
      setLocalities(() => (filteredLocalityList.length > 0 ? filteredLocalityList : __localityList));
      if (filteredLocalityList.length === 1) {
        setSelectedLocality(filteredLocalityList[0]);
        if (userType === "employee") {
          onSelect(config.key, { ...formData[config.key], locality: filteredLocalityList[0] });
        }
      }
    }
  }, [selectedCity, selectLocation, fetchedLocalities]);

  function selectCity(city) {
    setSelectedLocality(null);
    setLocalities(null);
    Digit.SessionStorage.set("fsm.file.address.city", city);
    setSelectedCity(city);
  }

  function selectedValue(value) {
    setSelectLocation(value);
    Digit.SessionStorage.set("locationType", value);
    if (userType === "employee") {
      if (value.code === "FROM_GRAM_PANCHAYAT") {
        onSelect("tripData", {
          ...formData["tripData"],
          amountPerTrip: "",
          amount: "",
        });
        onSelect(config.key, {
          ...formData[config.key],
          propertyLocation: value,
        });
      } else {
        onSelect(config.key, {
          ...formData[config.key],
          propertyLocation: value,
        });
      }
    }
  }

  function selectZone(zone) {
    setSelectedZone(zone);

    if(!propertyWard){
    setWards(zone?.children);
    }
    onSelect(config.key, { ...formData[config.key], zone: zone });
  }
  // console.log("wards "+JSON.stringify(wards))
  function selectWard(ward) {
    setSelectedWard(ward);
    if(!propertyLocality){
    setLocalitiesOption(ward?.children);
    }
    onSelect(config.key, { ...formData[config.key], ward: ward });
  }

  function selectLocality(locality) {
    setSelectedLocality(locality);
    if (userType === "employee") {
      onSelect(config.key, { ...formData[config.key], locality: locality });
    }
  }

  const onNewLocality = (value) => {
    setNewLocality(value);
    if (userType === "employee") {
      onSelect(config.key, { ...formData[config.key], newLocality: value });
    }
  };

  function onSubmit() {
    onSelect(config.key, {
      city: selectedCity,
      propertyLocation: Digit.SessionStorage.get("locationType") ? Digit.SessionStorage.get("locationType") : selectLocation,
    });
  }

  if (userType === "employee") {
    return (
      <div>
        <LabelFieldPair>
          <CardLabel className="card-label-smaller">
            {t("MYCITY_CODE_LABEL")}
            {config.isMandatory ? " * " : null}
          </CardLabel>
          <Dropdown
            className="form-field"
            isMandatory
            selected={cities?.length === 1 ? cities[0] : selectedCity}
            disable={cities?.length === 1}
            option={cities}
            select={selectCity}
            optionKey="code"
            t={t}
          />
        </LabelFieldPair>
        {!isUrcEnable || isNewVendor || isEditVendor ? (
          <div>
            <LabelFieldPair>
              <CardLabel className="card-label-smaller">
                {t("ES_NEW_APPLICATION_LOCATION_ZONE")}
                {config.isMandatory ? " * " : null}
              </CardLabel>
              <Dropdown className="form-field" isMandatory selected={selectedZone} option={zones} select={selectZone} optionKey="i18nkey" t={t} />
            </LabelFieldPair>

            <LabelFieldPair>
              <CardLabel className="card-label-smaller">
                {t("ES_NEW_APPLICATION_LOCATION_WARD")}
                {config.isMandatory ? " * " : null}
              </CardLabel>
              <Dropdown
                className="form-field"
                isMandatory
                selected={selectedWard}
                option={wards}
                select={selectWard}
                optionKey="code"
                isDisabled={!selectedZone}
                t={t}
              />
            </LabelFieldPair>

            <LabelFieldPair>
              <CardLabel className="card-label-smaller">
                {t("ES_NEW_APPLICATION_LOCATION_MOHALLA")}
                {config.isMandatory ? " * " : null}
              </CardLabel>
              <Dropdown
                className="form-field"
                isMandatory
                selected={selectedLocality}
                option={localitiesOption}
                select={selectLocality}
                // optionKey="i18nkey"
                optionKey="code"
                t={t}
              />
            </LabelFieldPair>
            {!isNewVendor && !isEditVendor && !isUrcEnable && formData?.address?.locality?.name === "Other" && (
              <LabelFieldPair>
                <CardLabel className="card-label-smaller">{`${t("ES_INBOX_PLEASE_SPECIFY_LOCALITY")} *`}</CardLabel>
                <div className="field">
                  <TextInput id="newLocality" key="newLocality" value={newLocality} onChange={(e) => onNewLocality(e.target.value)} />
                </div>
              </LabelFieldPair>
            )}
          </div>
        ) : (
          <LabelFieldPair>
            <CardLabel>{`${t("CS_PROPERTY_LOCATION")} *`}</CardLabel>
            <div className="field">
              <RadioButtons
                selectedOption={selectLocation}
                onSelect={selectedValue}
                style={{ display: "flex", marginBottom: 0 }}
                innerStyles={{ marginLeft: "10px" }}
                options={inputs}
                optionsKey="i18nKey"
                // disabled={editScreen}
              />
            </div>
          </LabelFieldPair>
        )}
      </div>
    );
  }
  return (
    <React.Fragment>
      <Timeline currentStep={1} flow="APPLY" />
      <FormStep config={config} onSelect={onSubmit} t={t} isDisabled={selectLocation ? false : true}>
        {isUrcEnable && (
          <React.Fragment>
            <CardLabel>{`${t("CS_PROPERTY_LOCATION")} *`}</CardLabel>
            <RadioOrSelect
              isMandatory={config.isMandatory}
              options={inputs}
              selectedOption={Digit.SessionStorage.get("locationType") ? Digit.SessionStorage.get("locationType") : selectLocation}
              optionKey="i18nKey"
              onSelect={selectedValue}
              t={t}
            />
          </React.Fragment>
        )}
        <CardLabel>{`${t("MYCITY_CODE_LABEL")} *`}</CardLabel>
        <RadioOrSelect options={cities} selectedOption={selectedCity} optionKey="i18nKey" onSelect={selectCity} t={t} />
      </FormStep>
    </React.Fragment>
  );
};

export default FSMSelectAddress;
