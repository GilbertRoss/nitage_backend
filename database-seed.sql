CREATE TABLE IF NOT EXISTS "invoices" (
	"id" TEXT NOT NULL,
	"date"  VARCHAR(256) NOT NULL,
    "number" VARCHAR(256) NOT NULL,
    "next_due_date" VARCHAR(256) NOT NULL,
    "id_fatture_cloud" VARCHAR(256) NOT NULL,
    "company_id" VARCHAR(256) NOT NULL,
    "company_name" VARCHAR(256) NOT NULL,
    "vat_number" VARCHAR(256) NOT NULL,
	"url" VARCHAR(256) NOT NULL,
	PRIMARY KEY ("id")
);


CREATE TABLE IF NOT EXISTS "users" (
	"id" TEXT NOT NULL,
	"username"  VARCHAR(256) NOT NULL,
    "password" VARCHAR(256) NOT NULL,
	PRIMARY KEY ("id")
);