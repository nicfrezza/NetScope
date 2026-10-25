import os

import psycopg
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from psycopg.rows import dict_row

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

app = FastAPI(title="NetScope API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/customers")
def get_customers():
    if not DATABASE_URL:
        raise HTTPException(
            status_code=500,
            detail="DATABASE_URL não configurada no arquivo .env",
        )

    query = """
        SELECT
            c.customer_id AS id,
            c.customer_name AS name,
            ci.city_name || ', ' || ci.state_code AS city,
            COALESCE(p.plan_name, 'Sem contrato') AS plan,
            CASE
                WHEN c.customer_status = 'active' THEN 'Ativo'
                ELSE 'Inativo'
            END AS status
        FROM netscope.customers AS c
        JOIN netscope.cities AS ci
            ON ci.city_id = c.city_id
        LEFT JOIN LATERAL (
            SELECT pl.plan_name
            FROM netscope.contracts AS ct
            JOIN netscope.plans AS pl
                ON pl.plan_id = ct.plan_id
            WHERE ct.customer_id = c.customer_id
            ORDER BY ct.started_at DESC, ct.contract_id DESC
            LIMIT 1
        ) AS p ON TRUE
        ORDER BY c.customer_id
        LIMIT 100;
    """

    try:
        with psycopg.connect(
            DATABASE_URL,
            row_factory=dict_row,
        ) as connection:
            return connection.execute(query).fetchall()

    except psycopg.Error:
        raise HTTPException(
            status_code=503,
            detail="Não foi possível consultar o banco de dados.",
        )


@app.get("/api/invoices")
def get_invoices():
    if not DATABASE_URL:
        raise HTTPException(
            status_code=500,
            detail="DATABASE_URL não configurada no arquivo .env",
        )

    query = """
        SELECT
            i.invoice_id AS id,
            i.invoice_id,
            i.invoice_date,
            i.due_date,
            i.amount,
            i.invoice_status AS status,
            c.customer_name
        FROM netscope.invoices AS i
        JOIN netscope.contracts AS ct
            ON ct.contract_id = i.contract_id
        JOIN netscope.customers AS c
            ON c.customer_id = ct.customer_id
        ORDER BY i.due_date DESC, i.invoice_id DESC;
    """

    try:
        with psycopg.connect(
            DATABASE_URL,
            row_factory=dict_row,
        ) as connection:
            return connection.execute(query).fetchall()

    except psycopg.Error:
        raise HTTPException(
            status_code=503,
            detail="Não foi possível consultar os boletos no banco de dados.",
        )


def get_support_tickets():
    if not DATABASE_URL:
        raise HTTPException(
            status_code=500,
            detail="DATABASE_URL não configurada no arquivo .env",
        )

    query = """
        SELECT
            ticket_status AS status,
            opened_at
        FROM netscope.support_tickets
        ORDER BY opened_at DESC, ticket_id DESC;
    """

    try:
        with psycopg.connect(
            DATABASE_URL,
            row_factory=dict_row,
        ) as connection:
            return connection.execute(query).fetchall()

    except psycopg.Error:
        raise HTTPException(
            status_code=503,
            detail="Não foi possível consultar os chamados de suporte.",
        )


@app.get("/api/dashboard")
def get_dashboard():
    customers = get_customers()
    invoices = get_invoices()
    support = get_support_tickets()

    active_count = sum(customer["status"] == "Ativo" for customer in customers)
    plan_counts = {}
    for customer in customers:
        plan = customer["plan"]
        plan_counts[plan] = plan_counts.get(plan, 0) + 1

    return {
        "metrics": [
            {"label": "Clientes", "value": len(customers)},
            {"label": "Ativos", "value": active_count},
            {"label": "Inativos", "value": len(customers) - active_count},
        ],
        "plans": [
            {"name": name, "value": count, "customers": count}
            for name, count in plan_counts.items()
        ],
        "customers": customers,
        "invoices": invoices,
        "support": support,
        "revenue": [],
    }
