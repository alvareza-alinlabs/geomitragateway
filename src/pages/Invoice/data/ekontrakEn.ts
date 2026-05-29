export const ekontrakDataEn = {
  header: {
    title: "Digital Cooperation Agreement (<i>E-Contract</i>)",
    subtitle: "Formal legal document for the development specifications, rights, and obligations of the Geo Mitra Gateway system.",
    publishDate: "May 23, 2026",
    documentNumber: "KTR/2026/05/0012",
    status: "Electronically binding under ITE Law",
  },
  mukadimah: {
    intro: "This Web Application and System Dashboard Development Cooperation Agreement (\"Agreement\") is made and absolutely and bindingly agreed upon through electronic means on the twenty-third day of May, two thousand and twenty-six (23-05-2026), by and between:",
    pihakPertama: {
      nama: "Alvareza Hilka Pratama",
      mewakili: "AlinLabs Indonesia",
      peran: "technical implementer, hereinafter in this Agreement referred to as the \"FIRST PARTY\"",
    },
    pihakKedua: {
      nama: "Harry M. Gultom",
      mewakili: "Client",
      peran: "as the service user and owner of the system to be built, hereinafter in this Agreement referred to as the \"SECOND PARTY\"",
    },
    kesepakatan: "In this Agreement, the FIRST PARTY and the SECOND PARTY collectively hereinafter referred to as the \"PARTIES\" and individually as a \"PARTY\". The PARTIES agree to bind themselves in the Agreement based on the following provisions:"
  },
  pasal: [
    {
      title: "Article 1 - Purpose and Scope of Work",
      ayat: [
        {
          nomor: "1.1.",
          teks: "The SECOND PARTY hereby appoints and assigns the FIRST PARTY, and the FIRST PARTY accepts the appointment to design, develop, test, and <i>deploy</i> the system/software named \"Geo Mitra Gateway\" (hereinafter referred to as the \"System\")."
        },
        {
          nomor: "1.2.",
          teks: "The scope of the System as referred to in paragraph 1.1 includes, but is not limited to, the design of the following main components:",
          list: [
            "Public <i>Front-End</i> (Homepage, Product Catalog, Public Product Details, <i>Appointment</i> Form).",
            "Centralized Authentication System for administrators and staff according to security standards.",
            "Main Dashboard (<i>KPI</i> Summary, Partner Distribution Map/<i>Interactive Map</i>).",
            "Data Management Module (Client List, Transactions, <i>Sales</i>, Product Inventory).",
            "<i>Cloud</i> Infrastructure, <i>DNS/Domain</i> Configuration, <i>SSL</i>, and Public <i>Deployment</i> process (<i>Host</i>)."
          ]
        },
        {
          nomor: "1.3.",
          teks: "All features, limitations, flows, and functions worked on refer to the Cost Details (<i>Invoice</i>) which is an inseparable part of this Agreement. Features or modules outside the Cost Details will be treated as a <i>Change Request</i> (<i>CR</i>) which will be regulated separately."
        }
      ]
    },
    {
      title: "Article 2 - Rights and Obligations of the Parties",
      ayat: [
        {
          nomor: "2.1.",
          teks: "Rights and Obligations of the FIRST PARTY:",
          list: [
            "Right to receive full and timely payment according to the nominal amount and schedule of terms mentioned in Article 3.",
            "Obligated to complete the construction of the System according to the scope of work and the set deadline.",
            "Right to obtain all information, data references, logos, legal documents, or authentic visual assets from the SECOND PARTY for the purpose of building the System.",
            "Obligated to maintain the confidentiality of all materials and internal business information of the SECOND PARTY submitted for the development process in accordance with the guidelines of the Personal Data Protection Law (UU PDP)."
          ]
        },
        {
          nomor: "2.2.",
          teks: "Rights and Obligations of the SECOND PARTY:",
          list: [
            "Obligated to make progressive and full project cost payments without deduction to the official account of the FIRST PARTY.",
            "Right to get the final result in the form of a functional System, compiled <i>source-code</i>, and control over the infrastructure (<i>domain</i>) after it is declared Paid in Full.",
            "Obligated to provide full cooperation for function testing (<i>User Acceptance Test</i>) no later than 3 days after the module is delivered by the FIRST PARTY."
          ]
        }
      ]
    },
    {
      title: "Article 3 - Project Value & Payment Methodology",
      ayat: [
        {
          nomor: "3.1.",
          teks: "The value of the entire investment for this System creation project is Rp6,352,500 (Six Million Three Hundred Fifty-Two Thousand Five Hundred Rupiah), which is the final value after the Promotion program in the current month is activated."
        },
        {
           nomor: "3.2.",
           teks: "So that the project can be implemented simultaneously and for the sake of certainty of the agreement, the PARTIES agree to use the following payment terms:",
           list: [
             "Term I (Down Payment/<i>DP</i>) of Rp3,000,000 (PAID): As a condition for the start of operational work, infrastructure design and ordering of standard <i>domain/server</i>. This <i>DP</i> is <i>Non-Refundable</i> if the project is unilaterally terminated by the SECOND PARTY.",
             "Term II (Project Completion/<i>UAT</i>) of Rp2,082,000: Paid after all System designs are completed, ready to operate with a Successful Trial status (<i>Staging Success</i>), and confirmed its feasibility.",
             "Term III (Handover/<i>Handover</i>) of Rp1,270,500: Paid at the final handover stage (<i>handover delivery</i>), including submitting <i>domain</i> authorization, application of final minor revisions, and activation of the release <i>server</i> to the public (<i>Production Release</i>)."
           ]
        },
        {
          nomor: "3.3.",
          teks: "All valid financial transactions are only recognized if sent/transferred to an official national bank account or digital payment institution belonging to PT/CV AlinLabs Indonesia or a legal entity designated in the invoice."
        }
      ]
    },
    {
      title: "Article 4 - Schedule and Estimated Workmanship",
      ayat: [
        {
          nomor: "4.1.",
          teks: "The System development process is estimated to take a reasonable amount of time starting from the receipt of Term I (Down Payment/<i>DP</i>) payment and all required initial reference data has been submitted by the SECOND PARTY."
        },
        {
          nomor: "4.2.",
          teks: "This estimated time may change or be proportionally extended if there is a delay in the delivery of data/assets from the SECOND PARTY, the occurrence of <i>Force Majeure</i>, <i>feedback</i> queue limits, or the addition of features (<i>Change Request</i>) in the middle of an ongoing project."
        }
      ]
    },
    {
      title: "Article 5 - Revisions and Revision Limits",
      ayat: [
        {
          nomor: "5.1.",
          teks: "The SECOND PARTY has the right to propose revisions within reasonable tolerance limits during the completion stage (<i>User Acceptance Test</i>), with the absolute condition that the revision does not change, dismantle, or exceed the scope of the main essence of the architecture and <i>database</i> declared in the beginning of Article 1."
        },
        {
          nomor: "5.2.",
          teks: "The format for submitting revisions must be circulated and distributed in writing accumulatively in one document delivery/series of points (<i>Batch Submit</i>) so that repairs run logically and efficiently."
        },
        {
          nomor: "5.3.",
          teks: "If the revision design is proven to trigger a major overhaul of the basic application framework (<i>Major Overhaul</i>) or spawn purely new functionality, the application automatically falls under the additional scope provisions (<i>Change Request</i>) in Article 7."
        }
      ]
    },
    {
      title: "Article 6 - Late Payment",
      ayat: [
        {
          nomor: "6.1.",
          teks: "The SECOND PARTY is obliged to complete its financial obligations according to the related billing terms (<i>Invoice</i>). The maximum suspension time for the Settlement/Handover Term payment is limited to 30 (thirty) working days after notification that the Work is complete and handed over."
        },
        {
          nomor: "6.2.",
          teks: "If the SECOND PARTY ignores and violates the 30 (thirty) working days leeway, the FIRST PARTY holds full undeniable rights (<i>Veto</i>) to enforce access suspension (<i>Suspend</i>), demote/disable the visibility of the System to the public, up to revoking <i>server</i> facilities unilaterally until all arrears are fully paid off."
        }
      ]
    },
    {
      title: "Article 7 - Provisions for Scope Changes (Change Request)",
      ayat: [
        {
          nomor: "7.1.",
          teks: "Every addition of function, basic architecture, addition of structure within the <i>database</i> hierarchy, absolute request for <i>UI</i> design that differs from the <i>wireframe</i> proposed by the FIRST PARTY, as well as features outside the initial scope of work, will issue a new addendum (<i>Change Request</i>)."
        },
        {
          nomor: "7.2.",
          teks: "The FIRST PARTY has full right to determine the cost/compensation of any addition of function with consideration of research time and shifted system logistic flow."
        }
      ]
    },
    {
      title: "Article 8 - Third-Party Services and Licenses",
      ayat: [
        {
          nomor: "8.1.",
          teks: "During the operational cycle of the System, the FIRST PARTY is authorized to embed instrument integrations from third parties (<i>Third-Party Service/API</i>), for example but not limited to <i>cloud</i> computing network services, email message delivery routes (<i>SMTP</i>), online payment processing (<i>Payment Gateway</i>), and other license libraries."
        },
        {
          nomor: "8.2.",
          teks: "The obligation to renew annual retributions, upgrade quotas over external service transaction limits, post-expiration licenses after the System Handover Date (<i>Deployment</i>), becomes purely the responsibility and cost burden of the SECOND PARTY, which is a separate obligation and rightfully stands alone outside of the initial fee package value."
        }
      ]
    },
    {
      title: "Article 9 - Backup and Data Responsibility",
      ayat: [
        {
          nomor: "9.1.",
          teks: "The FIRST PARTY always strives to provide an automatic data backup scheme (<i>Automated Backup</i>) passively natively from the <i>cloud provider</i> service at the main infrastructure level to prevent hardware failures (<i>Hardware Failure</i>)."
        },
        {
          nomor: "9.2.",
          teks: "However, fundamentally, the preservation of information integrity for log mutations, security of <i>records</i> history, vigilance against <i>phishing</i>, protection from accidental deletion (<i>Human Error Deletion</i>), and all technical storage activities inside the Dashboard after the full handover transition period must be carried out in layers by the <i>administrator</i> designated by the SECOND PARTY."
        },
        {
          nomor: "9.3.",
          teks: "The FIRST PARTY is released completely from legal instruments, moral burdens, and from any forms of legal demands for partial damage or total destruction of data ownership (<i>Data Loss</i>) caused by access control negligence from the SECOND PARTY's side, and/or due to the server storage capacity being full (<i>Storage Exhaustion</i>)."
        }
      ]
    },
    {
      title: "Article 10 - Handover & Maintenance Warranty",
      ayat: [
        {
          nomor: "10.1.",
          teks: "Handover is considered complete (<i>Finalizing</i>) when the System has been raised to the Public Production Server (<i>Public Production Live-Server</i>) and the FIRST PARTY has sent Admin Access Rights (<i>Administrator Credential Rights</i>) along with <i>Domain</i> ownership access to the SECOND PARTY's <i>email</i>."
        },
        {
          nomor: "10.2.",
          teks: "After full handover, the FIRST PARTY guarantees application functionality and provides Standard Warranty protection in the form of <i>Bug-Fixing</i> (Free of charge) with a time limitation:",
          list: [
            "Duration: 30 (Thirty) calendar days from the date of the official handover.",
            "Warranty Coverage: Fixing systematic <i>errors</i> (<i>bugs</i>), imprecise system calculations, <i>404/500 errors</i> due to code, and component interfaces post-<i>deploy</i>.",
            "Warranty Exclusion: The warranty instantly VOIDS and IS INVALID if forced injection occurs by the SECOND PARTY's staff into the <i>source code</i>, <i>human-error</i> mistakes by SECOND PARTY's staff deleting data from the Dashboard, loss of <i>passwords</i> due to the SECOND PARTY's negligence, <i>domain</i> migration without notice to the FIRST PARTY, or hacking/network exploitation actions by third parties beyond normal architectural security reach."
          ]
        },
        {
          nomor: "10.3.",
          teks: "Beyond these warranty limitations, if the SECOND PARTY desires the FIRST PARTY to monitor the system continuously, they must purchase and activate the \"Advanced Monthly <i>Maintenance</i> (<i>RTP</i>)\" service."
        }
      ]
    },
    {
      title: "Article 11 - Communication Support",
      ayat: [
        {
          nomor: "11.1.",
          teks: "All functional coordination flows, technical feedback reports (<i>Progress Report & Feedback</i>), as well as the provision of operation communication assistance between the PARTIES are essentially focused on electronic-based channels (such as <i>WhatsApp Group</i>, <i>Email</i>, or <i>Ticket System</i>) previously determined."
        },
        {
          nomor: "11.2.",
          teks: "The estimated speed of problem handling (<i>Response Time</i>) absolutely depends on the urgency/complexity classification of the issue. The FIRST PARTY will present exclusive professional <i>support</i> responses during active operational working days and hours, restricted out of intervention from national holiday/leave celebration schedules recognized by the Indonesian government."
        }
      ]
    },
    {
      title: "Article 12 - Project Termination",
      ayat: [
        {
          nomor: "12.1.",
          teks: "This Agreement can be terminated faster and instantaneously than agreed upon by either PARTY should the opposing PARTY be caught committing a deficit in commitment/vital breach continuously (<i>Default</i>) or cannot be mediated back even after a 3x24 hours administrative warning confirmation has been issued."
        },
        {
          nomor: "12.2.",
          teks: "If an initiative to cancel design development unilaterally (one-sided) happens from the SECOND PARTY's perspective, while the technical process is ongoing or after full operation, the FIRST PARTY is strictly prohibited from being associated with <i>Refund</i> bills. All transferred advance payments become Forfeit (<i>Non-Refundable</i>)."
        },
        {
          nomor: "12.3.",
          teks: "Adding weight, the SECOND PARTY holds high risk to be exposed to the issuance of a comparative cross-compensation Penalty Invoice in percentage value, for accumulated dedication of material logistics volume, consumption of working energy/time progress (<i>Pro-rata base</i>) by the FIRST PARTY."
        }
      ]
    },
    {
      title: "Article 13 - Intellectual Property Rights (IPR)",
      ayat: [
        {
           nomor: "13.1.",
           teks: "All derivative legal entities of the project (example: transaction <i>Database</i>, SECOND PARTY's staff data, Trade Mark Name \"Geo Mitra Gateway\") and the absolute use rights of the <i>domain</i> become the SECOND PARTY's ownership rights post 100% full settlement (Term III)."
        },
        {
           nomor: "13.2.",
           teks: "However, the FIRST PARTY retains absolute intellectual property and economic rights (<i>Royalty-free Developer License</i>) inherent over the Source Base Logic, <i>Grid</i> System, Maps Calculation Base Algorithms, as well as technical abstractions/frameworks (<i>Framework Pattern</i>) specifically designed by FIRST PARTY developers to be free of singular claim dominance."
        },
        {
           nomor: "13.3.",
           teks: "The FIRST PARTY continually holds full authority to make this non-identity abstraction into a development portfolio. The SECOND PARTY is legally not permitted to duplicate, reverse-engineer, or resell the system's <i>Source Code</i> to other external parties purely as standalone software (<i>re-selling the software-as-a-service code</i>) – unless this system is sold and bought simultaneously in its entirety as a valid acquisition of all Corporate Bodies belonging to the SECOND PARTY."
        }
      ]
    },
    {
       title: "Article 14 - Privacy Policy & Personal Data Protection",
       ayat: [
         {
           nomor: "14.1.",
           teks: "Referring definitely to Law Number 27 of 2022 on Personal Data Protection (UU PDP) and Law Number 11 of 2008 concerning Electronic Information and Transactions (UU ITE) along with its derivatives, the PARTIES agree to obey, maintain confidentiality, security, and integrity of all forms of personal data exchanged, entered, or processed within the System."
         },
         {
           nomor: "14.2.",
           teks: "The FIRST PARTY purely acts as a technical data processor (<i>Data Processor</i>), guarantees standard security levels and will not share, <i>data-mine</i>, sell, or exploit the personal data of clients, staff, or partners of the SECOND PARTY to any third party without a valid legal court order."
         },
         {
           nomor: "14.3.",
           teks: "The SECOND PARTY acts wholly as the data controller (<i>Data Controller</i>), holding full control and ultimate governance authority over all information collected inside the System. All forms of legal disputes or commercial claims arising due to misuse of operational data (such as data leaks, <i>phishing</i>) that arise purely due to hacks or negligence in manipulating access rights from the line of staff/administrator devices of the SECOND PARTY, lie 100% on the independent legal binding and jurisdiction responsibility of the SECOND PARTY."
         },
         {
           nomor: "14.4.",
           teks: "All data stored on <i>cloud</i> infrastructure is protected by applied <i>cloud provider</i> security layers. The FIRST PARTY only has the right to temporal and limited system access to pure <i>database logs</i> within the corridor of necessity for <i>Bug-Fixing</i>, emergency cybersecurity enhancements, and <i>server</i> maintenance without compromising the principle of communication freedom/privacy."
         }
       ]
    },
    {
       title: "Article 15 - Force Majeure",
       ayat: [
         {
           nomor: "15.1.",
           teks: "Force Majeure corresponds to events out of the power and conscious ability of humans resulting in stoppage or delay in performing obligations, including but not limited to: natural disasters, mass plagues, riots, wars, binding state apparatus policies/regulations, and massive outages/disruptions (<i>DDoS</i>, <i>Node Issue</i>) on the national/international <i>internet backbone</i> path from <i>providers</i> that trigger massive <i>server downs</i>."
         },
         {
           nomor: "15.2.",
           teks: "In the event of a <i>Force Majeure</i>, the constrained PARTY bears an obligation to inform this proportionally and transparently to the other PARTIES in order to perform deliberation on schedule delay compensation solutions without creating final disputes."
         }
       ]
    },
    {
      title: "Article 16 - Dispute Resolution",
      ayat: [
        {
          nomor: "16.1.",
          teks: "Considering the essence of this Agreement is bound to the laws of the Unitary State of the Republic of Indonesia, if in the future a dispute or difference of interpretation occurs related to this Agreement, the PARTIES agree to resolve it exclusively via kinship deliberation path to a consensus and <i>win-win solution</i>."
        },
        {
          nomor: "16.2.",
          teks: "If the deliberation act as described in 16.1 is proven to fail during a long mediation incubation period, then the PARTIES agree to elect final settlement through the courts of commerce/agreed law following the jurisdiction hierarchy domiciled where the FIRST PARTY is based."
        }
      ]
    },
    {
      title: "Article 17 - Digital Consent and Binding Agreement",
      ayat: [
        {
          nomor: "17.1.",
          teks: "Firmly referring to Article 18 on Electronic Transaction instruments according to the Electronic Information and Transactions Law (UU ITE), the existence of the Invoice proof, incoming bank cash transfer (<i>Bank Statement</i>), and access to this <i>E-Contract</i> are absolutely valid equivelant to affixing physical signatures on physical Republic of Indonesia Duty Stamps."
        },
        {
          nomor: "17.2.",
          teks: "The transaction and confirmation of first payment (Down Payment/<i>DP</i>) from the Client (SECOND PARTY) becomes a very strong digital record/audit trail that transcribes consent (<i>Consent/Agreement of Will</i>), legal acknowledgement, jurisdictional obedience, as well as concrete reception of ALL commercial technical terms natively inside this Agreement independently holding an absolute position even without any conventional wet graphic sign/autograph."
        }
      ]
    }
  ],
  footer: "By agreeing to the transaction, remitting Term One's payment, and/or utilizing the digital tandem <i>platform</i> resulted from this collaboration, the Client (SECOND PARTY) declares themselves to be verifiably conscious, physically intact, having read, understood linguistically or in terms of commercial legal matching, and <i>in-absentia</i> bends to comply towards the full Digital Terms and Conditions (<i>E-Contract Terms of Service</i>) here without any modicum of engineering, aspect of coercion, <i>intellectual-fraud</i>, or trapping clauses from any middlemen counterparts."
};
