-- =====================================================================
-- CIVIC TRANSPARENCY PLATFORM - SNOWFLAKE DATABASE INITIALIZATION SCRIPT
-- =====================================================================
-- Target Database: CIVIC_TRANSPARENCY_DB
-- Target Schema: PUBLIC
-- Target Warehouse: COMPUTE_WH (or CIVIC_TRANSPARENCY_WH)
-- =====================================================================

-- 1. Create Warehouse, Database & Schema
CREATE WAREHOUSE IF NOT EXISTS COMPUTE_WH 
  WITH WAREHOUSE_SIZE = 'XSMALL' 
  AUTO_SUSPEND = 60 
  AUTO_RESUME = TRUE;

CREATE DATABASE IF NOT EXISTS CIVIC_TRANSPARENCY_DB;
USE DATABASE CIVIC_TRANSPARENCY_DB;
CREATE SCHEMA IF NOT EXISTS PUBLIC;
USE SCHEMA PUBLIC;

-- 2. Create Public Works Projects Table
CREATE TABLE IF NOT EXISTS PROJECTS (
    ID VARCHAR(64) PRIMARY KEY,
    TITLE VARCHAR(255) NOT NULL,
    DEPARTMENT VARCHAR(128) NOT NULL,
    BUDGET NUMBER(15, 2) NOT NULL,
    STATUS VARCHAR(64) NOT NULL,
    LOCATION VARCHAR(255) NOT NULL,
    TIMELINE VARCHAR(128) NOT NULL,
    PROGRESS INT NOT NULL,
    CREATED_AT TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);

-- 3. Create Municipal Budgets Allocations Table
CREATE TABLE IF NOT EXISTS BUDGETS (
    ID VARCHAR(64) PRIMARY KEY,
    FISCAL_YEAR INT NOT NULL,
    DEPARTMENT VARCHAR(128) NOT NULL,
    ALLOCATED NUMBER(15, 2) NOT NULL,
    SPENT NUMBER(15, 2) NOT NULL,
    CREATED_AT TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);

-- 4. Create Citizen Feedback & Incident Reports Table
CREATE TABLE IF NOT EXISTS FEEDBACK_REPORTS (
    ID VARCHAR(64) PRIMARY KEY,
    REPORT_TYPE VARCHAR(128) NOT NULL,
    LOCATION VARCHAR(255) NOT NULL,
    DESCRIPTION TEXT NOT NULL,
    STATUS VARCHAR(64) NOT NULL DEFAULT 'Open',
    SUBMITTED_AT DATE DEFAULT CURRENT_DATE(),
    CREATED_AT TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);

-- =====================================================================
-- 5. Seed Data Population
-- =====================================================================

-- Seed PROJECTS
TRUNCATE TABLE PROJECTS;
INSERT INTO PROJECTS (ID, TITLE, DEPARTMENT, BUDGET, STATUS, LOCATION, TIMELINE, PROGRESS)
VALUES
    ('PRJ-8812', 'Oakridge High School Solar Retrofit', 'Energy & Environment', 1250000.00, 'In Progress', 'Ward 4 (North Metro)', 'Mar 2025 - Nov 2026', 68),
    ('PRJ-1024', 'Metro Transit Line-C Bus Lane Expansion', 'Infrastructure & Transit', 3400000.00, 'Completed', 'Downtown Core', 'Jan 2024 - Jun 2025', 100),
    ('PRJ-9904', 'Maple Street Bridge Safety Reconstruction', 'Public Works & Engineering', 4800000.00, 'Delayed', 'East Ward District', 'Sep 2024 - Dec 2026', 42),
    ('PRJ-7711', 'District 3 Smart Water Valve Integration', 'Utilities & Sanitation', 850000.00, 'Planned', 'District 3 Subdivisions', 'Aug 2026 - Mar 2027', 0);

-- Seed BUDGETS
TRUNCATE TABLE BUDGETS;
INSERT INTO BUDGETS (ID, FISCAL_YEAR, DEPARTMENT, ALLOCATED, SPENT)
VALUES
    ('BDG-2026-01', 2026, 'Education & Schools', 18000000.00, 12400000.00),
    ('BDG-2026-02', 2026, 'Public Safety (Police & Fire)', 12000000.00, 8100000.00),
    ('BDG-2026-03', 2026, 'Infrastructure & Roadways', 10000000.00, 9500000.00),
    ('BDG-2026-04', 2026, 'Parks, Health & Recreation', 5000000.00, 3200000.00);

-- Seed FEEDBACK_REPORTS
TRUNCATE TABLE FEEDBACK_REPORTS;
INSERT INTO FEEDBACK_REPORTS (ID, REPORT_TYPE, LOCATION, DESCRIPTION, STATUS, SUBMITTED_AT)
VALUES
    ('TCK-2201', 'Transit Delay / Traffic Control', 'Oakridge Blvd & 5th Ave Intersection', 'The traffic signal timing is causing massive backups during construction of the high school solar installation.', 'Under Investigation', '2026-07-16'),
    ('TCK-1982', 'Road Maintenance / Pothole', '124 Maple Street, East Ward', 'Huge pothole in front of the bridge crossing causing safety hazards for cycling commuters.', 'Resolved', '2026-07-12');

-- =====================================================================
-- 6. Cortex AI Function Execution Validation Query
-- =====================================================================
-- Verify Snowflake Cortex AI query capability:
-- SELECT SNOWFLAKE.CORTEX.COMPLETE('llama3-70b', 'Summarize the current progress of public works projects in 2 sentences.');
