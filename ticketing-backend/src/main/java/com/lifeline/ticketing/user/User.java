package com.lifeline.ticketing.user;

import com.lifeline.ticketing.common.BaseEntity;
import com.lifeline.ticketing.organization.Organization;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User extends BaseEntity {

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String fullName;

    private String passwordHash;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String azureOid;
    private String outlookEmail;

    @Column(name = "is_active")
    private boolean active = true;
}