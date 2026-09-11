CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS system;
CREATE SCHEMA IF NOT EXISTS business;
CREATE SCHEMA IF NOT EXISTS setting;

CREATE TABLE IF NOT EXISTS public.init_data_history (
    id BIGSERIAL,
    uuid UUID NOT NULL DEFAULT uuidv7(),

    code VARCHAR(255) NOT NULL,
    description TEXT,

    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_init_data_history PRIMARY KEY (id),
    CONSTRAINT uq_init_data_history_uuid UNIQUE (uuid),
    CONSTRAINT uq_init_data_history_code UNIQUE (code)
);

-- AUTH.ACCOUNTS
CREATE TABLE IF NOT EXISTS auth.accounts (
    id BIGSERIAL,
    uuid UUID NOT NULL DEFAULT uuidv7(),

    fk_create_by BIGINT NULL,
    fk_update_by BIGINT NULL,

    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_accounts PRIMARY KEY (id),
    CONSTRAINT uq_accounts_uuid UNIQUE (uuid),
    CONSTRAINT uq_accounts_username UNIQUE (username),
    CONSTRAINT fk_accounts_create_by FOREIGN KEY (fk_create_by) REFERENCES auth.accounts(id) ON DELETE SET NULL,
    CONSTRAINT fk_accounts_update_by FOREIGN KEY (fk_update_by) REFERENCES auth.accounts(id) ON DELETE SET NULL
);

-- AUTH.PERMISSIONS (phan cap cha - con, ho tro ca SYSTEM va BRANCH)
CREATE TABLE IF NOT EXISTS auth.permissions (
    id BIGSERIAL,
    uuid UUID NOT NULL DEFAULT uuidv7(),

    fk_create_by BIGINT NULL,
    fk_update_by BIGINT NULL,
    fk_parent_id BIGINT NULL, -- NULL = nhom cha

    code VARCHAR(100) NOT NULL, 
    name VARCHAR(100) NOT NULL,
    scope VARCHAR(20) NOT NULL DEFAULT 'BRANCH', -- 'ALL', 'SYSTEM', 'BRANCH'
    action VARCHAR(20) NULL,

    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_permissions PRIMARY KEY (id),
    CONSTRAINT uq_permissions_uuid UNIQUE (uuid),
    CONSTRAINT uq_permissions_code UNIQUE (code),
    CONSTRAINT fk_permissions_parent FOREIGN KEY (fk_parent_id) REFERENCES auth.permissions(id) ON DELETE CASCADE,
    CONSTRAINT fk_permissions_create_by FOREIGN KEY (fk_create_by) REFERENCES auth.accounts(id) ON DELETE SET NULL,
    CONSTRAINT fk_permissions_update_by FOREIGN KEY (fk_update_by) REFERENCES auth.accounts(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_permissions_parent ON auth.permissions(fk_parent_id);
CREATE INDEX IF NOT EXISTS idx_permissions_scope ON auth.permissions(scope);

-- AUTH.ROLES (ho tro ca SYSTEM va BRANCH qua scope)
CREATE TABLE IF NOT EXISTS auth.roles (
    id BIGSERIAL,
    uuid UUID NOT NULL DEFAULT uuidv7(),

    fk_create_by BIGINT NULL,
    fk_update_by BIGINT NULL,

    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    scope VARCHAR(20) NOT NULL DEFAULT 'BRANCH', -- 'SYSTEM', 'BRANCH'
    description TEXT NULL,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_roles PRIMARY KEY (id),
    CONSTRAINT uq_roles_uuid UNIQUE (uuid),
    CONSTRAINT uq_roles_code UNIQUE (code),
    CONSTRAINT fk_roles_create_by FOREIGN KEY (fk_create_by) REFERENCES auth.accounts(id) ON DELETE SET NULL,
    CONSTRAINT fk_roles_update_by FOREIGN KEY (fk_update_by) REFERENCES auth.accounts(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_roles_scope ON auth.roles(scope);

-- AUTH.ROLE_PERMISSIONS (gan permission vao role)
CREATE TABLE IF NOT EXISTS auth.role_permissions (
    id BIGSERIAL,
    uuid UUID NOT NULL DEFAULT uuidv7(),

    fk_role_id BIGINT NOT NULL,
    fk_permission_id BIGINT NOT NULL,

    CONSTRAINT pk_role_permissions PRIMARY KEY (id),
    CONSTRAINT uq_role_permissions_uuid UNIQUE (uuid),
    CONSTRAINT uq_role_permissions UNIQUE (fk_role_id, fk_permission_id),
    CONSTRAINT fk_rp_role FOREIGN KEY (fk_role_id) REFERENCES auth.roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_rp_permission FOREIGN KEY (fk_permission_id) REFERENCES auth.permissions(id) ON DELETE CASCADE
);

-- BUSINESS.COMPANIES
CREATE TABLE IF NOT EXISTS business.companies (
    id BIGSERIAL,
    uuid UUID NOT NULL DEFAULT uuidv7(),

    fk_create_by BIGINT NULL,
    fk_update_by BIGINT NULL,

    name VARCHAR(255) NULL DEFAULT '',
    address VARCHAR(255) NULL DEFAULT '',

    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT pk_companies PRIMARY KEY (id),
    CONSTRAINT uq_companies_uuid UNIQUE (uuid),
    CONSTRAINT fk_companies_create_by FOREIGN KEY (fk_create_by) REFERENCES auth.accounts(id) ON DELETE SET NULL,
    CONSTRAINT fk_companies_update_by FOREIGN KEY (fk_update_by) REFERENCES auth.accounts(id) ON DELETE SET NULL
);

-- BUSINESS.BRANCHES
CREATE TABLE IF NOT EXISTS business.branches (
    id BIGSERIAL,
    uuid UUID NOT NULL DEFAULT uuidv7(),

    fk_company_id BIGINT NOT NULL, -- thuoc cong ty nao
    fk_create_by BIGINT NULL,
    fk_update_by BIGINT NULL,

    name VARCHAR(255) NULL DEFAULT '',
    address VARCHAR(255) NULL DEFAULT '',
    tax_code VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,

    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_branches PRIMARY KEY (id),
    CONSTRAINT uq_branches_uuid UNIQUE (uuid),
    CONSTRAINT fk_branches_company FOREIGN KEY (fk_company_id) REFERENCES business.companies(id) ON DELETE CASCADE,
    CONSTRAINT fk_branches_create_by FOREIGN KEY (fk_create_by) REFERENCES auth.accounts(id) ON DELETE SET NULL,
    CONSTRAINT fk_branches_update_by FOREIGN KEY (fk_update_by) REFERENCES auth.accounts(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_branches_uuid ON business.branches(uuid);
CREATE INDEX IF NOT EXISTS idx_branches_company_id ON business.branches(fk_company_id);

-- BUSINESS.EMPLOYEES
-- 1 account chi thuoc 1 branch duy nhat <> cong ty duy nhat
CREATE TABLE IF NOT EXISTS business.employees (
    fk_account_id BIGINT NOT NULL,

    fk_company_id BIGINT NOT NULL, -- thuoc cong ty nao
    fk_branch_id BIGINT NULL, -- thuoc chi nhanh nao, null la he thong
    fk_role_id BIGINT NULL,

    scope VARCHAR(20) NOT NULL DEFAULT 'BRANCH', -- 'SYSTEM', 'BRANCH'
    is_active BOOLEAN DEFAULT TRUE,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_employees PRIMARY KEY (fk_account_id),
    CONSTRAINT fk_employees_account FOREIGN KEY (fk_account_id) REFERENCES auth.accounts(id) ON DELETE CASCADE,
    CONSTRAINT fk_employees_company FOREIGN KEY (fk_company_id) REFERENCES business.companies(id) ON DELETE CASCADE,
    CONSTRAINT fk_employees_branch FOREIGN KEY (fk_branch_id) REFERENCES business.branches(id) ON DELETE CASCADE,
    CONSTRAINT fk_employees_role FOREIGN KEY (fk_role_id) REFERENCES auth.roles(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_employees_company_id ON business.employees(fk_company_id);
CREATE INDEX IF NOT EXISTS idx_employees_branch_id ON business.employees(fk_branch_id);
CREATE INDEX IF NOT EXISTS idx_employees_role_id ON business.employees(fk_role_id);

ALTER TABLE business.employees ADD COLUMN IF NOT EXISTS scope VARCHAR(20) NOT NULL DEFAULT 'BRANCH';