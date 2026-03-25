#!/bin/bash
cd "$(dirname "$0")"
python3 hub_sync.py
echo ""
echo "¡Tu laboratorio ha sido actualizado!"
echo "Puedes cerrar esta ventana."
sleep 2
