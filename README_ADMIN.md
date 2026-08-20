# CEGS Recruitment Portal - Admin Panel & Dynamic MySQL Backend

## 📌 Overview
This package provides a complete PHP & MySQL dynamic Job Management system (CRUD) and Admin Dashboard for the CEGS Recruitment Website, seamlessly integrated with the public careers frontend while preserving the original theme and fonts (`Plus Jakarta Sans`, `#0d5e72`, `#f56a00`, `#0bb379`).

---

## 🗄️ Database Architecture
The database schema (`database.sql`) creates the `jobs` table with all specified columns:

| Column | Type | Description |
|---|---|---|
| `id` | `INT AUTO_INCREMENT PRIMARY KEY` | Unique job identifier |
| `company_name` | `VARCHAR(255)` | Employer / client company name |
| `job_role` | `VARCHAR(255)` | Designation / title |
| `salary` | `VARCHAR(100)` | Compensation package / CTC |
| `qualification` | `VARCHAR(255)` | Educational requirement |
| `language_required` | `VARCHAR(255)` | Language fluency needed |
| `shift_details` | `VARCHAR(100)` | Shift schedule & timings |
| `location` | `VARCHAR(255)` | Work location & mode |
| `cab_facility` | `VARCHAR(100)` | Transport facility (Hidden on frontend if empty/No) |
| `additional_notes` | `TEXT` | Role overview (Hidden on frontend if empty) |
| `posted_date` | `TIMESTAMP` | Timestamp of publication |

---

## 🚀 Quick Setup Instructions (XAMPP / WAMP / cPanel)

### Step 1: Import Database
1. Open **phpMyAdmin** (`http://localhost/phpmyadmin`).
2. Click on the **Import** tab.
3. Choose the `database.sql` file located in the project root.
4. Click **Go** / **Import**. This creates the `cegs_db` database, `jobs` table, and `admins` table with seed data.

### Step 2: Configure Database Connection
Open `db.php` and verify your MySQL credentials:
```php
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'cegs_db');
define('DB_USER', 'root'); // Your database username
define('DB_PASS', '');     // Your database password
```

### Step 3: Access Admin Dashboard
* **Admin Login URL**: `http://localhost/CEGS/admin/login.php` (or `http://your-domain.com/admin/login.php`)
* **Default Username**: `admin`
* **Default Password**: `adminpassword123`

---

## 🛠️ Admin Dashboard Features (CRUD)
1. **Dashboard (`admin/index.php`)**:
   * View all live job postings in a modern, responsive table.
   * Real-time search filter by job title, company, qualification, or location.
   * Summary metrics for total active listings and database connection status.
2. **Post New Job (`admin/add-job.php`)**:
   * Create new jobs with full field validation.
3. **Edit Job (`admin/edit-job.php`)**:
   * Update existing job details with real-time pre-populated fields.
4. **Delete Job (`admin/delete-job.php`)**:
   * Safe removal with JavaScript confirmation and session security.

---

## 🌐 Public Frontend Display
* **Dynamic PHP Careers Board**: `careers.php`
  * Fetches directly from MySQL.
  * Conditional display: Automatically hides `cab_facility` and `additional_notes` if they are empty for a given job.
  * Interactive 1-click apply modal.
* **REST API Endpoint**: `api/jobs.php`
  * Returns active jobs as JSON to power dynamic frontend requests.
