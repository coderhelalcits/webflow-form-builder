-- FlowForm Database Schema DDL (PostgreSQL)

CREATE TABLE IF NOT EXISTS "User" (
    "id" VARCHAR(255) PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "webflowSiteId" VARCHAR(255) DEFAULT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Form" (
    "id" VARCHAR(255) PRIMARY KEY,
    "userId" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "fields" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "settings" JSONB NOT NULL DEFAULT '{}'::jsonb,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_form_user" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Submission" (
    "id" VARCHAR(255) PRIMARY KEY,
    "formId" VARCHAR(255) NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}'::jsonb,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_submission_form" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS "idx_user_email" ON "User"("email");
CREATE INDEX IF NOT EXISTS "idx_form_userId" ON "Form"("userId");
CREATE INDEX IF NOT EXISTS "idx_submission_formId" ON "Submission"("formId");
CREATE INDEX IF NOT EXISTS "idx_submission_createdAt" ON "Submission"("createdAt" DESC);
