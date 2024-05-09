const ErrorMessage = Object.freeze({
  P1000:
    "Authentication failed against database server, the provided database credentials are not valid",
  P1001: "Can't reach database server at your_host and your_port",
  P1008: "Operations timed out after",
  P1013: "The provided database string is invalid. {details}",
  P1014: "The underlying {kind} for model {model} does not exist.",
  P1016: "Your raw query had an incorrect number of parameters",
  P2002: "Unique constraint failed on the",
  P2025: "Id Not Found",
});

export default ErrorMessage;
