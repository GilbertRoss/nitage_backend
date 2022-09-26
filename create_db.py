import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv
import requests
import os
import traceback
import uuid

load_dotenv()

def insertDataDB():
    try:

        conn = psycopg2.connect(f'dbname={os.environ.get("POSTGRES_DB")} user={os.environ.get("POSTGRES_USER")} password={os.environ.get("POSTGRES_PASSWORD")} host=localhost')
        querystring = {"type":"invoice","fieldset":"detailed","page":"1","per_page":"1000","q":"next_due_date!=null"}

        url = "https://api-v2.fattureincloud.it/c/623774/issued_documents"
        payload = ""
        headers = {
    "Authorization": f'Bearer {os.environ.get("API_KEY")}'
            }
        
        cur = conn.cursor()
        response = requests.request("GET", url, data=payload, headers=headers, params=querystring)

        invoices = response.json()["data"]
        table_name = "invoices"

        for invoice in invoices:
            for payment in invoice["payments_list"]:
                i = 1
                cur.execute(
                sql.SQL("INSERT INTO {table} VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s, %s, %s)")
                    .format(table=sql.Identifier(table_name)),[str(uuid.uuid4()), str(invoice["date"]), str(invoice["number"]),str(payment["due_date"]), str(payment["amount"]), str(payment["status"]),str(invoice["id"]),str(invoice["entity"]["id"]),str(invoice["entity"]["name"]),str(invoice["entity"]["vat_number"]), str(invoice["url"]), str(i)+"/"+str(len(invoice["payments_list"]))]
                    )
                i+=1
            conn.commit()
        print("Saved invoices...")

    except Exception:
         print(traceback.format_exc())


if __name__ == "__main__":
    insertDataDB()
