-- ============================================================================
-- CEGS Recruitment Portal - Database Migration Script
-- Non-destructive: Adds candidate_applications and client_enquiries tables
-- ============================================================================

USE `cegs_db`;

-- ----------------------------------------------------------------------------
-- 1. Candidate Applications Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `candidate_applications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(100) NOT NULL,
  `job_id` INT DEFAULT NULL,
  `job_title` VARCHAR(255) DEFAULT NULL,
  `experience` VARCHAR(100) DEFAULT NULL,
  `current_ctc` VARCHAR(100) DEFAULT NULL,
  `expected_ctc` VARCHAR(100) DEFAULT NULL,
  `linkedin_url` VARCHAR(255) DEFAULT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `skills` TEXT DEFAULT NULL,
  `cover_message` TEXT DEFAULT NULL,
  `resume_filename` VARCHAR(255) DEFAULT NULL,
  `resume_path` VARCHAR(255) DEFAULT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'New',
  `recruiter_notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_cand_status` (`status`),
  INDEX `idx_cand_job_id` (`job_id`),
  INDEX `idx_cand_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. Client Enquiries Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `client_enquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `company_name` VARCHAR(255) NOT NULL,
  `contact_person` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(100) NOT NULL,
  `company_website` VARCHAR(255) DEFAULT NULL,
  `business_location` VARCHAR(255) DEFAULT NULL,
  `partnership_type` VARCHAR(255) DEFAULT NULL,
  `geographic_coverage` VARCHAR(255) DEFAULT NULL,
  `industries_roles` TEXT DEFAULT NULL,
  `company_introduction` TEXT DEFAULT NULL,
  `existing_network` TEXT DEFAULT NULL,
  `partnership_requirement` TEXT DEFAULT NULL,
  `additional_message` TEXT DEFAULT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'New',
  `recruiter_notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_enq_status` (`status`),
  INDEX `idx_enq_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
