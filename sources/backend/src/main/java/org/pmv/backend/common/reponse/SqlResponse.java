package org.pmv.backend.common.reponse;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SqlResponse<T> {
    private Boolean success;
    private String msg;
    private T data;

    @JsonAlias({"errors", "error"})
    private String errors;

    public String getError() {
        return this.errors;
    }

    public void setError(String error) {
        this.errors = error;
    }
}