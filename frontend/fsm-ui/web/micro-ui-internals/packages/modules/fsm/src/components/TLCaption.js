import React from "react";
import { useTranslation } from "react-i18next";
import { TelePhone, DisplayPhotos } from "@upyog/digit-ui-react-components";
import Reason from "./Reason";
import Username from "./Username";

const TLCaption = ({ data, OpenImage }) => {
  const { t } = useTranslation();
  return (
    <div>
      {data.date && <p>{data.date}</p>}
      <Username assigner={data.name} />
      {data.mobileNumber && <TelePhone mobile={data.mobileNumber} />}
      {data.source && <p>{t("ES_APPLICATION_DETAILS_APPLICATION_CHANNEL_" + data.source.toUpperCase())}</p>}
      {data.comment && <Reason otherComment={data?.otherComment} headComment={data?.comment}></Reason>}
      {data?.thumbnailsToShow && data?.thumbnailsToShow?.thumbs?.length > 0 ? <div className="TLComments">
            <h3>{t("CS_COMMON_ATTACHMENTS")}</h3>
            <DisplayPhotos srcs={data?.thumbnailsToShow.thumbs} onClick={(src, index) => {OpenImage(src, index,data?.thumbnailsToShow)}} />
          </div> : null}
    </div>
  );
};

export default TLCaption;
