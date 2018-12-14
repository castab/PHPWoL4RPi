<?php

$data = json_decode(file_get_contents('php://input'), true);
header('Content-Type: application/json');

$response = new stdClass();

if (isset($data['hostName']) && isset($data['ipAddress']) && isset($data['macAddress'])) {
    // All necessary data is present
    // Try to run the command
    // Parse the command string
    $commandString = "wakeonlan " . $data['macAddress'];
    $output = []; // Something to dump the output into
    exec($commandString, $output); // Run the command to wake on lan
    if (count($output) > 0) {
        if (!(strpos($output[0], 'Sending magic packet to') === FALSE)) {
            // Looks good
            $response->status = 'Wake signal sent.';
            http_response_code(200);
            echo (json_encode($response, JSON_UNESCAPED_SLASHES));
        }
    } else {
        http_response_code(500);
        $response->error = "Command could not be executed.";
    }
    

} else {
    http_response_code(400);
    $response->error = "Missing and/or incorrect data.";
    echo (json_encode($response, JSON_UNESCAPED_SLASHES));
}

?>