# TODO
- !!! make sure part_class, prop_class and param_class generate with just the name "class"
- make sure version is up to date in component defs
- uuids are randomly generated as placeholders and have no signifigance. Can keep or regenerate for use in database
- see if publish dates represent our implementation of the control catalog or the original. Also update as development progresses
- ensure oscal version is backwards compatible with examples 
- create verification json for checklistable OSCAL
- - "props[]" must contain {"name": "compliant", "value": "[true | false | partial]" }
- - verify param id/class fit this regex: "^(\\p{L}|_)(\\p{L}|\\p{N}|[.\\-_])*$"
- - - above might not look right when rendering md file. look in source
- Implement regex checks on oscal string objects

# Consider:
- for control models, a property for a group could be 'compliance_requirement'. Options could be one of: ["all", "any", \<minimum number>]
  - If there are several options on how to be compliant with a control, this denotes whether or not you need any control in the group, all controls or a minimum number of them
- for control models, A boolean property called 'automatable' could exist to denote whether or not the control can be verified using automated tooling. 
- should examples be considered parts or just properties of a control?