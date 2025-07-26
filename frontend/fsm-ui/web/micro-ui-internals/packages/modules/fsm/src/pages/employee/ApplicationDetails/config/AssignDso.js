import React from "react";
import { DatePicker, Dropdown, CardLabelError } from "@upyog/digit-ui-react-components";

function todayDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }

  return yyyy + "-" + mm + "-" + dd;
}

function getFilteredDsoData(dsoData, vehicle, vehicleCapacity) {
  return dsoData?.filter((e) => e.vehicles?.find((veh) => veh?.capacity == vehicleCapacity));
}

function getFilteredDriverData(vehicle, drivers) {
  return drivers?.flatMap((driver) => driver || [])?.filter((driver) => driver.vehicleId == vehicle?.id);
}

function getFilteredVehicleData(vehicleMenu, dso) {
  return vehicleMenu;
}

export const configAssignDso = ({t, dsoData, dso, selectDSO, vehicleMenu, vehicle, vehicleCapacity, selectVehicle, selectedDriver, drivers, setSelectedDriver, action,
}) => {
  // console.log("selectVehicle " + JSON.stringify(selectVehicle));
  // console.log("vehicle " + JSON.stringify(vehicle));

  return {
    label: {
      heading: `ES_FSM_ACTION_TITLE_${action}`,
      submit: `CS_COMMON_${action}`,
      cancel: "CS_COMMON_CLOSE",
    },
    form: [
      {
        body: [
          {
            label: t("ES_FSM_ACTION_DSO_NAME"),
            isMandatory: true,
            type: "dropdown",
            populators: (
              <React.Fragment>
                {getFilteredDsoData(dsoData, vehicle, vehicleCapacity) && !getFilteredDsoData(dsoData, vehicle, vehicleCapacity).length ? (
                  <CardLabelError>{t("ES_COMMON_NO_DSO_AVAILABLE_WITH_SUCH_VEHICLE")}</CardLabelError>
                ) : null}
                <Dropdown
                  option={getFilteredDsoData(dsoData, vehicle, vehicleCapacity)}
                  autoComplete="off"
                  optionKey="displayName"
                  id="dso"
                  selected={dso}
                  select={selectDSO}
                  disable={
                    getFilteredDsoData(dsoData, vehicle, vehicleCapacity) && !getFilteredDsoData(dsoData, vehicle, vehicleCapacity).length
                      ? true
                      : false
                  }
                />
              </React.Fragment>
            ),
          },
          vehicle
            ? {
                label: t("ES_FSM_SELECT_VEHICLE"),
                isMandatory: true,
                type: "dropdown",
                populators: (
                  <React.Fragment>
                    <Dropdown
                      option={getFilteredVehicleData(vehicleMenu, dso)}
                      autoComplete="off"
                      optionKey="registrationNumber"
                      id="vehicle"
                      selected={vehicle}
                      select={selectVehicle}
                      // disable={vehicle ? true : false}
                      t={t}
                    />
                  </React.Fragment>
                ),
              }
            : {},
          {
            label: t("ES_FSM_ACTION_ASSIGN_DRIVER"),
            isMandatory: true,
            type: "dropdown",
            populators: (
              <React.Fragment>
                <Dropdown
                  option={getFilteredDriverData(vehicle, drivers)}
                  autoComplete="off"
                  optionKey="name"
                  // id="vehicle"
                  select={(option) => {
                    setSelectedDriver(option);
                  }}
                  selected={selectedDriver}
                  disable={drivers?.length > 0 ? false : true}
                  placeholder={t("SW_SEARCH_BY_NAME_ID")}
                  optionCardStyles={{ maxHeight: "16rem" }}
                />
                {drivers?.length === 0 || !drivers ? (
                  <CardLabelError style={{ marginTop: "-14px" }}>{t("ES_FSM_NO_DRIVER_AVAILABLE")}</CardLabelError>
                ) : null}
              </React.Fragment>
            ),
          },
          {
            label: t("ES_FSM_ACTION_VEHICLE_CAPACITY_IN_LTRS"),
            isMandatory: true,
            type: "text",
            populators: {
              name: "capacity",
              validation: {
                required: true,
              },
            },
            disable: true,
          },
          // {
          //   label: t("ES_FSM_ACTION_SERVICE_DATE"),
          //   isMandatory: true,
          //   type: "date",
          //   populators: {
          //     name: "date",
          //     validation: {
          //       required: true,
          //     },
          //     min: Digit.Utils.date.getDate(),
          //     defaultValue: Digit.Utils.date.getDate(),
          //   },
          // },
          {
            label: t("ES_FSM_ACTION_SERVICE_DATE"),
            isMandatory: true,
            type: "custom",
            populators: {
              name: "date",
              validation: {
                required: true,
              },
              customProps: {
                min: Digit.Utils.date.getDate(),
                max: Digit.Utils.date.getDate(Date.now() + 10 * 24 * 60 * 60 * 1000),
              },
              defaultValue: Digit.Utils.date.getDate(),
              component: (props, customProps) => <DatePicker onChange={props.onChange} date={props.value} {...customProps} />,
            },
          },
        ],
      },
    ],
  };
};
