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
			String status = fsmRequest.getFsm().getApplicationStatus();
			String citizenName = fsmRequest.getFsm().getCitizen().getName();
			String mobileNumber = fsmRequest.getFsm().getCitizen().getMobileNumber();
			String applicationNo = fsmRequest.getFsm().getApplicationNo();
			String amount = ((Map<String, Object>) fsmRequest.getFsm().getAdditionalDetails()).get("tripAmount")
					.toString();

			Map<String, Object> requestBody = new HashMap<>();
			if (status.equals("PENDING_FEE_PAYMENT")) {
				requestBody = applicationCreatedMessage(citizenName, applicationNo, amount, mobileNumber);
			} else if (status.equals("ASSIGN_DSO") || status.equals("ASSIGN_DRIVER")) {
				requestBody = feePaidMessage(citizenName, applicationNo, mobileNumber);
			} else if (status.equals("PENDING_WORK_START_BY_DRIVER")) {
				String vehicleNo = fsmRequest.getFsm().getVehicle().getRegistrationNumber();
				String driverName = fsmRequest.getFsm().getDriver().getName();
				String driverContNo = fsmRequest.getFsm().getDriver().getOwner().getMobileNumber();
				requestBody = assignDsoDriverMessage(citizenName, applicationNo, mobileNumber, vehicleNo, driverName,
						driverContNo);
			}

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON);

			HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

			String url = "https://backend.api-wa.co/campaign/entit/api/v2";
			ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

			HttpStatus statusCode = response.getStatusCode();

			log.info("Whatsapp Message Sent status Code " + statusCode);

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

		List<Object> templateParams = new ArrayList<>();
		templateParams.add(citizenName);
		templateParams.add(applicationNo);
		templateParams.add(vehicleNo);
		templateParams.add(driverName);
		templateParams.add(driverContNo);

		requestBody.put("templateParams", templateParams);

		return requestBody;
	}
}
