<?php

$data = json_decode(file_get_contents('php://input'), true);
header('Content-Type: application/json');

$response = new stdClass();

if (isset($data['ipAddress'])) {
    // All necessary data is present
    // Try to run the command
    // Parse the command string
    $commandString = "ping -c 4 " . $data['ipAddress'];
    $output = []; // Something to dump the output into
    exec($commandString, $output); // Run the command to wake on lan
    $outputLine = count($output) - 2;
    if (count($output) > 1) {
        if (!(strpos($output[$outputLine], " received, ") === FALSE)) {
            $posStart = strpos($output[$outputLine], " received, ") + 11;
            $posEnd = strpos($output[$outputLine], "%");
            $packetLoss = substr($output[$outputLine], $posStart, $posEnd - $posStart);
            // For instances where the ping response returns an error
            // not because the command failed, but ping had no response
            if (!(strpos($packetLoss, " errors, ") === FALSE)) {
                // Remove the errors portion, only interested in number
                $posStart = strpos($packetLoss, " errors, ") + 9;
                $packetLoss = substr($packetLoss, $posStart);
            }
            if ($packetLoss > 0) {
                http_response_code(200);
                $response->status = "Response(s) failed.";
                $response->packetLoss = $packetLoss;
                echo (json_encode($response, JSON_UNESCAPED_SLASHES));
            } else {
                http_response_code(200);
                $response->status = "OK";
                $response->packetLoss = $packetLoss;
                echo (json_encode($response, JSON_UNESCAPED_SLASHES));
            }
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