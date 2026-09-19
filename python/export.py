import csv
def export_orders(rows,target):
    fields=["id","brand","product","amount","status","createdAt"]
    with open(target,"w",newline="",encoding="utf8") as file:
        writer=csv.DictWriter(file,fieldnames=fields)
        writer.writeheader()
        for row in rows:
            writer.writerow({field:row.get(field,"") for field in fields})
def read_orders(source):
    with open(source,encoding="utf8") as file:
        return list(csv.DictReader(file))
