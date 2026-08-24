-- ============================================================================
-- CEGS Recruitment Portal - Database Setup Script
-- Compatible with MySQL 5.7+ / MySQL 8.0+ / MariaDB
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `cegs_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `cegs_db`;

-- ----------------------------------------------------------------------------
-- 1. Jobs Table (Matches exact user specifications)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `company_name` VARCHAR(255) NOT NULL,
  `job_role` VARCHAR(255) NOT NULL,
  `salary` VARCHAR(100) NOT NULL,
  `qualification` VARCHAR(255) NOT NULL,
  `language_required` VARCHAR(255) NOT NULL,
  `shift_details` VARCHAR(100) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `cab_facility` VARCHAR(100) DEFAULT NULL,
  `additional_notes` TEXT DEFAULT NULL,
  `posted_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. Admins Table (Secure login credentials)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. Seed Default Admin User
-- Default Credentials: Username: admin | Password: adminpassword123
-- ----------------------------------------------------------------------------
INSERT INTO `admins` (`username`, `password`, `name`) 
VALUES ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'CEGS Administrator')
ON DUPLICATE KEY UPDATE `username`=`username`;

-- ----------------------------------------------------------------------------
-- 4. Seed Initial Sample Job Postings
-- ----------------------------------------------------------------------------
INSERT INTO `jobs` (`company_name`, `job_role`, `salary`, `qualification`, `language_required`, `shift_details`, `location`, `cab_facility`, `additional_notes`, `posted_date`) VALUES
('NeoTech Global Solutions', 'Senior Full Stack Software Engineer', '₹14,00,000 - ₹22,00,000 LPA', 'B.Tech / B.E / MCA in Computer Science', 'English, Hindi', 'Day Shift (9:30 AM - 6:30 PM)', 'Bengaluru (Koramangala / Hybrid)', 'Two-way Cab Provided', 'Candidate must possess hands-on experience in React.js, Node.js, and PostgreSQL. Immediate joiners preferred.', NOW()),
('CloudScale International', 'International Inside Sales Specialist', '₹6,50,000 - ₹11,00,000 LPA + Incentives', 'Any Graduate / Postgraduate', 'Fluent English (Mandatory)', 'US Shift (6:30 PM - 3:30 AM)', 'Bengaluru (Electronic City)', 'Two-way Free Cab', 'Prior B2B cold calling or SDR outbound experience in US/UK markets is mandatory. Uncapped monthly performance commissions.', NOW()),
('Apex FinServe Partners', 'Payroll & Compliance Executive', '₹5,50,000 - ₹8,50,000 LPA', 'B.Com / M.Com / MBA Finance', 'English, Kannada, Hindi', 'General Day Shift (9:00 AM - 6:00 PM)', 'Bengaluru (Indiranagar)', 'No', 'Deep knowledge of Indian labor laws, PF, ESIC, Form 16, and quarterly TDS filings. Experience in payroll ERP is a plus.', NOW()),
('Zenith Customer Support BPO', 'Technical Customer Support Specialist', '₹3,80,000 - ₹5,20,000 LPA', 'Any Graduate (10+2+3)', 'English & Hindi (Fluent)', 'Rotational 24/7 Shifts', 'Bengaluru (Whitefield)', 'Yes (Night Pick & Drop)', '5 days working with 2 consecutive rotational week-offs. 1-month paid enterprise training included.', NOW());
