from dataclasses import dataclass, asdict
from datetime import datetime
import csv

@dataclass
class FinanceRow:
    transaction_id: str
    date: str
    kind: str
    brand: str
    category: str
    description: str
    amount: int
    method: str
    order_id: str = ''
    member_id: str = ''
    status: str = 'PENDING'

def export_finance(rows, filename='finance_export.csv'):
    fields=list(asdict(rows[0]).keys()) if rows else list(FinanceRow.__annotations__.keys())
    with open(filename,'w',newline='',encoding='utf-8') as f:
        writer=csv.DictWriter(f,fieldnames=fields)
        writer.writeheader()
        for row in rows: writer.writerow(asdict(row))

def utc_now():
    return datetime.utcnow().isoformat()+'Z'

if __name__=='__main__':
    export_finance([FinanceRow('FIN-EXAMPLE',utc_now(),'INCOME','Nararya Garage','MOD','Example',45000,'MANUAL')])
    print('Finance export ready')