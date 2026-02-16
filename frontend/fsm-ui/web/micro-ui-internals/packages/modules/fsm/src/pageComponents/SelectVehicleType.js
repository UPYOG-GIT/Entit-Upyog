import React, { useEffect, useState } from "react";
import { CardLabel, Dropdown, LabelFieldPair, TextInput } from "@upyog/digit-ui-react-components";

const SelectVehicleType = ({ t, config, onSelect, userType, formData, setValue }) => {
  const stateId = Digit.ULBService.getStateId();
  const { data: vehicleData, isLoading } = Digit.Hooks.fsm.useMDMS(stateId, "Vehicle", "VehicleMakeModel");
  let tenantId = Digit.ULBService.getCurrentTenantId();

  const [modals, setModals] = useState([]);
  const [selectedModal, setSelectedModal] = useState({});
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState({});
  const [selectedCapacity, setSelectedCapacity] = useState("");
  const [vehicleImage, setVehicleImage] = useState(null);

  // useEffect(() => {
  //   if (vehicleData) {
  //     const vehicleModal = vehicleData.filter((vehicle) => vehicle.code === (formData?.vehicle?.modal?.code || formData?.vehicle?.modal));
  //     const vehicleType = vehicleData.filter((vehicle) => vehicle.code === (formData?.vehicle?.type?.code || formData?.vehicle?.type));
  //     setSelectedModal(...vehicleModal);
  //     setSelectedType(...vehicleType);
  //     setSelectedCapacity(formData?.vehicle?.tankCapacity);
  //   }
  // }, [vehicleData]);

  useEffect(() => {
    if (vehicleData?.Vehicle?.VehicleMakeModel) {
      const makeModelArray = vehicleData.Vehicle.VehicleMakeModel;

      const vehicleModal = makeModelArray.filter((vehicle) => vehicle.code === (formData?.vehicle?.modal?.code || formData?.vehicle?.modal));
      const vehicleType = makeModelArray.filter((vehicle) => vehicle.code === (formData?.vehicle?.type?.code || formData?.vehicle?.type));

      setSelectedModal(vehicleModal[0]); // Use [0] to extract the object
      setSelectedType(vehicleType[0]);
      setSelectedCapacity(formData?.vehicle?.tankCapacity);
    }
  }, [vehicleData]);

  useEffect(() => {
    if (selectedModal?.code && selectedModal?.code !== formData?.vehicle?.modal) {
      setSelectedType("");
      setSelectedCapacity("");
      setValue("additionalDetails", "");
      setValue("pollutionCert", undefined);
      setValue("insurance", undefined);
      setValue("roadTax", undefined);
      setValue("fitnessValidity", undefined);
    }
  }, [formData?.vehicle?.modal]);

  // useEffect(() => {
  //   if (vehicleData) {
  //     const vehicleModals = vehicleData.filter((vehicle) => vehicle.make === undefined);
  //     const types = vehicleData.filter((vehicle) => formData?.vehicle?.modal != undefined && vehicle?.make === formData?.vehicle?.modal?.code);
  //     setTypes(types);
  //     setModals(vehicleModals);
  //   }
  // }, [vehicleData]);

  // const selectModal = (modal) => {
  //   const types = vehicleData.filter((vehicle) => vehicle.make === modal.code);
  //   setTypes(types);
  //   setSelectedModal(modal);
  //   onSelect(config.key, { ...formData[config.key], modal: modal, type: "" });
  // };

  useEffect(() => {
    const makeModelArray = vehicleData?.Vehicle?.VehicleMakeModel;

    if (makeModelArray) {
      const vehicleModals = makeModelArray.filter((vehicle) => vehicle.make === undefined);
      const types = makeModelArray.filter((vehicle) => formData?.vehicle?.modal !== undefined && vehicle?.make === formData?.vehicle?.modal?.code);

      setTypes(types);
      setModals(vehicleModals);
    }
  }, [vehicleData]);

  const selectModal = (modal) => {
    const makeModelArray = vehicleData?.Vehicle?.VehicleMakeModel;

    if (makeModelArray) {
      const types = makeModelArray.filter((vehicle) => vehicle.make === modal.code);
      setTypes(types);
      setSelectedModal(modal);
      setVehicleImage(null)
      onSelect(config.key, {
        ...formData[config.key],
        modal: modal,
        type: "", // Reset type when modal changes
      });
    }
  };

  const selectType = (type) => {
    setSelectedCapacity(type.capacity);
    setSelectedType(type);
    setVehicleImage(type.imgUrl)
    onSelect(config.key, { ...formData[config.key], type: type });
  };

  return (
    <div>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">
          {t("ES_FSM_REGISTRY_VEHICLE_MODEL")}
          {config.isMandatory ? " * " : null}
        </CardLabel>
        <Dropdown
          className="form-field"
          isMandatory
          selected={selectedModal}
          disable={false}
          option={modals?.sort((a, b) => a.name.localeCompare(b.name))}
          select={selectModal}
          optionKey="name"
          t={t}
        />
      </LabelFieldPair>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">
          {t("ES_FSM_REGISTRY_VEHICLE_TYPE")}
          {config.isMandatory ? " * " : null}
        </CardLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {types?.map((type) => (
            <div
              key={type.code}
              onClick={() => selectType(type)}
              style={{
                cursor: 'pointer',
                border: selectedType?.code === type.code ? '2px solid #007bff' : '1px solid #ccc',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center',
                backgroundColor: selectedType?.code === type.code ? '#f0f8ff' : '#fff',
                transition: 'border-color 0.3s, background-color 0.3s'
              }}
            >
              <img
                src={type.imgUrl}
                alt={type.name}
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <p style={{ margin: '5px 0 0 0', fontSize: '14px', fontWeight: 'bold' }}>{type.capacity} L</p>
            </div>
          ))}
        </div>
      </LabelFieldPair>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">
          {t("ES_FSM_REGISTRY_VEHICLE_CAPACITY")}
          {config.isMandatory ? " * " : null}
        </CardLabel>
        <TextInput className="" textInputStyle={{ width: "50%" }} value={selectedCapacity} onChange={() => {}} disable={true} />
      </LabelFieldPair>
      
      {/* {vehicleImage && (
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">
          {t("Vehicle Image")}
          {config.isMandatory ? " * " : null}
        </CardLabel>
        <img
          src={vehicleImage}
          alt="capacity icon"
          style={{ width: "100px", height: "100px" }}
        />
      </LabelFieldPair>
      )} */}
    </div>
  );
};

export default SelectVehicleType;
