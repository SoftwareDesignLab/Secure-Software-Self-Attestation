import openpyxl
from oscalpy.catalog import catalog
import json

def from_xlsx():
    cat = catalog.Catalog("Security catalog for SP800-218: Secure Software Development Lifecycle", "1.0.0", "1.0.4")
    workbook = openpyxl.load_workbook("NIST.SP.800-218.SSDF-table.xlsx")
    worksheet = workbook.active
    
    group_num = -1
    control_num = -1
    rows = worksheet.iter_rows()
    next(rows)
    for row in rows:
        cols = list(map(lambda x: x.value, row))

        #practices
        if cols[0] is not None:
            prac = cols[0]
            head, desc = prac.split(":")
            title = head.split("(")[0][:-1] #[:-1] to remove the space at the end
            uid =  head.split("(")[1][:-1]
            uid = uid.replace(".", "_")
            cat.add_group(uid, title)
            group_num += 1
            control_num = -1

        # tasks
        task = cols[1].split(":")
        uid = task[0]
        uid = uid.replace(".", "_")
        desc = task[1][1:] # [1:] for trailing space
        
        cat.groups[group_num].add_control(uid, desc)
        control_num += 1
        
        # implementations
        for impl in cols[2].split("\n"):
            if impl == "": 
                continue
            title, policy = impl.split(":")
            title = title.strip(" ")
            policy = policy[1:] # ignore initial space
            cat.groups[group_num].controls[control_num].add_part(
                title,
                policy,
                "This is an example implementation of the control " + uid + ".",
                None,
                "Example"
            )
            
        # references
        for ref in cols[3].split("\n"):
            if ref == "":
                continue
            catal, subcat = ref.split(":")
            subcat = subcat[1:] # ignore initial space
            cat.groups[group_num].controls[control_num].add_prop(catal, subcat, None, "Reference")
        
    return cat

with open("sp800-218_generated.json", "w", encoding="utf-8") as f:
    obj = from_xlsx()
    oscal_dict = obj.as_dict()
    json.dump(oscal_dict, f, indent=4, ensure_ascii=False)