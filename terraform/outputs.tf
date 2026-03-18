output "master_public_ip" {
  value       = aws_instance.master.public_ip
  description = "IP publique du Master Node"
}

output "worker_public_ip" {
  value       = aws_instance.worker.public_ip
  description = "IP publique du Worker Node"
}

output "frontend_url" {
  value       = "http://${aws_instance.master.public_ip}:30080"
  description = "Frontend URL via NodePort"
}