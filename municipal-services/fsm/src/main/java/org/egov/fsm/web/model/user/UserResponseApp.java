package org.egov.fsm.web.model.user;

import java.util.List;

import org.egov.common.contract.response.ResponseInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class UserResponseApp {

	@JsonProperty("access_token")
    String accessToken;
	
	@JsonProperty("ResponseInfo")
    ResponseInfo responseInfo;
	
    @JsonProperty("UserRequest")
    User user;
}
