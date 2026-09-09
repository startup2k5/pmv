package com.app.backend.common.jwt;

import lombok.Data;

@Data
public final class JwtClaim {
    public static final String ACCOUNT_UUID = "accountUuid";
    public static final String COMPANY_UUID = "companyUuid";
    public static final String BRANCH_UUID = "branchUuid";
    public static final String ROLE_UUID = "roleUuid";
}
