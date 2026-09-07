-- Function giúp dữ liệu trả về chuẩn hóa cho toàn hệ thống
CREATE OR REPLACE FUNCTION system.fn_response (
    p_success BOOLEAN DEFAULT TRUE,
    p_errors VARCHAR(50) DEFAULT NULL,
    p_message VARCHAR(255) DEFAULT NULL,
    p_data JSON DEFAULT NULL
) RETURNS JSON AS $$
BEGIN
    RETURN json_build_object(
            'success', p_success,
            'errors', p_errors,
            'msg', p_message,
            'data', p_data
           );
END;
$$ LANGUAGE plpgsql;