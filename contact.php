<?php
/* ═══════════════════════════════════════════════════════════════════
   devRasen Portfolio — contact.php
   Full Email Handler with Web3Forms + Native PHP Fallback
   ═══════════════════════════════════════════════════════════════════ */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
    $data = $_POST;
}

$name    = isset($data['name']) ? trim(strip_tags($data['name'])) : '';
$email   = isset($data['email']) ? filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL) : '';
$subject = isset($data['subject']) ? trim(strip_tags($data['subject'])) : '';
$message = isset($data['message']) ? trim(strip_tags($data['message'])) : '';

if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields correctly.']);
    exit;
}

$web3Key = '64b1bb00-3582-4177-917e-8c41fb9e8735';
$to = 'dev.mrasen@gmail.com';

// 1. Try Web3Forms server-side call
$payload = json_encode([
    'access_key' => $web3Key,
    'name'       => $name,
    'email'      => $email,
    'subject'    => "Portfolio Contact: " . $subject,
    'message'    => $message,
    'from_name'  => $name . " via devRasen Portfolio"
]);

$ch = curl_init('https://api.web3forms.com/submit');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$w3Res = curl_exec($ch);
$w3Code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$w3Data = json_decode($w3Res, true);

if ($w3Data && isset($w3Data['success']) && $w3Data['success'] === true) {
    echo json_encode(['success' => true, 'message' => 'Message sent successfully via Web3Forms!']);
    exit;
}

// 2. Fallback to PHP native mail() with envelope sender
$emailSubject = "Portfolio Contact: " . $subject;
$emailBody  = "You received a new message from your portfolio website:\n\n";
$emailBody .= "Name: " . $name . "\n";
$emailBody .= "Email: " . $email . "\n";
$emailBody .= "Subject: " . $subject . "\n\n";
$emailBody .= "Message:\n" . $message . "\n\n";
$emailBody .= "──────────────────────────────────────────\n";
$emailBody .= "Sent from devRasen Portfolio on " . date('Y-m-d H:i:s') . "\n";

$domain = isset($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : 'devrasen.com';
$domain = preg_replace('/^www\./', '', $domain);
$fromEmail = "noreply@" . $domain;

$headers  = "From: " . mb_encode_mimeheader($name) . " <" . $fromEmail . ">\r\n";
$headers .= "Reply-To: " . mb_encode_mimeheader($name) . " <" . $email . ">\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$mailSent = @mail($to, $emailSubject, $emailBody, $headers, "-f" . $fromEmail);

if ($mailSent) {
    echo json_encode(['success' => true, 'message' => 'Message sent successfully via server mail!']);
} else {
    $err = isset($w3Data['message']) ? $w3Data['message'] : 'Mail server error';
    echo json_encode(['success' => false, 'message' => $err]);
}
