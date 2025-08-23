package org.egov.fsm.service.notification;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.fsm.config.FSMConfiguration;
import org.egov.fsm.web.model.FSMRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class WhatsappNotification {

	@Autowired
	private FSMConfiguration config;

	@Autowired
	RestTemplate restTemplate;

	public void sendWhatsappMessage(FSMRequest fsmRequest) {
		if (null != config.getIsWhatsappEnabled() && config.getIsWhatsappEnabled()) {

			if (fsmRequest.getFsm() == null) {
				return;
			}

			try {
				Map<String, Object> additionalDetails = (Map<String, Object>) fsmRequest.getFsm()
						.getAdditionalDetails();
				String status = fsmRequest.getFsm().getApplicationStatus();
//			String citizenName = fsmRequest.getFsm().getCitizen().getName();
				String citizenName = additionalDetails.get("applicantName").toString();
				String mobileNumber = additionalDetails.get("applicantMobileNumber").toString();
//			String mobileNumber = fsmRequest.getFsm().getCitizen().getMobileNumber();
				String applicationNo = fsmRequest.getFsm().getApplicationNo();
//			String amount = ((Map<String, Object>) fsmRequest.getFsm().getAdditionalDetails()).get("tripAmount")
//					.toString();
				String amount = additionalDetails.get("tripAmount").toString();

				Map<String, Object> requestBody = new HashMap<>();
				Map<String, Object> requestBodyDriver = new HashMap<>();

				if (status.equals("PENDING_FEE_PAYMENT")) {
					requestBody = applicationCreatedMessage(citizenName, applicationNo, amount, mobileNumber);
				} else if (status.equals("ASSIGN_DSO") || status.equals("ASSIGN_DRIVER")) {
					requestBody = feePaidMessage(citizenName, applicationNo, mobileNumber);
				} else if (status.equals("PENDING_WORK_START_BY_DRIVER")) {
					Map<String, Object> addressAdditionalDetails = (Map<String, Object>) fsmRequest.getFsm()
							.getAdditionalDetails();
					String vehicleNo = fsmRequest.getFsm().getVehicle().getRegistrationNumber();
					String driverName = fsmRequest.getFsm().getDriver().getName();
					String driverContNo = fsmRequest.getFsm().getDriver().getOwner().getMobileNumber();
					requestBody = assignDsoDriverMessage(citizenName, applicationNo, mobileNumber, vehicleNo,
							driverName, driverContNo);
					String address = "Door No " + fsmRequest.getFsm().getAddress().getDoorNo() + ", Street "
							+ fsmRequest.getFsm().getAddress().getStreet() + ", "
							+ fsmRequest.getFsm().getAddress().getLandmark();
//				String ward = fsmRequest.getFsm().getAddress().getWard().getName();
//				String zone = fsmRequest.getFsm().getAddress().getZone().getName();
					String ward = addressAdditionalDetails.get("wardName").toString();
					String zone = addressAdditionalDetails.get("zoneName").toString();

					requestBodyDriver = sentMessageToDriver(applicationNo, citizenName, mobileNumber, driverName,
							driverContNo, address, ward, zone);
				} else if (status.equals("CITIZEN_FEEDBACK_PENDING")) {
					requestBody = applicationFeedbackMessage(citizenName, mobileNumber);
				}

				HttpHeaders headers = new HttpHeaders();
				headers.setContentType(MediaType.APPLICATION_JSON);

				HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

				String url = "https://backend.api-wa.co/campaign/entit/api/v2";
				ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

				HttpStatus statusCode = response.getStatusCode();

				log.info("Whatsapp Message Sent, Status : " + status + " status Code " + statusCode);

				if (status.equals("PENDING_WORK_START_BY_DRIVER")) {
					log.info("Inside Whatsapp Message to Driver");
					HttpHeaders headersDriver = new HttpHeaders();
					headersDriver.setContentType(MediaType.APPLICATION_JSON);

					HttpEntity<Map<String, Object>> entityDriver = new HttpEntity<>(requestBodyDriver, headersDriver);

					String urlDriver = "https://backend.api-wa.co/campaign/entit/api/v2";
					ResponseEntity<String> responseDriver = restTemplate.postForEntity(urlDriver, entityDriver,
							String.class);

					HttpStatus statusCodeDriver = responseDriver.getStatusCode();

					log.info("Whatsapp Message Sent to Driver, status Code " + statusCodeDriver);

				}
			} catch (Exception e) {
				log.error("Error sending WhatsApp Message to Driver", e);
			}
		}

	}

	private Map<String, Object> applicationCreatedMessage(String citizenName, String applicationNo, String amount,
			String mobileNumber) {

		Map<String, Object> requestBody = new HashMap<>();

		requestBody.put("apiKey",
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YmRjNGIyY2Y5ZmU4MGJmZDAwYzJhMSIsIm5hbWUiOiJOYWdhciBOaWdhbSBSYWlwdXIiLCJhcHBOYW1lIjoiQWlTZW5zeSIsImNsaWVudElkIjoiNjdiZDZjMjNmN2JlN2QwZWZkMWRmNDBjIiwiYWN0aXZlUGxhbiI6Ik5PTkUiLCJpYXQiOjE3NDA0ODk5MDZ9.NBLaWEeCwg9Z3bwvaYrtOarkIRZbIuF7IwqZaqjxyjw");
		requestBody.put("campaignName", "fsm_appl_created");
		requestBody.put("destination", mobileNumber);
		requestBody.put("userName", "Nagar Nigam Raipur");
		requestBody.put("source", "new-landing-page form");

		List<Object> templateParams = new ArrayList<>();
		templateParams.add(citizenName);
		templateParams.add(applicationNo);
		templateParams.add(amount);

		requestBody.put("templateParams", templateParams);

		return requestBody;
	}

	private Map<String, Object> applicationFeedbackMessage(String citizenName, String mobileNumber) {

		Map<String, Object> requestBody = new HashMap<>();

		requestBody.put("apiKey",
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YmRjNGIyY2Y5ZmU4MGJmZDAwYzJhMSIsIm5hbWUiOiJOYWdhciBOaWdhbSBSYWlwdXIiLCJhcHBOYW1lIjoiQWlTZW5zeSIsImNsaWVudElkIjoiNjdiZDZjMjNmN2JlN2QwZWZkMWRmNDBjIiwiYWN0aXZlUGxhbiI6Ik5PTkUiLCJpYXQiOjE3NDA0ODk5MDZ9.NBLaWEeCwg9Z3bwvaYrtOarkIRZbIuF7IwqZaqjxyjw");
		requestBody.put("campaignName", "fsm_req_complete");
		requestBody.put("destination", mobileNumber);
		requestBody.put("userName", "Nagar Nigam Raipur");
		requestBody.put("source", "new-landing-page form");

		List<Object> templateParams = new ArrayList<>();
		templateParams.add(citizenName);

		requestBody.put("templateParams", templateParams);

		return requestBody;
	}

	private Map<String, Object> feePaidMessage(String citizenName, String applicationNo, String mobileNumber) {

		Map<String, Object> requestBody = new HashMap<>();

		requestBody.put("apiKey",
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YmRjNGIyY2Y5ZmU4MGJmZDAwYzJhMSIsIm5hbWUiOiJOYWdhciBOaWdhbSBSYWlwdXIiLCJhcHBOYW1lIjoiQWlTZW5zeSIsImNsaWVudElkIjoiNjdiZDZjMjNmN2JlN2QwZWZkMWRmNDBjIiwiYWN0aXZlUGxhbiI6Ik5PTkUiLCJpYXQiOjE3NDA0ODk5MDZ9.NBLaWEeCwg9Z3bwvaYrtOarkIRZbIuF7IwqZaqjxyjw");
		requestBody.put("campaignName", "fsm_fee_paid");
		requestBody.put("destination", mobileNumber);
		requestBody.put("userName", "Nagar Nigam Raipur");
		requestBody.put("source", "new-landing-page form");

		List<Object> templateParams = new ArrayList<>();
		templateParams.add(citizenName);
		templateParams.add(applicationNo);

		requestBody.put("templateParams", templateParams);

		return requestBody;
	}

	private Map<String, Object> assignDsoDriverMessage(String citizenName, String applicationNo, String mobileNumber,
			String vehicleNo, String driverName, String driverContNo) {

		Map<String, Object> requestBody = new HashMap<>();

		requestBody.put("apiKey",
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YmRjNGIyY2Y5ZmU4MGJmZDAwYzJhMSIsIm5hbWUiOiJOYWdhciBOaWdhbSBSYWlwdXIiLCJhcHBOYW1lIjoiQWlTZW5zeSIsImNsaWVudElkIjoiNjdiZDZjMjNmN2JlN2QwZWZkMWRmNDBjIiwiYWN0aXZlUGxhbiI6Ik5PTkUiLCJpYXQiOjE3NDA0ODk5MDZ9.NBLaWEeCwg9Z3bwvaYrtOarkIRZbIuF7IwqZaqjxyjw");
		requestBody.put("campaignName", "fsm_assign_dso");
		requestBody.put("destination", mobileNumber);
		requestBody.put("userName", "Nagar Nigam Raipur");
		requestBody.put("source", "new-landing-page form");

		List<String> templateParams = new ArrayList<>();
		templateParams.add(convertToString(citizenName));
		templateParams.add(convertToString(applicationNo));
		templateParams.add(convertToString(vehicleNo));
		templateParams.add(convertToString(driverName));
		templateParams.add(convertToString(driverContNo));

		requestBody.put("templateParams", templateParams);

		return requestBody;
	}

	private Map<String, Object> sentMessageToDriver(String applicationNo, String citizenName, String mobileNumber,
			String driverName, String driverContNo, String address, String ward, String zone) {
		log.info("driverContNo : " + driverContNo);
		Map<String, Object> requestBody = new HashMap<>();

		requestBody.put("apiKey",
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YmRjNGIyY2Y5ZmU4MGJmZDAwYzJhMSIsIm5hbWUiOiJOYWdhciBOaWdhbSBSYWlwdXIiLCJhcHBOYW1lIjoiQWlTZW5zeSIsImNsaWVudElkIjoiNjdiZDZjMjNmN2JlN2QwZWZkMWRmNDBjIiwiYWN0aXZlUGxhbiI6Ik5PTkUiLCJpYXQiOjE3NDA0ODk5MDZ9.NBLaWEeCwg9Z3bwvaYrtOarkIRZbIuF7IwqZaqjxyjw");
		requestBody.put("campaignName", "fsm_driver_notification");
		requestBody.put("destination", driverContNo);
		requestBody.put("userName", "Nagar Nigam Raipur");
		requestBody.put("source", "new-landing-page form");

		List<String> templateParams = new ArrayList<>();
		templateParams.add(convertToString(driverName));
		templateParams.add(convertToString(applicationNo));
		templateParams.add(convertToString(citizenName));
		templateParams.add(convertToString(mobileNumber));
		templateParams.add(convertToString(address));
		templateParams.add(convertToString(ward));
		templateParams.add(convertToString(zone));

		requestBody.put("templateParams", templateParams);

		return requestBody;
	}

	private String convertToString(String value) {
		return value == null ? " " : value;
	}
}
