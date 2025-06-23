import { StatusTable, Row, PDFSvg, CardLabel, CardSubHeader } from "@upyog/digit-ui-react-components";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const ScruntinyDetails = ({ scrutinyDetails, paymentsList = [] }) => {
  const { t } = useTranslation();
  let count = 0;
  const getTextValues = (data) => {
    if (data?.value && data?.isTransLate) return <span style={{ color: "#00703C" }}>{t(data?.value)}</span>;
    else if (data?.value && data?.isTransLate) return t(data?.value);
    else if (data?.value) return data?.value;
    else t("NA");
  }
  const { id } = useParams();

  //const tenantId = Digit.ULBService.getCurrentTenantId();
  //const { data = {}, isLoading } = Digit.Hooks.obps.useBPADetailsPage(tenantId, { applicationNo: id });

  const [feeDetails, setFeeDetails] = useState([]);

   useEffect(async () => {
     const feeDetails = await Digit.OBPSAdminService.getFeeDetails(id);
  setFeeDetails(feeDetails);
 }, []);

  return (
    <Fragment>

      {!scrutinyDetails?.isChecklist && <div style={{ background: "#FAFAFA", border: "1px solid #D6D5D4", padding: "8px", borderRadius: "4px", maxWidth: "950px", minWidth: "280px" }}
      >
        <StatusTable>

          <div>

            {scrutinyDetails?.values?.map((value, index) => {
     
          
              if (value.title === "BPA_SANC_FEES_DETAILS") return (
                <div style={{ fontFamily: "sans-serif", fontSize: "16px", lineHeight: "26px" }}>
                  
                  <div>
                    {feeDetails.map(item => (

                      
                      <div>
                        <p style={{ textAlign: "left", fontWeight: 700 }}>{item.charges_type_name}</p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <p style={{ marginLeft: 30 }}>{item.amount}</p>
                        </div>
                      </div>

                    ))}
                  </div>
                </div>
              );
              if (value?.isUnit) return <Row className="border-none" textStyle={value?.value === "Paid" ? { color: "darkgreen" } : (value?.value === "Unpaid" ? { color: "red" } : {})} key={`${value.title}`} label={`${t(`${value.title}`)}`} text={value?.value ? `${getTextValues(value)} ${t(value?.isUnit)}` : t("NA")} labelStyle={value?.isHeader ? { fontSize: "20px" } : {}} />
              else if (value?.isHeader && !value?.isUnit) return <CardSubHeader style={{ fontSize: "20px", paddingBottom: "10px" }}>{t(value?.title)}</CardSubHeader>

              else if (value?.isSubTitle && !value?.isUnit) return <CardSubHeader style={{ fontSize: "20px", paddingBottom: "10px", margin: "0px" }}>{t(value?.title)}</CardSubHeader>
              else return <Row className="border-none" textStyle={value?.value === "Paid" ? { color: "darkgreen" } : (value?.value === "Unpaid" ? { color: "red" } : {})} key={`${value.title}`} label={`${t(`${value.title}`)}`} text={getTextValues(value)} labelStyle={value?.isHeader ? { fontSize: "20px" } : {}} />
            })}
            {scrutinyDetails?.permit?.map((value, ind) => {
              return <CardLabel style={{ fontWeight: "400" }}>{value?.title}</CardLabel>
            })}
          </div>
          <div>

            {scrutinyDetails?.scruntinyDetails?.map((report, index) => {
              return (
                <Fragment>
                  <Row className="border-none" label={`${t(report?.title)}`} labelStyle={{ width: "150%" }} />
                  <a href={report?.value}> <PDFSvg /> </a>
                  <p style={{ margin: "8px 0px", fontWeight: "bold", fontSize: "16px", lineHeight: "19px", color: "#505A5F" }}>{t(report?.text)}</p>
                </Fragment>
              )
            })}
          </div>
        </StatusTable>
      </div>}
    </Fragment>

  )

}

export default ScruntinyDetails;