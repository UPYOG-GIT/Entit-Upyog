package org.egov.fsm.pt.web.model;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Address
 */
@Validated
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class PropertyAudit {

    @JsonProperty("audituuid")
    private String audituuid;

    @JsonProperty("auditcreatedTime")
    private Long auditcreatedTime;

    @JsonProperty("propertyid")
    private String propertyId;

    @JsonProperty("Property")
    private Property property;

}