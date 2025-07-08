package org.egov.fsm.pt.web.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.fsm.pt.web.enums.Channel;
import org.egov.fsm.pt.web.enums.Source;
import org.egov.fsm.pt.web.enums.Status;
import org.egov.fsm.pt.web.model.Address;
import org.egov.fsm.pt.web.model.Locality;
import org.egov.fsm.pt.web.model.OwnerInfo;
import org.egov.fsm.pt.web.model.Property;
import org.egov.fsm.pt.web.model.PropertyCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PropertyService {

	@Autowired
	private RestTemplate restTemplate;

	public List<Property> getPropertiesById(PropertyCriteria criteria) throws Exception {
//		String propertyId = (criteria.getPropertyId() ) ? null
//				: criteria.getPropertyId();
		String propertyId = criteria.getPropertyId();
//		String mobileNumber = criteria.getMobileNumber();

		String propertyUrl = "https://mcraipur.in/api/getPropertyDetails?PROP_UID=" + propertyId;
		/*
		 * if (propertyId != null) { propertyUrl =
		 * "https://mcraipur.in/api/getPropertyDetails?PROP_UID=" + propertyId; } else
		 * if (mobileNumber != null) { propertyUrl =
		 * "https://apis.mcraipur.in/api/searchPropertyList?MOBILE=" + mobileNumber; }
		 */

		List<Property> properties = new ArrayList<>();

//		try {
//			Map<String, Object> propertySearchResponse = restTemplate.getForObject(propertyUrl, Map.class);
		String response = restTemplate.getForObject(propertyUrl, String.class);
		log.info("RMC response : " + response);
		ObjectMapper objectMapper = new ObjectMapper();
		Map<String, Object> propertySearchResponse = objectMapper.readValue(response,
				new TypeReference<Map<String, Object>>() {
				});

		Map<String, Object> propertyDetails = ((List<Map<String, Object>>) propertySearchResponse
				.get("GETPROPDETAILSResult")).get(0);

		log.info("RMC propertyDetails: " + propertyDetails.toString());
//			Property currentProperty = new Property();

//		for (Map<String, Object> propertyDetails : propertyDetailsList) {
		Object area = propertyDetails.get("TOTAL_PLOT_AREA");
		Double landArea = 0.0;
		if (area == null) {
			landArea = null;
		} else {
			landArea = Double.valueOf(area.toString());
		}
		Object wardNo = propertyDetails.get("WARD_NO");
		Object wardName = propertyDetails.get("WARD_NAME");
		Object zoneNO = propertyDetails.get("ZONE_NO");
		Locality locality = Locality.builder().code(wardNo != null ? "RMCLC" + wardNo.toString() : null)
				.name(wardName != null ? wardName.toString() : null).label("Locality").build();

		Map<String, Object> addressAdditional = new HashMap<>();

		addressAdditional.put("colonyName", propertyDetails.get("COLONY_NAME"));
		addressAdditional.put("houseNo", propertyDetails.get("HOUSE_NO"));
		addressAdditional.put("wardNo", propertyDetails.get("WARD_NO"));
		addressAdditional.put("address", propertyDetails.get("ADDRESS"));
		addressAdditional.put("zoneNo", propertyDetails.get("ZONE_NO"));

		Address address = Address.builder().city("Raipur").tenantId("cg.raipur")
				.wardNo(wardNo != null ? wardNo.toString() : null).zoneNo(wardNo != null ? zoneNO.toString() : null)
				.locality(locality).build();

		List<String> owners = Arrays.asList(propertyDetails.get("PROPERTY_OWNER").toString().split(","));
		String ownershipcategory = owners.size() == 1 ? "INDIVIDUAL.SINGLEOWNER" : "INDIVIDUAL.MULTIPLEOWNERS";

		Object coveredArea = propertyDetails.get("TOTAL_COVERED_AREA");
		BigDecimal superBuiltUpArea = coveredArea != null ? new BigDecimal(coveredArea.toString()) : BigDecimal.ZERO;
		Long noOfFloors = propertyDetails.get("TOTAL_FLOORS") != null
				? ((Number) propertyDetails.get("TOTAL_FLOORS")).longValue()
				: null;

		Property currentProperty = Property.builder().source(Source.fromValue("MUNICIPAL_RECORDS"))
				.ownershipCategory(ownershipcategory).channel(Channel.fromValue("SYSTEM"))
				.superBuiltUpArea(superBuiltUpArea).usageCategory(propertyDetails.get("PROPERTY_USE").toString())
//					.propertyType(rs.getString("propertytype"))
				.noOfFloors(noOfFloors)
//					.auditDetails(auditdetails)
				.landArea(landArea).address(address).propertyId(propertyDetails.get("PROP_UID").toString())
				.tenantId("cg.raipur").status(Status.fromValue("ACTIVE"))
				.dueAmount(propertyDetails.get("DUE_AMOUNT").toString()).build();

		OwnerInfo owner = OwnerInfo.builder().status(Status.fromValue("ACTIVE")).tenantId("cg.raipur")
				.mobileNumber(propertyDetails.get("MOBILE").toString())
				.name(propertyDetails.get("PROPERTY_OWNER").toString().split(",")[0]).build();

		currentProperty.addOwnersItem(owner);

		properties.add(currentProperty);
//		}

//		} catch (Exception ex) {
//			log.error("Error : " + ex.toString());
//		}
//		Property properties = new Property();
//		= getPropertiesPlainSearch(criteria, requestInfo);
		// enrichmentService.enrichBoundary(new PropertyRequest(requestInfo,
		// properties));
		return properties;
	}

}