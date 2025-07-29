package org.egov.fsm.pt.web.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PropertyService {

	@Autowired
	private RestTemplate restTemplate;

	public List<Property> getPropertiesById(PropertyCriteria criteria) throws Exception {

		String propertyId = criteria.getPropertyIds();
		String mobileNumber = criteria.getMobileNumber();

		String propertyUrl;
		List<Property> properties = new ArrayList<>();

		if (propertyId != null) {
			properties.add(searchPropertyResult(propertyId));
		} else if (mobileNumber != null) {
			propertyUrl = propertyUrl = "https://apis.mcraipur.in/api/searchPropertyList?MOBILE=" + mobileNumber;
			String response = restTemplate.getForObject(propertyUrl, String.class);
			log.info("RMC response Mobile : " + response);
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String, Object> propertySearchResponse = objectMapper.readValue(response,
					new TypeReference<Map<String, Object>>() {
					});

			List<Map<String, Object>> propertyDetails = (List<Map<String, Object>>) propertySearchResponse
					.get("SearchPropertyResult");
			for (Map<String, Object> details : propertyDetails) {
				String propertyUid = details.get("PROPERTY_UID").toString();
				properties.add(searchPropertyResult(propertyUid));
			}
		}

		return properties;
	}

	public Property searchPropertyResult(String propertyId) throws Exception {

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
		Object zoneNo = propertyDetails.get("ZONE_NO");

		String wardCode = "RMCWD" + zoneNo;
		Map<String, Object> locationData = locationZoneSearchFromMdms("cg.raipur", wardCode);
		Map<String, Object> wards = (Map<String, Object>) locationData.get("ward");
		Map<String, Object> zones = (Map<String, Object>) locationData.get("zone");
		List<Map<String, Object>> localityList = (List<Map<String, Object>>) locationData.get("localityList");

//		Locality zone = Locality.builder().code(zoneNo != null ? "RMCZN" + zoneNo : null).build();
//		Locality ward = Locality.builder().code(wardNo != null ? "RMCWD" + wardNo : null)
//				.name(wardName != null ? wardName.toString() : null).build();
		Locality zone = Locality.builder().code(zones.get("code") != null ? zones.get("code").toString() : null)
				.name(zones.get("name") != null ? zones.get("name").toString() : null).build();

		Locality ward = Locality.builder().code(wards.get("code") != null ? wards.get("code").toString() : null)
				.name(wards.get("name") != null ? wards.get("name").toString() : null).build();

		Locality locality = null;
//		Locality locality = Locality.builder().code(wardNo != null ? "RMCLC" + wardNo.toString() : null)
//				.name(wardName != null ? wardName.toString() : null).label("Locality").build();

		Map<String, Object> addressAdditional = new HashMap<>();

		addressAdditional.put("colonyName", propertyDetails.get("COLONY_NAME"));
		addressAdditional.put("houseNo", propertyDetails.get("HOUSE_NO"));
		addressAdditional.put("wardNo", propertyDetails.get("WARD_NO"));
		addressAdditional.put("address", propertyDetails.get("ADDRESS"));
		addressAdditional.put("zoneNo", propertyDetails.get("ZONE_NO"));

		Address address = Address.builder().city("Raipur").tenantId("cg.raipur")
				.wardNo(wardNo != null ? wardNo.toString() : null).zoneNo(wardNo != null ? zoneNo.toString() : null)
				.locality(locality).zone(zone).ward(ward).additionalDetails(addressAdditional).build();

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
				.dueAmount(propertyDetails.get("DUE_AMOUNT").toString())
				.localityList(localityList).build();

		OwnerInfo owner = OwnerInfo.builder().status(Status.fromValue("ACTIVE")).tenantId("cg.raipur")
				.mobileNumber(propertyDetails.get("MOBILE").toString())
				.name(propertyDetails.get("PROPERTY_OWNER").toString().split(",")[0]).build();

		currentProperty.addOwnersItem(owner);

//		properties.add(currentProperty);
//
//		return properties;
		return currentProperty;
	}

	private Map<String, Object> locationZoneSearchFromMdms(String tenantId, String wardCode) {
		String url = "http://localhost:8091/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=REVENUE&boundaryType=Zone&tenantId="
				+ tenantId;
		Map<String, Object> response = restTemplate.getForObject(url, Map.class);
		List<Map<String, Object>> boundaryList = ((List<Map<String, Object>>) response.get("TenantBoundary")).stream()
				.flatMap(tenantBoundary -> ((List<Map<String, Object>>) tenantBoundary.get("boundary")).stream())
				.collect(Collectors.toList());
		List<Map<String, Object>> localityList = new ArrayList<>();
		Map<String, Object> matchedBlock = new HashMap<>();
		Map<String, Object> matchedZone = new HashMap<>();

		((List<Map<String, Object>>) boundaryList).stream()
				.filter(zone -> "Zone".equalsIgnoreCase((String) zone.get("label"))).forEach(zone -> {
					List<Map<String, Object>> blocks = (List<Map<String, Object>>) zone.get("children");
					if (blocks != null) {
						blocks.stream().filter(block -> wardCode.equals(block.get("code"))).findFirst()
								.ifPresent(block -> {
									// Store matched zone without children
									zone.entrySet().stream().filter(e -> !"children".equals(e.getKey()))
											.forEach(e -> matchedZone.put(e.getKey(), e.getValue()));

									// Store matched block without children
									block.entrySet().stream().filter(e -> !"children".equals(e.getKey()))
											.forEach(e -> matchedBlock.put(e.getKey(), e.getValue()));

									// Get all localities
									List<Map<String, Object>> localities = (List<Map<String, Object>>) block
											.get("children");
									if (localities != null) {
										localityList.addAll(localities);
									}
								});
					}
				});

		Map<String, Object> locationData = new HashMap<>();
		locationData.put("zone", matchedZone);
		locationData.put("ward", matchedBlock);
		locationData.put("localityList", localityList);

		return locationData;
	}

	/*
	 * public List<Property> getPropertiesById(PropertyCriteria criteria) throws
	 * Exception { // String propertyId = (criteria.getPropertyId() ) ? null // :
	 * criteria.getPropertyId(); String propertyId = criteria.getPropertyId(); //
	 * String mobileNumber = criteria.getMobileNumber();
	 * 
	 * String propertyUrl = "https://mcraipur.in/api/getPropertyDetails?PROP_UID=" +
	 * propertyId;
	 * 
	 * if (propertyId != null) { propertyUrl =
	 * "https://mcraipur.in/api/getPropertyDetails?PROP_UID=" + propertyId; } else
	 * if (mobileNumber != null) { propertyUrl =
	 * "https://apis.mcraipur.in/api/searchPropertyList?MOBILE=" + mobileNumber; }
	 * 
	 * 
	 * List<Property> properties = new ArrayList<>();
	 * 
	 * // try { // Map<String, Object> propertySearchResponse =
	 * restTemplate.getForObject(propertyUrl, Map.class); String response =
	 * restTemplate.getForObject(propertyUrl, String.class);
	 * log.info("RMC response : " + response); ObjectMapper objectMapper = new
	 * ObjectMapper(); Map<String, Object> propertySearchResponse =
	 * objectMapper.readValue(response, new TypeReference<Map<String, Object>>() {
	 * });
	 * 
	 * Map<String, Object> propertyDetails = ((List<Map<String, Object>>)
	 * propertySearchResponse .get("GETPROPDETAILSResult")).get(0);
	 * 
	 * log.info("RMC propertyDetails: " + propertyDetails.toString()); // Property
	 * currentProperty = new Property();
	 * 
	 * // for (Map<String, Object> propertyDetails : propertyDetailsList) { Object
	 * area = propertyDetails.get("TOTAL_PLOT_AREA"); Double landArea = 0.0; if
	 * (area == null) { landArea = null; } else { landArea =
	 * Double.valueOf(area.toString()); } Object wardNo =
	 * propertyDetails.get("WARD_NO"); Object wardName =
	 * propertyDetails.get("WARD_NAME"); Object zoneNO =
	 * propertyDetails.get("ZONE_NO"); Locality locality =
	 * Locality.builder().code(wardNo != null ? "RMCLC" + wardNo.toString() : null)
	 * .name(wardName != null ? wardName.toString() :
	 * null).label("Locality").build();
	 * 
	 * Map<String, Object> addressAdditional = new HashMap<>();
	 * 
	 * addressAdditional.put("colonyName", propertyDetails.get("COLONY_NAME"));
	 * addressAdditional.put("houseNo", propertyDetails.get("HOUSE_NO"));
	 * addressAdditional.put("wardNo", propertyDetails.get("WARD_NO"));
	 * addressAdditional.put("address", propertyDetails.get("ADDRESS"));
	 * addressAdditional.put("zoneNo", propertyDetails.get("ZONE_NO"));
	 * 
	 * Address address = Address.builder().city("Raipur").tenantId("cg.raipur")
	 * .wardNo(wardNo != null ? wardNo.toString() : null).zoneNo(wardNo != null ?
	 * zoneNO.toString() : null) .locality(locality).build();
	 * 
	 * List<String> owners =
	 * Arrays.asList(propertyDetails.get("PROPERTY_OWNER").toString().split(","));
	 * String ownershipcategory = owners.size() == 1 ? "INDIVIDUAL.SINGLEOWNER" :
	 * "INDIVIDUAL.MULTIPLEOWNERS";
	 * 
	 * Object coveredArea = propertyDetails.get("TOTAL_COVERED_AREA"); BigDecimal
	 * superBuiltUpArea = coveredArea != null ? new
	 * BigDecimal(coveredArea.toString()) : BigDecimal.ZERO; Long noOfFloors =
	 * propertyDetails.get("TOTAL_FLOORS") != null ? ((Number)
	 * propertyDetails.get("TOTAL_FLOORS")).longValue() : null;
	 * 
	 * Property currentProperty =
	 * Property.builder().source(Source.fromValue("MUNICIPAL_RECORDS"))
	 * .ownershipCategory(ownershipcategory).channel(Channel.fromValue("SYSTEM"))
	 * .superBuiltUpArea(superBuiltUpArea).usageCategory(propertyDetails.get(
	 * "PROPERTY_USE").toString()) // .propertyType(rs.getString("propertytype"))
	 * .noOfFloors(noOfFloors) // .auditDetails(auditdetails)
	 * .landArea(landArea).address(address).propertyId(propertyDetails.get(
	 * "PROP_UID").toString())
	 * .tenantId("cg.raipur").status(Status.fromValue("ACTIVE"))
	 * .dueAmount(propertyDetails.get("DUE_AMOUNT").toString()).build();
	 * 
	 * OwnerInfo owner =
	 * OwnerInfo.builder().status(Status.fromValue("ACTIVE")).tenantId("cg.raipur")
	 * .mobileNumber(propertyDetails.get("MOBILE").toString())
	 * .name(propertyDetails.get("PROPERTY_OWNER").toString().split(",")[0]).build()
	 * ;
	 * 
	 * currentProperty.addOwnersItem(owner);
	 * 
	 * properties.add(currentProperty); // }
	 * 
	 * // } catch (Exception ex) { // log.error("Error : " + ex.toString()); // } //
	 * Property properties = new Property(); // = getPropertiesPlainSearch(criteria,
	 * requestInfo); // enrichmentService.enrichBoundary(new
	 * PropertyRequest(requestInfo, // properties)); return properties; }
	 */
}