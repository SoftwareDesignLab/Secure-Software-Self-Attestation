# NIST Attestation Form
Attestations like this are the perfect example of what OSCAL is made to work with. This 
Attestation form provides a 3 section form where software producers can report their 
compliance with CISA’s minimum SSDF requirements for EO14028. These instructions also 
provide a subset of NIST’s SSDF controls that are to serve as the bare minimum for SSDF 
compliance. This is a direct subset of the SP 800-218 group of controls that I have already 
translated into an OSCAL control catalog a while ago. 
The SSDF attestation form is broken down into the following 3 sections responsible for 
recording the associated data:
1. Section 1
    - Attestation information 
    - Software component information 
2. Section 2
    - Software Producer Information
    - Contact Information
3. Section 3
    - Additional Information and FedRAMP 3PAO status (checkbox)
    - Signature
        - “I comply with the bare minimum”
	
OSCAL is designed to be able to store all of the above data between its different models in 
order to generate an Assessment Results file, which combines a Component Definition with a 
Control Catalog and an Assessment Plan to document the compliance of an organization to an 
Assessment Plan. The below bullets show how the above data in the form would be mapped in 
OSCAL format:
- Component Definition
  - Software component information
- Control Catalog
  - The bare minimum, broken down into groups of controls with metadata to 
reference NIST and CISA documentation
  - Optional extra controls
- Assessment Plan
  - Individual control compliance information, specific to the organization or generic
  - Expected results 
  - Software Producer Information
  - Contact information 
- Assessment Results
  - Software Producer Information
  - Contact information 
  - Compliance results
  - Attestation Information
  - Additional information