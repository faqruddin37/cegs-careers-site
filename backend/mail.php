<?php
/**
 * CEGS Recruitment Portal - Email Notification Module
 * Isolated, non-blocking notification dispatcher
 */

define('NOTIFICATION_RECIPIENT_EMAIL', 'socialvilla03@gmail.com');
define('NOTIFICATION_FROM_EMAIL', 'no-reply@cegs.in');

/**
 * Send notification for a new candidate application
 *
 * @param array $data Candidate submission data
 * @return bool True if dispatched or safely ignored, never throws
 */
function sendCandidateNotification(array $data): bool {
    try {
        $to = NOTIFICATION_RECIPIENT_EMAIL;
        $subject = "New Candidate Application: " . ($data['full_name'] ?? 'Candidate') . " - " . ($data['job_title'] ?? 'General Application');

        $message = "=======================================================\n";
        $message .= "NEW CANDIDATE APPLICATION RECEIVED - CEGS PORTAL\n";
        $message .= "=======================================================\n\n";
        $message .= "Candidate Name: " . ($data['full_name'] ?? 'N/A') . "\n";
        $message .= "Email:          " . ($data['email'] ?? 'N/A') . "\n";
        $message .= "Phone:          " . ($data['phone'] ?? 'N/A') . "\n";
        $message .= "Applied Role:   " . ($data['job_title'] ?? 'General Application') . "\n";
        $message .= "Experience:     " . ($data['experience'] ?? 'N/A') . "\n";
        $message .= "Current CTC:    " . ($data['current_ctc'] ?? 'N/A') . "\n";
        $message .= "Expected CTC:   " . ($data['expected_ctc'] ?? 'N/A') . "\n";
        $message .= "Location:       " . ($data['location'] ?? 'N/A') . "\n";
        $message .= "LinkedIn:       " . ($data['linkedin_url'] ?? 'N/A') . "\n";
        $message .= "Resume File:    " . ($data['resume_filename'] ?? 'None') . "\n";
        $message .= "Submitted At:   " . date('Y-m-d H:i:s') . "\n\n";
        
        if (!empty($data['cover_message'])) {
            $message .= "Cover Message / Skills:\n" . $data['cover_message'] . "\n\n";
        }

        $message .= "-------------------------------------------------------\n";
        $message .= "Manage candidate in Admin Dashboard: /backend/admin/candidates.php\n";

        $headers = [
            'From: ' . NOTIFICATION_FROM_EMAIL,
            'Reply-To: ' . ($data['email'] ?? NOTIFICATION_FROM_EMAIL),
            'X-Mailer: PHP/' . phpversion(),
            'Content-Type: text/plain; charset=UTF-8'
        ];

        // Safe non-blocking execution
        @mail($to, $subject, $message, implode("\r\n", $headers));
        return true;
    } catch (\Throwable $e) {
        // Silently log or ignore to prevent breaking the user experience
        error_log("CEGS Mail Notification Error (Candidate): " . $e->getMessage());
        return false;
    }
}

/**
 * Send notification for a new client / recruitment partnership enquiry
 *
 * @param array $data Client enquiry data
 * @return bool True if dispatched or safely ignored, never throws
 */
function sendEnquiryNotification(array $data): bool {
    try {
        $to = NOTIFICATION_RECIPIENT_EMAIL;
        $subject = "New Client Partnership Enquiry: " . ($data['company_name'] ?? 'Enterprise Client');

        $message = "=======================================================\n";
        $message .= "NEW CLIENT PARTNERSHIP ENQUIRY - CEGS PORTAL\n";
        $message .= "=======================================================\n\n";
        $message .= "Company Name:     " . ($data['company_name'] ?? 'N/A') . "\n";
        $message .= "Contact Person:   " . ($data['contact_person'] ?? 'N/A') . "\n";
        $message .= "Official Email:   " . ($data['email'] ?? 'N/A') . "\n";
        $message .= "Contact Phone:    " . ($data['phone'] ?? 'N/A') . "\n";
        $message .= "Website:          " . ($data['company_website'] ?? 'N/A') . "\n";
        $message .= "Business Location:" . ($data['business_location'] ?? 'N/A') . "\n";
        $message .= "Partnership Type: " . ($data['partnership_type'] ?? 'N/A') . "\n";
        $message .= "Geo Coverage:     " . ($data['geographic_coverage'] ?? 'N/A') . "\n";
        $message .= "Industries/Roles: " . ($data['industries_roles'] ?? 'N/A') . "\n";
        $message .= "Submitted At:     " . date('Y-m-d H:i:s') . "\n\n";

        if (!empty($data['company_introduction'])) {
            $message .= "Company Introduction:\n" . $data['company_introduction'] . "\n\n";
        }
        if (!empty($data['partnership_requirement'])) {
            $message .= "Partnership Requirement:\n" . $data['partnership_requirement'] . "\n\n";
        }
        if (!empty($data['additional_message'])) {
            $message .= "Additional Message:\n" . $data['additional_message'] . "\n\n";
        }

        $message .= "-------------------------------------------------------\n";
        $message .= "Manage enquiry in Admin Dashboard: /backend/admin/enquiries.php\n";

        $headers = [
            'From: ' . NOTIFICATION_FROM_EMAIL,
            'Reply-To: ' . ($data['email'] ?? NOTIFICATION_FROM_EMAIL),
            'X-Mailer: PHP/' . phpversion(),
            'Content-Type: text/plain; charset=UTF-8'
        ];

        // Safe non-blocking execution
        @mail($to, $subject, $message, implode("\r\n", $headers));
        return true;
    } catch (\Throwable $e) {
        error_log("CEGS Mail Notification Error (Enquiry): " . $e->getMessage());
        return false;
    }
}
