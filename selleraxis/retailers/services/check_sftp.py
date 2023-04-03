import socket

import paramiko
from rest_framework import serializers


def check_sftp(data):
    try:
        path = (
            data["purchase_orders_sftp_directory"]
            if data["purchase_orders_sftp_directory"][-1] == "/"
            else data["purchase_orders_sftp_directory"] + "/"
        )

        # Connect to retailer's server
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(
            data["sftp_host"],
            username=data["sftp_username"],
            password=data["sftp_password"],
        )
        ftp = ssh.open_sftp()
        ftp.chdir(path)
    except FileNotFoundError:
        raise serializers.ValidationError("Folder not found")
    except paramiko.AuthenticationException:
        raise serializers.ValidationError("SFTP authentication fail")
    except socket.gaierror:
        raise serializers.ValidationError("Invalid SFTP information")
