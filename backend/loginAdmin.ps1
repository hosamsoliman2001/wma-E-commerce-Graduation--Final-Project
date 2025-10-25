$body = @{ email = "admin@example.com"; password = "Password123!" } | ConvertTo-Json
$response = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/v1/auth/login" -ContentType "application/json" -Body $body
$response | ConvertTo-Json -Depth 5
