package com.lifeline.ticketing.comment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCommentRequest(
        @NotBlank @Size(max = 5000) String body,
        boolean internal
) {
}