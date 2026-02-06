import React, { useState } from "react";
import PropTypes from "prop-types";
import Hamburger from "./Hamburger";
import { NotificationBell } from "./svgindex";

const staticCitizenLogo = "https://try-digit-eks-yourname.s3.ap-south-1.amazonaws.com/rmc_logo.png";
const TopBar = ({ img, isMobile, logoUrl, onLogout, toggleSidebar, ulb, userDetails, notificationCount, notificationCountLoaded, cityOfCitizenShownBesideLogo, onNotificationIconClick, hideNotificationIconOnSomeUrlsWhenNotLoggedIn }) => {
  return (
    <div className="navbar">
      <div className="center-container">
        {isMobile && <Hamburger handleClick={toggleSidebar} />}
        <img
          className="city"
          id="topbar-logo" 
          // src={img || "https://cdn.jsdelivr.net/npm/@upyog/digit-ui-css@1.0.7/img/m_seva_white_logo.png"}
          // src ={staticCitizenLogo || "https://cdn.jsdelivr.net/npm/@upyog/digit-ui-css@1.0.7/img/m_seva_white_logo.png" }
          src="https://try-digit-eks-yourname.s3.ap-south-1.amazonaws.com/rmc_logo.png" 
          alt="mSeva"
        />
        <h3>{cityOfCitizenShownBesideLogo}</h3>
        <div className="RightMostTopBarOptions">
          {!hideNotificationIconOnSomeUrlsWhenNotLoggedIn ? <div className="EventNotificationWrapper" onClick={onNotificationIconClick}>
            { notificationCountLoaded && notificationCount ? <span><p>{notificationCount}</p></span> : null }
            <NotificationBell />
          </div> : null}
        </div>
      </div>
    </div>
  );
};

TopBar.propTypes = {
  img: PropTypes.string,
};

TopBar.defaultProps = {
  img: undefined,
};

export default TopBar;
