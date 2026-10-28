import os
import random
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal

import psycopg
from faker import Faker


DATABASE_URL = os.getenv("DATABASE_URL")
fake = Faker("pt_BR")

CITIES = [
    ("Sao Paulo", "SP"),
    ("Campinas", "SP"),
    ("Santos", "SP"),
    ("Rio de Janeiro", "RJ"),
    ("Niteroi", "RJ"),
    ("Belo Horizonte", "MG"),
    ("Uberlandia", "MG"),
    ("Curitiba", "PR"),
    ("Londrina", "PR"),
    ("Florianopolis", "SC"),
    ("Porto Alegre", "RS"),
    ("Salvador", "BA"),
]

PLANS = [
    ("Fibra 100 Mbps", 100, Decimal("79.90")),
    ("Fibra 300 Mbps", 300, Decimal("99.90")),
    ("Fibra 500 Mbps", 500, Decimal("129.90")),
    ("Fibra 700 Mbps", 700, Decimal("159.90")),
]

PAYMENT_METHOD = "pix"
CUSTOMER_COUNT = 40


def insert_cities(cur):
    city_ids = {}
    for city_name, state_code in CITIES:
        cur.execute(
            """
            INSERT INTO cities (city_name, state_code)
            VALUES (%s, %s)
            ON CONFLICT (city_name, state_code) DO NOTHING
            RETURNING city_id;
            """,
            (city_name, state_code),
        )
        inserted = cur.fetchone()
        if inserted:
            city_ids[(city_name, state_code)] = inserted[0]
        else:
            cur.execute(
                """
                SELECT city_id
                FROM cities
                WHERE city_name = %s AND state_code = %s;
                """,
                (city_name, state_code),
            )
            city_ids[(city_name, state_code)] = cur.fetchone()[0]

    return list(city_ids.values())


def insert_plans(cur):
    plan_ids = {}
    for plan_name, download_mbps, monthly_price in PLANS:
        cur.execute(
            """
            INSERT INTO netscope.plans (
                plan_name, download_mbps, monthly_price
            )
            VALUES (%s, %s, %s)
            ON CONFLICT (plan_name) DO NOTHING
            RETURNING plan_id;
            """,
            (plan_name, download_mbps, monthly_price),
        )
        inserted = cur.fetchone()
        if inserted:
            plan_ids[plan_name] = inserted[0]
        else:
            cur.execute(
                "SELECT plan_id FROM netscope.plans WHERE plan_name = %s;",
                (plan_name,),
            )
            plan_ids[plan_name] = cur.fetchone()[0]

    return [(name, plan_ids[name], price) for name, _, price in PLANS]


def populate_database():
    if not DATABASE_URL:
        raise RuntimeError(
            "Defina a variável de ambiente DATABASE_URL com a URL do Neon."
        )

    with psycopg.connect(DATABASE_URL) as conn:
        with conn.cursor() as cur:
            cur.execute("SET search_path TO netscope, public;")

            city_ids = insert_cities(cur)
            plans = insert_plans(cur)

            print("Inserindo clientes...")
            customer_ids = []
            for _ in range(CUSTOMER_COUNT):
                cur.execute(
                    """
                    INSERT INTO netscope.customers (customer_name, city_id)
                    VALUES (%s, %s)
                    RETURNING customer_id;
                    """,
                    (fake.name()[:150], random.choice(city_ids)),
                )
                customer_ids.append(cur.fetchone()[0])

            print("Inserindo contratos...")
            contract_data = []
            for customer_id in customer_ids:
                _, plan_id, monthly_price = random.choice(plans)
                started_at = date.today() - timedelta(days=random.randint(30, 900))
                cancelled_at = (
                    started_at + timedelta(days=random.randint(30, 180))
                    if random.random() < 0.1
                    else None
                )
                cur.execute(
                    """
                    INSERT INTO netscope.contracts (
                        customer_id, plan_id, started_at, cancelled_at
                    )
                    VALUES (%s, %s, %s, %s)
                    RETURNING contract_id;
                    """,
                    (customer_id, plan_id, started_at, cancelled_at),
                )
                contract_id = cur.fetchone()[0]
                contract_data.append((contract_id, monthly_price))

            print("Inserindo faturas...")
            invoice_data = []
            for contract_id, monthly_price in contract_data:
                for month_offset in range(2):
                    invoice_date = date.today() - timedelta(
                        days=30 * (month_offset + 1)
                    )
                    due_date = invoice_date + timedelta(days=10)
                    invoice_status = "pending" if month_offset == 0 else "paid"
                    cur.execute(
                        """
                        INSERT INTO netscope.invoices (
                            contract_id, invoice_date, due_date, amount,
                            invoice_status
                        )
                        VALUES (%s, %s, %s, %s, %s)
                        RETURNING invoice_id;
                        """,
                        (
                            contract_id,
                            invoice_date,
                            due_date,
                            monthly_price,
                            invoice_status,
                        ),
                    )
                    invoice_id = cur.fetchone()[0]
                    if invoice_status == "paid":
                        invoice_data.append((invoice_id, monthly_price))

            print("Inserindo pagamentos...")
            for invoice_id, amount in invoice_data:
                cur.execute(
                    """
                    INSERT INTO netscope.payments (
                        invoice_id, amount, payment_method
                    )
                    VALUES (%s, %s, %s);
                    """,
                    (invoice_id, amount, PAYMENT_METHOD),
                )

            print("Inserindo chamados de suporte...")
            categories = [
                "connection",
                "billing",
                "installation",
                "equipment",
                "other",
            ]
            ticket_statuses = ["open", "in_progress", "resolved", "closed"]
            now = datetime.now(timezone.utc)
            for customer_id in customer_ids:
                opened_at = now - timedelta(days=random.randint(1, 365))
                ticket_status = random.choice(ticket_statuses)
                closed_at = None
                if ticket_status in {"resolved", "closed"}:
                    days_open = (now - opened_at).days
                    closed_at = opened_at + timedelta(
                        days=random.randint(1, min(days_open, 30))
                    )

                cur.execute(
                    """
                    INSERT INTO netscope.support_tickets (
                        customer_id, opened_at, closed_at, category, ticket_status
                    )
                    VALUES (%s, %s, %s, %s, %s);
                    """,
                    (
                        customer_id,
                        opened_at,
                        closed_at,
                        random.choice(categories),
                        ticket_status,
                    ),
                )

        print("Dados do NetScope inseridos com sucesso.")


if __name__ == "__main__":
    populate_database()
