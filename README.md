<img width="428" alt="image" src="https://github.com/SoftwareDesignLab/Secure-Software-Self-Attestation/assets/14220640/72c43282-51c1-4c3c-9f9f-a8003083c97b"># Secure Software Self-Attestation
Digital and enhanced version of (the Secure Software Development Lifecycle Attestation Form)[https://www.cisa.gov/sites/default/files/2023-04/secure-software-self-attestation_common-form_508.pdf]

## Features
- Comes pre-packaged with the original set of security controls on the form, formatted in OSCAL Catalog JSON format
- Include any catalog of security controls so long as they're in OSCAL Catalog JSON format
- Modular and ready to work with data generated from other sources such as a vulnerability scan
- Export results of the attestation as an OSCAL Assessment Results file
- Save and load attestations to work on them later or make edits to existing ones
- View a breakdown of the Attestation Results 
- Multiple attestations for different groups of software components or products

  <img width="428" alt="image" src="https://github.com/SoftwareDesignLab/Secure-Software-Self-Attestation/assets/14220640/c180ce2e-915b-4fce-93c9-568ea29e5478">


## Components
For more details about each component please refer to the Readme files under each directory.

### sdlc-checklist
The vendor facing web app used for creating manual attestations and including additional security control catalogs 

### sdlc-results
The purchaser facing web app used for viewing and evaluating results of manual attestations and additional automated test results

## Quick Start Steps
- Install NPM and Angular

In each component's root directory (/web_app/&lt;component&gt;):
- Install Dependencies 
  - `npm i --legacy-peer-deps`
- Serve Web App 
  - `ng serve`

## Project Team
- [Mehdi Tarrit Mirakhorli](https://mehdimirakhorli.github.io/), Project Lead and Principal Investigator
- Joseph Vita, Researcher & Software Developer
- Ethan Numan, Developer
- Patrick Elser, Developer 
