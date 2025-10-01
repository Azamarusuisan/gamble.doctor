#!/bin/bash
# VSCodeを大きなヒープメモリで起動するスクリプト

# ヒープサイズを8GBに設定（必要に応じて調整）
export NODE_OPTIONS="--max-old-space-size=8192"

# VSCodeを起動
code . --max-memory=8192