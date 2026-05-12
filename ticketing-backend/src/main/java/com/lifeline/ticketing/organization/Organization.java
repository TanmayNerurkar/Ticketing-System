package com.lifeline.ticketing.organization;

import com.lifeline.ticketing.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "organizations")
@Getter
@Setter
public class Organization extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type;

    private String region;
    private String contactEmail;

    @Enumerated(EnumType.STRING)
    @Column(name = "sla_tier", nullable = false)
    private SlaTier slaTier = SlaTier.BRONZE;

    public enum Type { HOSPITAL, CLINIC }
    public enum SlaTier { BRONZE, SILVER, GOLD }
}