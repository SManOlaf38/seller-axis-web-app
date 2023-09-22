import socket

import paramiko
from rest_framework import exceptions


def check_sftp(data):
    try:
        paths = [
            data["purchase_orders_sftp_directory"],
            data["acknowledgment_sftp_directory"],
            data["confirm_sftp_directory"],
            data["inventory_sftp_directory"],
            data["invoice_sftp_directory"],
            data["return_sftp_directory"],
            data["payment_sftp_directory"],
        ]
        # Connect to retailer's server
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(
            data["sftp_host"],
            username=data["sftp_username"],
            password=data["sftp_password"],
        )
        for path in paths:
            if path[-1] != "/":
                path += "/"
            ftp = ssh.open_sftp()
            try:
                ftp.chdir(path)
            except FileNotFoundError:
                raise exceptions.ParseError("Folder not found")
    except paramiko.AuthenticationException:
        raise exceptions.ParseError("SFTP authentication fail")
    except socket.gaierror:
        raise exceptions.ParseError("Invalid SFTP information")