from collections import Counter
def status_counts(orders):
    return dict(Counter(row.get("status","UNKNOWN") for row in orders))
def revenue(orders):
    return sum(float(row.get("amount",0)) for row in orders if row.get("status")=="PAID")
def brand_counts(orders):
    return dict(Counter(row.get("brand","unknown") for row in orders))
def report(orders):
    return {"status":status_counts(orders),"revenue":revenue(orders),"brands":brand_counts(orders)}
