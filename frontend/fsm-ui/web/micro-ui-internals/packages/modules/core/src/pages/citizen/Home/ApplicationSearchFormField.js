
import { StatusTable,BackButton, SearchField, TextInput, SubmitBar, Header, Card, CardHeader, Row, PDFSvg, CardSectionHeader,MultiLink, Loader } from "@upyog/digit-ui-react-components";


import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fromUnixTime, format } from 'date-fns';
import { OBPSService } from "../../../../../../libraries/src/services/elements/OBPS";
import { MdmsService } from "../../../../../../libraries/src/services/elements/MDMS";
// import { pdfDocumentName, pdfDownloadLink, stringReplaceAll } from "../../../utils";
// import ApplicationTimeline from "../../../components/ApplicationTimeline";



const ApplicationSearchFormField = ({ formState, register, reset, previousPage }) => {
  const { t } = useTranslation();
  const [applicationNo, setApplicationNo] = useState("");
  const [tableData, setTableData] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = await Digit.OBPSAdminService.searchByApplicationNo('cg', applicationNo);
      console.log("searchByApplicationNo Response:", data.BPA);
      setTableData(data.BPA);
    } catch (error) {
      console.error("Search Error:", error);
    }
  };

  useEffect(() => {
    // Function to fetch scrutiny details when 'tableData' changes
    const fetchScrutinyDetails = async () => {
      try {
        if (tableData.length > 0 && tableData[0]?.tenantId && tableData[0]?.edcrNumber) {
          const edcrResponse = await OBPSService.scrutinyDetails(tableData[0].tenantId, { edcrNumber: tableData[0].edcrNumber });
          const [edcr] = edcrResponse?.edcrDetail;
          const mdmsRes = await MdmsService.getMultipleTypes(tableData[0].tenantId, "BPA", ["RiskTypeComputation", "CheckList"]);
          const riskType = Digit.Utils.obps.calculateRiskType(mdmsRes?.BPA?.RiskTypeComputation, edcr?.planDetail?.plot?.area, edcr?.planDetail?.blocks);

          setTableData((prevTableData) =>
          prevTableData.map((item) => ({
            ...item,
            riskType: riskType,
          }))
        );
  
         
          
          console.log("riskType: " + riskType);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    // Call the function to fetch data whenever 'tableData' changes
    fetchScrutinyDetails();
  }, [tableData]);

  const tableContainerStyle = {
    marginTop: "20px", 
  };
  


 
  return (

    
    <form onSubmit={handleSubmit}>
       <BackButton>{t("CS_COMMON_BACK")}</BackButton>
       <div className="cardHeaderWithOptions" style={{ marginRight: "auto", maxWidth: "960px" , marginTop: 20}}>
      <Header styles={{ fontSize: "32px" }}>{t("Application Search ")}</Header>
  
    </div>
 
      <SearchField>
        <label>Enter Application Number </label>
        <TextInput
          name="applicationNo"
          value={applicationNo}
          onChange={(event) => setApplicationNo(event.target.value)}
        />
      </SearchField>
      <SearchField className="submit">
        <SubmitBar label="Search" submit onClick={handleSubmit} />
      
      </SearchField>
     
      {tableData.length > 0 && (
        
      <Fragment >
         
  
    <div className="cardHeaderWithOptions" style={{ marginRight: "auto", maxWidth: "960px" , marginTop: 20}}>
      <Header styles={{ fontSize: "32px" }}>{t("Application Details")}</Header>
    </div>
 
  
    <Card>
      <StatusTable>
        <Row
          className="border-none"
          label={t("BPA_APPLICATION_NUMBER_LABEL")}
          text={tableData[0]?.applicationNo || t("NA")}
        />
      </StatusTable>
    </Card>
    <Card>
    <CardHeader>{t(`Basic Details`)}</CardHeader>
        <StatusTable>
          <Row className="border-none" label={t(`Application Date`)} text={tableData[0]?.auditDetails.createdTime ? format(new Date(tableData[0]?.auditDetails.createdTime), 'dd/MM/yyyy') : tableData[0]?.auditDetails.createdTime} />
          <Row className="border-none" label={t(`Application Type`)} text={t(`WF_BPA_${tableData[0]?.additionalDetails.applicationType}`)}/>
          <Row className="border-none" label={t(`Service Type`)} text={t(tableData[0]?.additionalDetails.serviceType)} />
          <Row className="border-none" label={t(`Occupancy Type`)} text={tableData[0]?.landInfo?.address?.occupancy}/>
          <Row className="border-none" label={t(`Risk Type`)} text={t(`WF_BPA_${tableData[0]?.riskType}`)} />
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_APPLICATION_NAME_LABEL`)} text={tableData[0]?.landInfo?.owners[0]?.name} />
          <Row className="border-none" label={t(`Application Status`)} text={t(`WF_BPA_${tableData[0]?.status}`)} />
        </StatusTable>
        </Card>

        <Card>
    <CardHeader>{t("BPA_PLOT_DETAILS_TITLE")}</CardHeader>
    
    <StatusTable>
          <Row className="border-none" label={t(`Plot Area`)} text={tableData[0]?.landInfo?.address?.plotArea ? `${tableData[0]?.landInfo?.address?.plotArea} ${t(`BPA_SQ_FT_LABEL`)}` : t("CS_NA")} />
          <Row className="border-none" label={t(`BPA_PLOT_NUMBER_LABEL`)} text={tableData[0]?.landInfo?.address?.plotNo || t("CS_NA")} />
          <Row className="border-none" label={t(`Khasra Number`)} text={tableData[0]?.landInfo?.address?.khataNo || t("CS_NA")}/>
          <Row className="border-none" label={t(`BPA_PATWARI_HALKA_NUMBER_LABEL`)} text={tableData[0]?.landInfo?.address?.patwariHN  || t("CS_NA")} />
          <Row className="border-none" label={t(`BPA_HOLDING_NUMBER_LABEL`)} text={t("CS_NA")} />
          <Row className="border-none" label={t(`Land Registration Details`)} text={t("CS_NA")} />
          
    </StatusTable>
    </Card>   
    <Card>
      <CardHeader>{t("BPA_NEW_TRADE_DETAILS_HEADER_DETAILS")}</CardHeader>
        
      <StatusTable>
          <Row className="border-none"  label={t(`Pincode`)} text={tableData[0]?.landInfo?.address?.pincode || t("CS_NA")} />
          <Row className="border-none" label={t(`City`)} text={tableData[0]?.landInfo?.address?.city || t("CS_NA")} />
          <Row className="border-none" label={t(`BPA_LOC_MOHALLA_LABEL`)} text={tableData[0]?.landInfo?.address?.locality?.name || t("CS_NA")} />
          <Row className="border-none" label={t(`Street`)} text={tableData[0]?.landInfo?.address?.street || t("CS_NA")} />
          <Row className="border-none" label={t(`ES_NEW_APPLICATION_LOCATION_LANDMARK`)} text={tableData[0]?.landInfo?.address?.landmark || t("CS_NA")} />
          <Row className="border-none" label={t(`BPA_PROPOSED_SITE_ADDRESS`)} text={tableData[0]?.landInfo?.address?.address || t("CS_NA")} />
      </StatusTable>
      </Card>

      <Card >
          <CardHeader>{t("Owner Details")}</CardHeader>
        
              <StatusTable>
                <Row className="border-none" label={t(`CORE_COMMON_NAME`)} text={tableData[0]?.landInfo?.owners[0]?.name} />
                <Row className="border-none" label={t(`Gender`)} text={t(tableData[0]?.landInfo?.owners[0]?.gender)} />
                <Row className="border-none" label={t(`CORE_COMMON_MOBILE_NUMBER`)} text={tableData[0]?.landInfo?.owners[0]?.mobileNumber} />
                <Row className="border-none" label={t(`Is Primary Owner`)} text={`${tableData[0]?.landInfo?.owners[0]?.isPrimaryOwner}`} />
              </StatusTable>
            
        </Card>

</Fragment>
)}




    
  
    </form>
  );
};

export default ApplicationSearchFormField;
