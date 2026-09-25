// Papaki/Plesk Passenger entry point. Build the application before starting it.
process.env.HOSTNAME ||= "0.0.0.0";
void import("./.next/standalone/server.js");
