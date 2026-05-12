package com.lifeline.ticketing.technician;

import com.lifeline.ticketing.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "technicians")
@Getter
@Setter
public class Technician {

    @Id
    @Column(name = "user_id")
    private UUID userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(columnDefinition = "text[]")
    private List<String> skills;

    @Enumerated(EnumType.STRING)
    private Shift shift = Shift.ANY;

    @Column(name = "is_available")
    private boolean available = true;

    private int maxConcurrent = 10;
    private int activeTicketCount = 0;

    public enum Shift { DAY, NIGHT, ANY }
}