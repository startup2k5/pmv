CREATE OR REPLACE FUNCTION auth.fn_get_permission_tree(
    p_scope VARCHAR DEFAULT NULL,
    p_parent_id BIGINT DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
    v_tree JSON;
BEGIN
    SELECT COALESCE(
        json_agg(
            json_build_object(
                'id', p.id,
                'uuid', p.uuid,
                'parentId', p.fk_parent_id,
                'code', p.code,
                'name', p.name,
                'scope', p.scope,
                'action', p.action,
                'createAt', p.create_at,
                'children', auth.fn_get_permission_tree(p_scope, p.id)
            ) ORDER BY p.create_at ASC
        ),
        '[]'::json
    ) INTO v_tree
    FROM auth.permissions p
    WHERE (
        (p_scope IS NULL)
        OR (p_scope = 'SYSTEM' AND p.scope IN ('SYSTEM', 'ALL'))
        OR (p_scope = 'BRANCH' AND p.scope IN ('BRANCH', 'ALL'))
        OR (p.scope = p_scope)
    )
    AND (
        (p_parent_id IS NULL AND p.fk_parent_id IS NULL)
        OR (p_parent_id IS NOT NULL AND p.fk_parent_id = p_parent_id)
    );

    IF p_parent_id IS NULL THEN
        RETURN system.fn_response(TRUE, NULL, 'Lay danh sach cay phan quyen thanh cong', v_tree);
    END IF;

    RETURN v_tree;
END;
$$ LANGUAGE plpgsql STABLE;

-- Lấy cây phân quyền theo vai trò cụ thể:
-- 1. SYSTEM_ADMIN: Lấy toàn bộ quyền SYSTEM + ALL
-- 2. BRANCH_ADMIN: Lấy toàn bộ quyền BRANCH + ALL
-- 3. Nhân viên: Lấy quyền ALL + các quyền được cấp phép trong role_permissions
CREATE OR REPLACE FUNCTION auth.fn_get_permission_tree_by_role(
    p_role_id BIGINT,
    p_parent_id BIGINT DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
    v_tree JSON;
    v_role_code VARCHAR;
    v_role_scope VARCHAR;
    v_is_sys_admin BOOLEAN := FALSE;
    v_is_branch_admin BOOLEAN := FALSE;
BEGIN
    SELECT code, scope INTO v_role_code, v_role_scope
    FROM auth.roles
    WHERE id = p_role_id;

    IF v_role_code IN ('SYSTEM_ADMIN', 'SYS_ADMIN') THEN
        v_is_sys_admin := TRUE;
    ELSIF (v_role_code IN ('BRANCH_ADMIN', 'BRANCH_MANAGER') OR v_role_code LIKE '%ADMIN%') AND v_role_scope = 'BRANCH' THEN
        v_is_branch_admin := TRUE;
    END IF;

    SELECT COALESCE(
        json_agg(
            json_build_object(
                'id', p.id,
                'uuid', p.uuid,
                'parentId', p.fk_parent_id,
                'code', p.code,
                'name', p.name,
                'scope', p.scope,
                'action', p.action,
                'createAt', p.create_at,
                'children', auth.fn_get_permission_tree_by_role(p_role_id, p.id)
            ) ORDER BY p.create_at ASC
        ),
        '[]'::json
    ) INTO v_tree
    FROM auth.permissions p
    WHERE (
        (p_parent_id IS NULL AND p.fk_parent_id IS NULL)
        OR (p_parent_id IS NOT NULL AND p.fk_parent_id = p_parent_id)
    )
    AND (
        (v_is_sys_admin AND p.scope IN ('SYSTEM', 'ALL'))
        OR (v_is_branch_admin AND p.scope IN ('BRANCH', 'ALL'))
        OR (
            NOT v_is_sys_admin AND NOT v_is_branch_admin AND (
                p.scope = 'ALL'
                OR (
                    p.scope = v_role_scope
                    AND (
                        p.id IN (SELECT fk_permission_id FROM auth.role_permissions WHERE fk_role_id = p_role_id)
                        OR EXISTS (
                            WITH RECURSIVE subordinates AS (
                                SELECT id, fk_parent_id FROM auth.permissions WHERE fk_parent_id = p.id
                                UNION
                                SELECT sub.id, sub.fk_parent_id FROM auth.permissions sub
                                JOIN subordinates s ON s.id = sub.fk_parent_id
                            )
                            SELECT 1 FROM subordinates s
                            JOIN auth.role_permissions rp ON rp.fk_permission_id = s.id
                            WHERE rp.fk_role_id = p_role_id
                        )
                    )
                )
            )
        )
    );

    IF p_parent_id IS NULL THEN
        RETURN system.fn_response(TRUE, NULL, 'Lay danh sach cay phan quyen theo vai tro thanh cong', v_tree);
    END IF;

    RETURN v_tree;
END;
$$ LANGUAGE plpgsql STABLE;