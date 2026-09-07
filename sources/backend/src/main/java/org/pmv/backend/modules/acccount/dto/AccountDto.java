package org.pmv.backend.modules.acccount.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import org.pmv.backend.entities.Branch;
import org.pmv.backend.entities.Role;

import java.util.List;

public class AccountDto {

    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Response {
        private Branch branch;
        private Role role;
        private List<String> permissions;
    }
}
