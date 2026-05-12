CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =================== Organizations ===================
CREATE TABLE organizations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(200) NOT NULL,
    type            VARCHAR(20) NOT NULL CHECK (type IN ('HOSPITAL', 'CLINIC')),
    region          VARCHAR(100),
    contact_email   VARCHAR(200),
    sla_tier        VARCHAR(20) NOT NULL DEFAULT 'BRONZE' CHECK (sla_tier IN ('BRONZE','SILVER','GOLD')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    version         BIGINT NOT NULL DEFAULT 0
);

-- =================== Users ===================
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    email           VARCHAR(200) NOT NULL UNIQUE,
    full_name       VARCHAR(200) NOT NULL,
    password_hash   VARCHAR(200),
    role            VARCHAR(20) NOT NULL CHECK (role IN ('CLIENT','TECHNICIAN','MANAGER','ADMIN')),
    azure_oid       VARCHAR(100) UNIQUE,
    outlook_email   VARCHAR(200),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    version         BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_users_org ON users(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role) WHERE deleted_at IS NULL;

-- =================== Technicians ===================
CREATE TABLE technicians (
    user_id              UUID PRIMARY KEY REFERENCES users(id),
    skills               TEXT[] NOT NULL DEFAULT '{}',
    shift                VARCHAR(20) NOT NULL DEFAULT 'ANY' CHECK (shift IN ('DAY','NIGHT','ANY')),
    is_available         BOOLEAN NOT NULL DEFAULT TRUE,
    max_concurrent       INT NOT NULL DEFAULT 10,
    active_ticket_count  INT NOT NULL DEFAULT 0
);

-- =================== Categories ===================
CREATE TABLE categories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    subcategories   TEXT[] NOT NULL DEFAULT '{}',
    required_skill  VARCHAR(50),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =================== Tickets ===================
CREATE SEQUENCE ticket_number_seq START 1;

CREATE TABLE tickets (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number       VARCHAR(20) NOT NULL UNIQUE,
    organization_id     UUID NOT NULL REFERENCES organizations(id),
    reporter_id         UUID NOT NULL REFERENCES users(id),
    assignee_id         UUID REFERENCES users(id),
    category_id         UUID REFERENCES categories(id),
    subcategory         VARCHAR(100),
    title               VARCHAR(300) NOT NULL,
    description         TEXT NOT NULL,
    status              VARCHAR(20) NOT NULL DEFAULT 'OPEN'
                        CHECK (status IN ('OPEN','ASSIGNED','IN_PROGRESS','WAITING_CLIENT','RESOLVED','CLOSED')),
    priority            VARCHAR(10) NOT NULL DEFAULT 'MEDIUM'
                        CHECK (priority IN ('LOW','MEDIUM','HIGH','CRITICAL')),
    is_blocking_work    BOOLEAN NOT NULL DEFAULT FALSE,
    affects_others      BOOLEAN NOT NULL DEFAULT FALSE,
    noticed_at          TIMESTAMPTZ,
    best_contact_time   VARCHAR(20) DEFAULT 'ANYTIME'
                        CHECK (best_contact_time IN ('MORNING','AFTERNOON','ANYTIME')),
    sla_due_at          TIMESTAMPTZ,
    resolved_at         TIMESTAMPTZ,
    closed_at           TIMESTAMPTZ,
    breach_alerted_at   TIMESTAMPTZ,
    resolution_notes    TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ,
    version             BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_tickets_org_status ON tickets(organization_id, status, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_tickets_assignee_active ON tickets(assignee_id, status)
    WHERE status IN ('ASSIGNED','IN_PROGRESS','WAITING_CLIENT') AND deleted_at IS NULL;
CREATE INDEX idx_tickets_sla_open ON tickets(sla_due_at)
    WHERE status NOT IN ('RESOLVED','CLOSED') AND deleted_at IS NULL;

-- =================== Comments ===================
CREATE TABLE ticket_comments (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id   UUID NOT NULL REFERENCES tickets(id),
    author_id   UUID NOT NULL REFERENCES users(id),
    body        TEXT NOT NULL,
    is_internal BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at  TIMESTAMPTZ,
    version     BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_comments_ticket ON ticket_comments(ticket_id, created_at);

-- =================== Attachments ===================
CREATE TABLE ticket_attachments (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id     UUID NOT NULL REFERENCES tickets(id),
    blob_path     VARCHAR(500) NOT NULL,
    file_name     VARCHAR(300) NOT NULL,
    size_bytes    BIGINT NOT NULL,
    content_type  VARCHAR(100),
    uploaded_by   UUID NOT NULL REFERENCES users(id),
    uploaded_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =================== History ===================
CREATE TABLE ticket_history (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id   UUID NOT NULL REFERENCES tickets(id),
    actor_id    UUID REFERENCES users(id),
    action      VARCHAR(200) NOT NULL,
    old_value   JSONB,
    new_value   JSONB,
    at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_history_ticket ON ticket_history(ticket_id, at DESC);