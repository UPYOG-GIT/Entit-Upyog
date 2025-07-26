import React, { useEffect, useState, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  Header,
  Modal,
  Dropdown,
  CardLabel,
  TextInput,
  SubmitBar,
  Toast,
  CloseSvg,
  EditPencilIcon,
  DeleteIcon,
  LabelFieldPair,
  Loader,
  Row,
  Table,
  BackButton,
  KeyNote,
  CheckBox,
} from "@upyog/digit-ui-react-components";

const EdcrRuleEntry = () => {
  const { t } = useTranslation();
  const [modalData, setModalData] = useState(false);
  const [featureNameType, setfeatureNameType] = useState({ code: "Far", value: "Far" });
  // const [occupancy, setOccupancy] = useState("");
  // const [subOccupancy, setSubOccupancy] = useState("");
  const [occupancy, setOccupancy] = useState({ code: "", value: "null" });
  const [subOccupancy, setSubOccupancy] = useState({ code: "", value: null });
  const [featureName, setFeatureName] = useState({ code: "", value: "null" });
  const [PyBuildCat, setPyBuildCat] = useState({ code: "", value: "null" });
  // const [PyBuildCat,setPyBuildCat] = useState("");
  const [PySubCat, setPySubCat] = useState({ code: "", value: "null" });
  const [fromArea, setFromArea] = useState();
  const [toArea, setToArea] = useState();
  const [PyOperation, setPyOperation] = useState("");
  const [byLaw, setByLaw] = useState();
  const [noOfFloors, setNoOfFloors] = useState();
  const [developmentZone, setDevelopmentZone] = useState({ code: "", value: "null" });
  const [roadWidth, setRoadWidth] = useState();
  const [depthOrWidth, setDepthOrWidth] = useState();
  const [fromDepth, setFromDepth] = useState();
  const [toDepth, setToDepth] = useState();
  const [fromWidth, setFromWidth] = useState();
  const [toWidth, setToWidth] = useState();
  const [permissibleValue, setPermissibleValue] = useState();
  const [minVal, setMinVal] = useState();
  const [maxVal, setMaxVal] = useState();
  const [floorNumber, setFloorNumber] = useState();
  const [buildingHeight, setBuildingHeight] = useState();
  const [PyIndRate, setPyIndRate] = useState();
  const [PyMultiplyValue, setPyMultiplyValue] = useState();
  const [PyMaxLimit, setPyMaxLimit] = useState();
  const [PropCatdropdown, setPropCatdropdown] = useState([]);
  const [BuildCatdropdown, setBuildCatdropdown] = useState([]);
  const [SubCatdropdown, setSubCatdropdown] = useState([]);
  const [featureTypedropval, setFeatureTypedropval] = useState([]);
  const [Slabtblval, setSlabtblval] = useState([]);
  const [allFeatureNameData, setAllFeatureNameData] = useState([]);
  const [showToast, setShowToast] = useState(null);
  const [multiStory, setMultiStory] = useState(false);
  const [highRise, setHighRise] = useState(false);

  const Operationdropdown = [
    { code: "Multiply", value: "Multiply" },
    { code: "Fix", value: "Fix" },
    { code: "Fix and Multiply", value: "Fix and Multiply" },
    { code: "Multiply and Check Limit", value: "Multiply and Check Limit" },
  ];

  const FeatureNameDropdown = [
    { code: "Far", value: "Far" },
    { code: "Coverage", value: "Coverage" },
    { code: "Front Setback", value: "Front Setback" },
    { code: "Rear Setback", value: "Rear Setback" },
  ];

  const DevelopmentZoneDropDown = [
    { code: "CA", value: "CA" },
    { code: "DA-01", value: "DA-01" },
    { code: "DA-02", value: "DA-02" },
    { code: "DA-03", value: "DA-03" },
  ];

  const OccupancyDropdown = [
    { code: "Residential", value: "Residential" },
    { code: "Mercantile / Commercial", value: "Mercantile / Commercial" },
    { code: "Industrial", value: "Industrial" },
    { code: "Government/Semi Goverment", value: "Government/Semi Goverment" },
  ];

  // setSlabPyTypedropval(FeatureNameDropdown);

  const tenantId = Digit.ULBService.getCurrentTenantId();
  let validation = {};

  const selectedRows = [];
  const [rowid, setRowid] = useState([]);

  const setSlabPaytype = (value) => setfeatureNameType(value);
  const setPayPropCat = (value) => setOccupancy(value);
  const setFeatureNameCat = (value) => setFeatureName(value);
  const setPayBuildCat = (value) => setPyBuildCat(value);
  const setPaySubCat = (value) => setSubOccupancy(value);
  const setPayOperation = (value) => setDevelopmentZone(value);

  let { uuid } = Digit.UserService.getUser()?.info || {};
  const GetCell = (value) => <span className="cell-text">{t(value)}</span>;

  useEffect(async () => {
    let paytypeRule = await Digit.EDCRService.getFeatureName();
    let PyTydrop = [];
    paytypeRule.map((item) => {
      // if(item.defunt==="N"){
      PyTydrop.push({
        code: item.id,
        value: item.name,
      });
      // }
    });
    setFeatureTypedropval(PyTydrop);
  }, []);

  // useEffect( async ()=>{
  //   let propType = await Digit.OBPSAdminService.getProptype(tenantId);
  //   let Proptydrop=[];
  //   propType.map(item=>{
  //     if(item.defunt==="N"){
  //       Proptydrop.push({
  //         code: item.description,
  //         value: item.srno
  //       })
  //     }
  //   });
  //   setPropCatdropdown(Proptydrop);
  // },[])

  useEffect(async () => {
    let BCatetype = await Digit.EDCRService.getOccupancy();
    let BCatetydrop = [];
    BCatetype.map((item) => {
      // if(item.defunt==="N"){
      BCatetydrop.push({
        code: item.id,
        value: item.name,
      });
      // }
    });
    setBuildCatdropdown(BCatetydrop);
  }, []);

  useEffect(async () => {
    if (PyBuildCat.value != "null") {
      let occupancyId = PyBuildCat.code;
      let BStype = await Digit.EDCRService.getSubOccupancy(occupancyId);
      let BSCatetydrop = [];
      BStype.map((item) => {
        // if(item.defunt==="N"){
        BSCatetydrop.push({
          code: item.id,
          value: item.name,
        });
        // }
      });
      setSubCatdropdown(BSCatetydrop);
    }
  }, [PyBuildCat]);

  useEffect(async () => {
    // let getslab = await Digit.EDCRService.getEdcrRule(tenantId,featureNameCondition);
    let getslab = await Digit.EDCRService.getEdcrRuleList(tenantId);
    setAllFeatureNameData(getslab);
  }, []);

  let featureNameCondition = featureNameType.value;
  useEffect(async () => {
    // let getslab = await Digit.EDCRService.getEdcrRule(tenantId,featureNameCondition);
    // let getslab = await Digit.EDCRService.getEdcrRuleList(tenantId);
    let filteredData = allFeatureNameData.filter((item) => item.feature === featureNameCondition);
    setSlabtblval(filteredData);
  }, [featureNameType]);

  function highRiseCheck(event) {
    const isHighRise = event.target.checked;
    setHighRise(isHighRise);
  }

  function multiStoryCheck(event) {
    const isMultiStory = event.target.checked;
    setMultiStory(isMultiStory);
  }

  const addEdcrRule = async (e) => {
    e.preventDefault();

    const SlabMasterRequest = {
      tenantId: tenantId,
      payTypeId: featureNameType.value,
      fromVal: fromArea,
      toVal: toArea,
      operation: PyOperation.value,
      pCategory: occupancy.value,
      bCategory: featureName.value,
      sCategory: PySubCat.value,
      rateRes: byLaw,
      rateComm: permissibleValue,
      rateInd: PyIndRate,
      createdBy: uuid,
      multpVal: PyMultiplyValue,
      maxLimit: PyMaxLimit,
    };

    // const obj = { feature: PyBuildCat.value };
    // const prop1 = "occupancy";
    // const prop2 = "to_area";
    // const prop3 = "from_area";
    // const prop4 = "by_law";
    // const prop5 = "permissible_value";
    // obj[prop1] = PyPropCat.value;
    // obj[prop2] = PyToValue;
    // obj[prop3] = PyFromValue;
    // obj[prop4] = PyResRate;
    // obj[prop5] = PyCommRate;

    // console.log(obj);
    // {"name": "Ben", "prop name": "value 1", "prop-name": "value 2", "1prop-name": "value 3"}

    const params = {
      feature: featureName.value,
      occupancy: PyBuildCat.value,
      sub_occupancy: PySubCat.value,
      to_area: toArea ? toArea : null,
      from_area: fromArea ? fromArea : null,
      tenant_id: tenantId.split(".").length > 1 ? tenantId.split(".")[1] : tenantId,
      by_law: byLaw ? byLaw : null,
      permissible_value: permissibleValue,
      development_zone: developmentZone.value,
      road_width: roadWidth ? roadWidth : null,
      no_of_floors: noOfFloors ? noOfFloors : null,
      from_depth: fromDepth ? fromDepth : null,
      to_depth: toDepth ? toDepth : null,
      from_width: fromWidth ? fromWidth : null,
      to_width: toWidth ? toWidth : null,
      min_value: minVal ? minVal : null,
      max_value: maxVal ? maxVal : null,
      floor_number: floorNumber ? floorNumber : null,
      building_height: buildingHeight ? buildingHeight : null,
      createdBy: uuid,
      high_rise: highRise == true ? "Y" : "N",
      multi_stories: multiStory == true ? "Y" : "N",
    };

    closeModal();
    setFromArea(null);
    setToArea(null);
    setPyOperation("");
    setOccupancy("");
    setFeatureName({ code: "", value: null });
    setDevelopmentZone({ code: "", value: null });
    setPySubCat("");
    setByLaw(null);
    setPermissibleValue(null);
    setFromDepth();
    setToDepth();
    setFromWidth(null);
    setToWidth(null);
    setMaxVal(null);
    setMinVal(null);
    setBuildingHeight(null);
    setFloorNumber(null);
    setPyIndRate(null);
    setPyMultiplyValue(null);
    setPyMaxLimit(null);
    setHighRise(false);
    setMultiStory(false);

    const edcrRuleResponse = await Digit.EDCRService.createEdcrRule(params);
    // const SlabMasterResp = await Digit.OBPSAdminService.createEdcrRule(params);
    // console.log("edcrRuleResponse: "+JSON.stringify(edcrRuleResponse));
    // console.log("edcrRuleResponse11 "+edcrRuleResponse);
    if (edcrRuleResponse > 0) {
      setShowToast({ key: false, label: "Successfully Added ", bgcolor: "#4BB543" });
      location.reload();
    } else {
      setShowToast({ key: true, label: "Fail To Add", bgcolor: "red" });
    }
  };

  const closeModal = () => {
    setModalData(false);
  };

  const GetCell1 = (value) => <input type="checkbox" id="checkbox2" onChange={(e) => getRowId(e)} name="checkbox2" value={value} />;
  const columns = React.useMemo(() => {
    return [
      {
        Header: t("Select"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell1(`${row.original?.id}`);
        },
      },
      {
        Header: t("Srno"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.id}`);
        },
      },
      {
        Header: t("Feature"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.feature}`);
        },
      },
      {
        Header: t("Occupancy"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.occupancy}`);
        },
      },
      {
        Header: t("Sub Occupancy"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.sub_occupancy}`);
        },
      },
      {
        Header: t("Development Zone"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.development_zone}`);
        },
      },
      {
        Header: t("From Area"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.from_area}`);
        },
      },
      {
        Header: t("To Area"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.to_area}`);
        },
      },
      {
        Header: t("Min Val"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.min_value}`);
        },
      },
      {
        Header: t("Max Val"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.max_value}`);
        },
      },
      {
        Header: t("From Depth"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.from_depth}`);
        },
      },
      {
        Header: t("To Depth"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.to_depth}`);
        },
      },
      {
        Header: t("From Width"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.from_width}`);
        },
      },
      {
        Header: t("To Width"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.to_width}`);
        },
      },
      {
        Header: t("Floor Number"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.floor_number}`);
        },
      },
      {
        Header: t("Building Height"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.building_height}`);
        },
      },
      {
        Header: t("High Rise Building"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.high_rise}`);
        },
      },
      {
        Header: t("Multi-Story Building"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.multi_stories}`);
        },
      },
      {
        Header: t("Permissible Value"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.permissible_value}`);
        },
      },
      {
        Header: t("Rule"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.by_law}`);
        },
      },
    ];
  }, []);

  //this is for storing final data in array for delete
  function getRowId(e) {
    const { value, checked } = e.target;
    if (checked) {
      selectedRows.push(value);
      // console.log("selectedRows value "+selectedRows);
    } else {
      const index = selectedRows.indexOf(value);
      if (index > -1) {
        selectedRows.splice(index, 1);
      }
    }
    if (selectedRows.length > 0) {
      setRowid(selectedRows);
    }
  }

  //this is for delete rows selected in checkBox
  const deleteItem = async () => {
    const SlabMasterRequest = {
      ids: rowid,
    };
    // console.log("rowid value "+rowid);
    if (rowid.length > 0) {
      const DeleterowResp = await Digit.OBPSAdminService.deleteSlabdata(SlabMasterRequest);

      if (DeleterowResp > 0) {
        setShowToast({ key: false, label: "Successfully Deleted ", bgcolor: "#4BB543" });
        location.reload();
      } else {
        setShowToast({ key: true, label: "Fail To Delete", bgcolor: "red" });
      }
    }
  };

  return (
    <Card style={{ position: "absolute" }} className={"employeeCard-override"}>
      <Header styles={{ marginLeft: "0px", paddingTop: "10px", fontSize: "32px" }}>{t("EDCR Rule Detail")}</Header>

      <LabelFieldPair>
        <CardLabel style={{ color: "#000" }}>{`${t("Rule Name")}`}</CardLabel>
        <Dropdown
          style={{ width: "100%" }}
          className="form-field"
          selected={featureNameType}
          option={featureTypedropval}
          select={setSlabPaytype}
          value={featureNameType}
          optionKey="value"
          name="featureNameType"
        />
      </LabelFieldPair>

      <Table
        t={t}
        data={Slabtblval}
        columns={columns}
        className="customTable table-border-style"
        // manualPagination={false}
        // isPaginationRequired={false}
        getCellProps={(cellInfo) => {
          return {
            style: {
              padding: "20px 18px",
              fontSize: "14px",
              borderTop: "1px solid grey",
              textAlign: "left",
              verticalAlign: "middle",
            },
          };
        }}
      />

      <button
        onClick={() => setModalData(true)}
        style={{
          margin: "24px",
          backgroundColor: "#F47738",
          width: "20%",
          height: "40px",
          color: "white",
          borderBottom: "1px solid black",
        }}
      >
        {t("Add")}
      </button>
      <button
        onClick={deleteItem}
        style={{
          margin: "24px",
          backgroundColor: "#F47738",
          width: "20%",
          height: "40px",
          color: "white",
          borderBottom: "1px solid black",
        }}
      >
        {t("Delete")}
      </button>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          // onClick={updateProfile}
          style={{
            margin: "24px",
            backgroundColor: "#F47738",
            width: "20%",
            height: "40px",
            color: "white",
            borderBottom: "1px solid black",
          }}
        >
          {t("Cancel")}
        </button>
      </div>

      {modalData ? (
        <Modal
          hideSubmit={true}
          isDisabled={false}
          popupStyles={{ width: "800px", height: "auto", margin: "auto", padding: "auto" }}
          formId="modal-action"
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Header styles={{ marginLeft: "0px", paddingTop: "1px", fontSize: "25px" }}>{t("EDCR Rule Entry")}</Header>
              <span onClick={closeModal}>
                <CloseSvg />
              </span>
            </div>
            <form>
              <div>
                <KeyNote
                  noteStyle={{ color: "red", fontSize: "15px", padding: "auto" }}
                  keyValue={t("Note")}
                  note={
                    "Information will not be updated if click other than ok button of this window. Press Tab button to field navigation.* - Required Fields"
                  }
                />

                <LabelFieldPair>
                  <CardLabel style={{ color: "#000" }}>{`${t("Feature Name*")}`}</CardLabel>
                  <Dropdown
                    style={{ width: "100%", height: "2rem" }}
                    className="form-field"
                    selected={featureName}
                    option={featureTypedropval}
                    select={setFeatureNameCat}
                    value={featureName}
                    optionKey="value"
                    placeholder="Select Feature Name"
                    name="PyBuildCat"
                  />
                </LabelFieldPair>

                <LabelFieldPair>
                  <CardLabel style={{ color: "#000" }}>{`${t("Occupancy")}`}</CardLabel>
                  <Dropdown
                    style={{ width: "100%", height: "2rem" }}
                    className="form-field"
                    selected={PyBuildCat}
                    option={BuildCatdropdown}
                    select={setPayBuildCat}
                    value={PyBuildCat}
                    optionKey="value"
                    placeholder="Select Occupancy"
                    name="PyBuildCat"
                  />
                </LabelFieldPair>

                <LabelFieldPair>
                  <CardLabel style={{ color: "#000" }}>{`${t("Sub Occupancy")}`}</CardLabel>
                  <Dropdown
                    style={{ width: "100%", height: "2rem" }}
                    className="form-field"
                    selected={PySubCat}
                    option={SubCatdropdown}
                    select={setPaySubCat}
                    value={PySubCat}
                    optionKey="value"
                    placeholder="Select Sub Occupancy"
                    name="PySubCat"
                  />
                </LabelFieldPair>

                <LabelFieldPair>
                  <CardLabel style={{ color: "#000" }}>{`${t("Development Zone")}`}</CardLabel>
                  <Dropdown
                    style={{ width: "100%", height: "2rem" }}
                    className="form-field"
                    selected={developmentZone}
                    option={DevelopmentZoneDropDown}
                    select={setPayOperation}
                    value={developmentZone}
                    optionKey="code"
                    placeholder="Select Development Zone"
                    name="PyBuildCat"
                  />
                </LabelFieldPair>

                <LabelFieldPair>
                  <CardLabel style={{ color: "#000" }}>{`${t("From Plot Area")}`}</CardLabel>
                  <TextInput
                    isMandatory={true}
                    name="fromvalue"
                    onChange={(e) => setFromArea(e.target.value)}
                    value={fromArea}
                    placeholder="Enter From Plot Value"
                    type="number"
                  />
                </LabelFieldPair>
                <LabelFieldPair>
                  <CardLabel style={{ color: "#000" }}>{`${t("To Plot Value")}`}</CardLabel>
                  <TextInput
                    isMandatory={true}
                    name="tovalue"
                    placeholder="Enter To Plot Value"
                    onChange={(e) => setToArea(e.target.value)}
                    value={toArea}
                    type="number"
                  />
                </LabelFieldPair>

                <LabelFieldPair>
                  <CardLabel style={{ color: "#000" }}>{`${t("From Depth")}`}</CardLabel>
                  <TextInput
                    isMandatory={true}
                    name="fromdepth"
                    onChange={(e) => setFromDepth(e.target.value)}
                    value={fromDepth}
                    placeholder="Enter From Depth"
                    type="number"
                  />
                </LabelFieldPair>

                <LabelFieldPair>
                  <CardLabel style={{ color: "#000" }}>{`${t("To Depth")}`}</CardLabel>
                  <TextInput
                    isMandatory={true}
                    name="todepth"
                    onChange={(e) => setToDepth(e.target.value)}
                    value={toDepth}
                    placeholder="Enter To Depth"
                    type="number"
                  />
                </LabelFieldPair>

                <LabelFieldPair>
                  <CardLabel style={{ color: "#000" }}>{`${t("From Width")}`}</CardLabel>
                  <TextInput
                    isMandatory={true}
                    name="fromwidth"
                    onChange={(e) => setFromWidth(e.target.value)}
                    value={fromWidth}
                    placeholder="Enter From Width"
                    type="number"
                  />
                </LabelFieldPair>

                <LabelFieldPair>
                  <CardLabel style={{ color: "#000" }}>{`${t("To Width")}`}</CardLabel>
                  <TextInput
                    isMandatory={true}
                    name="towidth"
                    onChange={(e) => setToWidth(e.target.value)}
                    value={toWidth}
                    placeholder="Enter To Width"
                    type="number"
                  />
                </LabelFieldPair>

                <LabelFieldPair>
                  <CardLabel style={{ color: "#000" }}>{`${t("Min Val")}`}</CardLabel>
                  <TextInput
                    isMandatory={true}
                    name="mixval"
                    onChange={(e) => setMinVal(e.target.value)}
                    value={minVal}
                    placeholder="Enter Min Value"
                    type="number"
                  />
                </LabelFieldPair>

                <LabelFieldPair>
                  <CardLabel style={{ color: "#000" }}>{`${t("Max Val")}`}</CardLabel>
                  <TextInput
                    isMandatory={true}
                    name="maxval"
                    onChange={(e) => setMaxVal(e.target.value)}
                    value={maxVal}
                    placeholder="Enter Max Value"
                    type="number"
                  />
                </LabelFieldPair>

                <LabelFieldPair>
                  <CardLabel style={{ color: "#000" }}>{`${t("Floor Number(0 or -1)")}`}</CardLabel>
                  <TextInput
                    isMandatory={true}
                    name="floornumber"
                    onChange={(e) => setFloorNumber(e.target.value)}
                    value={floorNumber}
                    placeholder="Enter Floor Number"
                    type="number"
                  />
                </LabelFieldPair>

                <LabelFieldPair>
                  <CardLabel style={{ color: "#000" }}>{`${t("Building Height")}`}</CardLabel>
                  <TextInput
                    isMandatory={true}
                    name="buildingheight"
                    onChange={(e) => setBuildingHeight(e.target.value)}
                    value={buildingHeight}
                    placeholder="Enter Building Height"
                    type="number"
                  />
                </LabelFieldPair>

                <LabelFieldPair>
                  <CardLabel style={{ color: "#000" }}>{`${t("High Rise Building")}`}</CardLabel>
                  <CheckBox onChange={highRiseCheck} checked={highRise} pageType={"employee"} value={highRise} />
                </LabelFieldPair>
                <br />

                <LabelFieldPair>
                  <CardLabel style={{ color: "#000" }}>{`${t("Multi Story Building")}`}</CardLabel>
                  <CheckBox onChange={multiStoryCheck} checked={multiStory} pageType={"employee"} value={multiStory} />
                </LabelFieldPair>
                <br />

                {/* <LabelFieldPair>
                  <CardLabel style={{ color: "#000" }}>{`${t("No of Floors")}`}</CardLabel>
                  <TextInput
                    isMandatory={true}
                    name="nooffloors"
                    onChange={(e) => setFromArea(e.target.value)}
                    value={noOfFloors}
                    placeholder="Enter No of Floors"
                    type="number"
                  />
                </LabelFieldPair> */}

                <LabelFieldPair>
                  <CardLabel style={{ color: "#000" }}>{`${t("Rule Number*")}`}</CardLabel>
                  <TextInput
                    isMandatory={true}
                    name="resrate"
                    placeholder="Enter Rule Number"
                    onChange={(e) => setByLaw(e.target.value)}
                    value={byLaw}
                    type="text"
                  />
                </LabelFieldPair>
                <LabelFieldPair>
                  <CardLabel style={{ color: "#000" }}>{`${t("Permissible Value")}`}</CardLabel>
                  <TextInput
                    isMandatory={true}
                    name="commrate"
                    placeholder="Enter Permissible Value"
                    onChange={(e) => setPermissibleValue(e.target.value)}
                    value={permissibleValue}
                    type="number"
                  />
                </LabelFieldPair>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button
                    onClick={addEdcrRule}
                    style={{
                      margin: "24px",
                      backgroundColor: "#F47738",
                      width: "20%",
                      height: "40px",
                      color: "white",
                      borderBottom: "1px solid black",
                    }}
                  >
                    {t("OK")}
                  </button>
                  <button
                    onClick={closeModal}
                    style={{
                      margin: "24px",
                      backgroundColor: "#F47738",
                      width: "20%",
                      height: "40px",
                      color: "white",
                      borderBottom: "1px solid black",
                    }}
                  >
                    {t("Cancel")}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Modal>
      ) : null}
      {showToast && (
        <Toast
          error={showToast.key}
          label={t(showToast.label)}
          onClose={() => {
            setShowToast(null);
          }}
          style={{ backgroundColor: showToast.bgcolor }}
        />
      )}
    </Card>
  );
};
export default EdcrRuleEntry;
