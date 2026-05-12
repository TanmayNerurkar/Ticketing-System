package com.lifeline.ticketing.common.security;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Component
public class JwtAuthConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        String role = jwt.getClaimAsString("role");
        Collection<GrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + role)
        );

        String orgIdStr = jwt.getClaimAsString("orgId");
        UUID orgId = (orgIdStr != null && !orgIdStr.isEmpty()) ? UUID.fromString(orgIdStr) : null;

        AuthenticatedUser principal = new AuthenticatedUser(
                UUID.fromString(jwt.getSubject()),
                jwt.getClaimAsString("email"),
                role,
                orgId
        );

        return new JwtAuthenticationToken(jwt, authorities, principal.email()) {
            private static final long serialVersionUID = 1L;

            @Override
            public Object getPrincipal() {
                return principal;
            }
        };
    }
}