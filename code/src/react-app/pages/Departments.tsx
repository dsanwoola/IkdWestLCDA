import { useState } from 'react';
import { Link } from 'react-router';
import { 
  ArrowRight, 
  Building2,
  Users,
  Wallet,
  Wrench,
  GraduationCap,
  Leaf,
  Trash2,
  HandHeart,
  Monitor,
  Mail,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
  Calculator,
  Search,
  Megaphone,
  Palmtree,
  Scale,
  MapPinned,
  ScrollText,
  ShoppingCart,
  Stethoscope
} from 'lucide-react';
import { Card, CardContent } from '@/react-app/components/ui/card';
import { Button } from '@/react-app/components/ui/button';
import { Badge } from '@/react-app/components/ui/badge';
import Layout from '@/react-app/components/layout/Layout';

const departments = [
  {
    id: 1,
    name: 'Administration & Human Resources',
    slug: 'administration',
    icon: Users,
    color: 'bg-blue-500',
    head: {
      name: 'Mrs. Bisola Bello',
      title: 'HOD, Admin & HR',
      image: '/assets/mocha/hod-hr-west.jpeg'
    },
    description: 'The backbone of LCDA operations, responsible for personnel management, staff welfare, and administrative coordination across all departments.',
    responsibilities: [
      'Staff recruitment and placement',
      'Employee training and development',
      'Performance management',
      'Policy implementation',
      'Administrative coordination'
    ],
    services: [
      'Employment verification letters',
      'Staff ID card issuance',
      'Pension documentation',
      'Staff welfare programs'
    ],
    programs: [
      {
        name: 'Head of Administration Functions',
        activities: [
          'Assist in conjunction with the Secretary to the Local Government in the formulation, execution and review of Local Government Policies',
          'Administrative management and supervision of all staff of the Local Government',
          'Coordination of activities of all Departments/Units of the Local Government as directed by the Chairman',
          'Ensuring monthly Bank reconciliation statement and signing of Bank confirmation with the Chairman',
          'Ensure the smooth operations of the Area Offices in the Local Government/Local Council Development Area',
          'Attending Executive Council meetings',
          'Assisting the Secretary to the Local Government in preparing and circulating minutes of meetings of the Executive Committee meetings',
          'Keeping proper records of all Local Government properties and to ensure prompt retrieval of such properties from members when they cease to be members of the Local Government',
          'Co-ordinating Chieftaincy matters in the Local Government in line with Chieftaincy laws',
          'Performing such other related duties as may be assigned by the Chairman'
        ]
      },
      {
        name: 'Human Resources Duties',
        activities: [
          'Liaising with the Local Government Service Commission and other Government Agencies on matters affecting career progression, discipline, promotion, transfer, welfare and other matters affecting the Local Government staff',
          'Liaising with the Local Government Service Commission in coordinating training activities of the Local Government staff',
          'In charge of day-to-day running of the department',
          'Implementation of establishment policies',
          'Chairman of the Junior Staff/Management Committee for Officers on GL. 01-06',
          'Liaises with the Head of Administration in respect of Selection, Recruitment, Training & Development in the Local Government Staff on GL. 01-06',
          'Labour Relations/Employees\' Safety, Compensation & Benefits; Pension Matters',
          'Enforces the rules and regulations on matters of career progression, discipline, promotion, welfare affecting Local Government staff on GL. 01-06'
        ]
      }
    ],
    contact: {
      email: 'bisolabelo@gmail.com',
      office: 'Ground Floor, LCDA Secretariat'
    },
    hours: 'Mon - Fri: 8:00 AM - 4:00 PM'
  },
  {
    id: 2,
    name: 'Planning & Budget',
    slug: 'finance',
    icon: Wallet,
    color: 'bg-emerald-500',
    head: {
      name: 'Mr. Ogunbambi Ismail Abiodun',
      title: 'HOD, Planning, Budget, Research & Statistics',
      image: '/assets/mocha/HOD-FINANCE-IKD-WEST.jpeg'
    },
    description: 'The "brain" of the Local Government. Handles data, analysis, and forward planning framework. Manages financial resources ensuring prudent allocation, transparent reporting, and compliance with fiscal regulations.',
    responsibilities: [
      'Budget preparation and monitoring',
      'Revenue collection and management',
      'Financial reporting and auditing',
      'Payroll administration',
      'Procurement oversight',
      'Economic planning and policy formulation',
      'Research and feasibility studies',
      'Statistical data collection and analysis'
    ],
    services: [
      'Tax clearance certificates',
      'Payment processing',
      'Vendor registration',
      'Budget transparency reports'
    ],
    programs: [
      {
        name: 'Economic Planning Section',
        activities: [
          'Strategic Planning: Develop short, medium, and long-term plans aligned with Local Government goals',
          'Policy Formulation: Design economic policies, programs, and projects based on data and forecasts',
          'Budget Coordination: Prepare annual, reordering, and supplementary budgets; manage MTEF and link budget to sectoral priorities',
          'Development Planning: Coordinate sectoral plans and ensure alignment with Federal/Lagos State Development Plan 2025–2050'
        ]
      },
      {
        name: 'Research Section',
        activities: [
          'Policy Research: Conduct studies on economic trends, market survey analysis, and social issues',
          'Assessment Measurement: Assess revenue inflow and expenditure outcomes; recommend improvements',
          'Feasibility Studies: Appraise viability of proposed projects before funding/implementation',
          'Advisory Role: Provide evidence-based recommendations for decision-making processes'
        ]
      },
      {
        name: 'Statistics Unit',
        activities: [
          'Data Collection: Gather primary and secondary data from internal units and external sources',
          'Data Management: Maintain reliable databases, ensure data integrity, and manage statistical records',
          'Analysis & Reporting: Process data into actionable materials through periodic statistical bulletins',
          'Monitoring & Evaluation: Track KPIs, measure performance against targets, and produce M&E reports'
        ]
      },
      {
        name: 'Cross-Cutting Duties',
        activities: [
          'General Liaison: Interface with MEPB, Bureau of Statistics, AG Office, other MDAs, and international agencies',
          'Capacity Building: Train staff on planning tools, M&E frameworks, and data usage/appreciation',
          'Funding Support: Provide data to justify budget requests, donor proposals, and PPP investments',
          'Publications: Produce weekly, monthly, quarterly, and annual budget performance reports'
        ]
      }
    ],
    contact: {

      email: 'ismailogunbambi@yahoo.com',
      office: 'First Floor, LCDA Secretariat'
    },
    hours: 'Mon - Fri: 8:00 AM - 4:00 PM'
  },
  {
    id: 3,
    name: 'Works & Infrastructure',
    slug: 'works',
    icon: Wrench,
    color: 'bg-amber-500',
    head: {
      name: 'Engr. Jimoh Mufutau Ademola',
      title: 'HOD, Works & Infrastructure',
      image: '/assets/mocha/HOD-work-ikd-west.jpeg'
    },
    description: 'Oversees the design, construction, and maintenance of public infrastructure including local roads, drainages, and public buildings within the LCDA.',
    responsibilities: [
      'Road construction and maintenance',
      'Public building maintenance',
      'Drainage system management',
      'Street lighting',
      'Project supervision',
      'Infrastructure design',
      'Regulatory compliance'
    ],
    services: [
      'Building plan approval',
      'Road maintenance requests',
      'Infrastructure inspection',
      'Contractor registration'
    ],
    programs: [
      {
        name: 'Planning & Design',
        activities: [
          'Developing and designing new infrastructure projects',
          'Conducting feasibility studies for proposed projects',
          'Planning public buildings and facilities',
          'Designing road networks and connectivity',
          'Designing drainage systems for flood control'
        ]
      },
      {
        name: 'Construction & Rehabilitation',
        activities: [
          'Executing construction of infrastructure projects',
          'Supervising ongoing construction works',
          'Monitoring construction to ensure engineering standards are met',
          'Rehabilitating existing infrastructure',
          'Quality assurance and control'
        ]
      },
      {
        name: 'Maintenance & Repair',
        activities: [
          'Performing routine inspections of infrastructure',
          'Preventive maintenance on existing assets',
          'Repairs on roads, drainages, and buildings',
          'Extending lifespan of public infrastructure',
          'Ensuring safety of all public facilities'
        ]
      },
      {
        name: 'Regulatory Compliance',
        activities: [
          'Ensuring all projects meet legal standards',
          'Compliance with safety regulations',
          'Environmental standards compliance',
          'Building code enforcement',
          'Quality certification of projects'
        ]
      },
      {
        name: 'Project & Resources Management',
        activities: [
          'Managing project budgets effectively',
          'Allocating resources efficiently',
          'Ensuring projects are completed on schedule',
          'Contractor management and coordination',
          'Project documentation and reporting'
        ]
      },
      {
        name: 'Public Services & Infrastructure Management',
        activities: [
          'Managing public utilities',
          'Water supply infrastructure oversight',
          'Sanitation systems management',
          'Waste systems coordination',
          'Public amenities maintenance'
        ]
      }
    ],
    contact: {

      email: 'mufjim@yahoo.com',
      office: 'Works Department Complex'
    },
    hours: 'Mon - Fri: 8:00 AM - 4:00 PM'
  },
  
  {
    id: 5,
    name: 'Education & Library Services',
    slug: 'education',
    icon: GraduationCap,
    color: 'bg-purple-500',
    head: {
      name: 'Mrs. Alabi Folake',
      title: 'HOD, Education & Library Services',
      image: '/assets/mocha/HOD-du-ikd-west.jpeg',
      deploymentDate: '23rd July 2023'
    },
    description: 'Manages primary education within the LCDA, ensuring quality learning environments and supporting teachers and students.',
    responsibilities: [
      'School supervision',
      'Teacher welfare',
      'Curriculum support',
      'School infrastructure',
      'Student welfare programs'
    ],
    services: [
      'School enrollment assistance',
      'Transfer certificates',
      'Scholarship programs',
      'Adult literacy classes'
    ],
    programs: [
      {
        name: 'Head of Department Roles & Responsibilities',
        activities: [
          'Lead, supervise and improve education delivery in the local government',
          'Supervision of schools and implementation of education policies',
          'Staff management and monitoring of academic performance',
          'Resource management for educational facilities and materials',
          'Planning and budgeting for departmental activities',
          'Community and stakeholder engagement on education matters',
          'Data collection and reporting on educational outcomes',
          'Ensuring discipline and standards across all schools',
          'Programme coordination for educational initiatives',
          'Management of department instruments (vouchers, activity reports)',
          'Preparation of departmental itineraries and workloads'
        ]
      }
    ],
    contact: {

      email: 'alabifolake48@gmail.com',
      office: 'Education Resource Center'
    },
    hours: 'Mon - Fri: 8:00 AM - 4:00 PM'
  },
  {
    id: 6,
    name: 'Agric & Social Services',
    slug: 'agriculture',
    icon: Leaf,
    color: 'bg-green-600',
    head: {
      name: 'Mrs. Funmi Oyebowale',
      title: 'HOD, Agric & Social Services',
      image: '/assets/mocha/Hod-Agric-west.jpeg'
    },
    description: 'Promotes agricultural development, supports farmers, and implements rural development programs to boost food security. This includes all services that promote food security, job creation and value addition in the production chain.',
    responsibilities: [
      'Agricultural extension services',
      'Farmer support programs',
      'Rural infrastructure development',
      'Agricultural training',
      'Market linkage support'
    ],
    services: [
      'Farm input subsidies',
      'Agricultural training',
      'Veterinary services',
      'Farm registration'
    ],
    programs: [
      {
        name: 'Agricultural Support Services',
        activities: [
          'Provision of fertilizer to local farmers',
          'Distribution of fishing nets',
          'Supply of fingerlings for fish farming',
          'Provision of improved seedlings',
          'Farm tools and equipment support'
        ]
      },
      {
        name: 'Agricultural Extension Services',
        activities: [
          'Visitation to farm sites',
          'Professional advice to farmers',
          'Farm management guidance',
          'Pest and disease control advisory',
          'Best farming practices training'
        ]
      },
      {
        name: 'Government Representation',
        activities: [
          'Represent Local Government at Ministry of Agriculture',
          'Liaison on agricultural policies',
          'Coordination of state agricultural programs',
          'Advocacy for local farmers'
        ]
      },
      {
        name: 'World Food Day & Farmers Festival',
        activities: [
          'Annual World Food Day celebration',
          'Farmers festival and recognition',
          'Agricultural exhibition and fair',
          'Best farmer awards ceremony'
        ]
      },
      {
        name: 'Other Agricultural Programs',
        activities: [
          'Agricultural cooperative formation support',
          'Market linkage and value chain development',
          'Youth in agriculture initiatives',
          'Women farmers empowerment',
          'Climate-smart agriculture promotion'
        ]
      }
    ],
    socialServicesPrograms: [
      {
        name: 'Community Development',
        activities: [
          'Supervision and coordinating the formation of Community Development Associations (CDAs) and Community Development Committees (CDCs)',
          'Initiating and executing Government Policies and Programmes on Community Development',
          'Mobilization of CDA and CDC members for Government programmes',
          'Liaise with State Government on Community Development matters',
          'Community Day Celebration'
        ]
      },
      {
        name: 'Community Sports',
        activities: [
          'Initiate and execute all indoor and outdoor sporting activities within the community',
          'Facilitate participation of the Local Government at State Government organized sporting events',
          'Liaise with the Ministry of Sports on all sporting activities'
        ]
      },
      {
        name: 'Youths',
        activities: [
          'Responsible for initiating and executing programmes and policies on Youth Development',
          'Coordinate and supervise National Youth Council of Nigeria (NYCN)',
          'Serve as liaison with Ministry of Youth and Social Development'
        ]
      },
      {
        name: 'Family Care',
        activities: [
          'Responsible for the Government intervention programmes and policies in the Family Unit',
          'Mobilize Local Government participation in the annual Family Week Celebration',
          'Liaise with State Government on Family related issues',
          'Anchor family related programmes at the Local Government level'
        ]
      },
      {
        name: 'Elderly Persons',
        activities: [
          'Responsible for initiating and organizing policies and programmes for the elderly persons',
          'Serve as liaison with State Ministry on Elderly Persons related matters',
          'Senior Citizens Day Celebration'
        ]
      },
      {
        name: 'Physically Challenged Persons / People Living with Physical Disability',
        activities: [
          'Responsible for initiating and organizing policies and programmes on the welfare of people living with physical disability',
          'Mobilization of disabled persons to State Government programmes',
          'Liaise with the Lagos State Office for Disability Affairs (LASODA)'
        ]
      },
      {
        name: 'Rehabilitation',
        activities: [
          'Responsible for rehabilitation, counseling and referral of people suffering from the menace of drug abuse and other social vices related matters',
          'Responsible for advocacy, sensitization and stakeholders programmes on drug abuse and other social vices',
          'Liaise with State Government on rehabilitation programmes',
          'Responsible for Diversion Community Rehabilitation Programmes'
        ]
      },
      {
        name: 'Associations & Clubs',
        activities: [
          'Responsible for registration, coordination and supervision of clubs and associations in the Local Government',
          'Mobilizes registered associations and clubs to Government programmes',
          'Liaise with State Government on Non-Governmental Organisations (NGOs) matters'
        ]
      },
      {
        name: 'Religious Activity',
        activities: [
          'Responsible for coordination of religious activities',
          'Supervise the Local Chapter of Nigeria Inter Religious Council (NIREC)',
          'Liaise with State Government on religious related matters'
        ]
      },
      {
        name: 'Paramilitary',
        activities: [
          'Responsible for coordination of paramilitary activities at the Local Government',
          'Initiate welfare programme for Ex-Service men and other paramilitary personnels',
          'Liaise with State Government on paramilitary activities'
        ]
      },
      {
        name: 'Vocational Training',
        activities: [
          'Responsible for impacting non-gender based skills and vocations on the community people',
          'Serve as liaison to the State Government on all State organized vocational trainings'
        ]
      },
      {
        name: 'Artisans & Related Issues',
        activities: [
          'Coordinate the activities of artisans at the Local Government level',
          'Responsible for activities of Small & Medium Enterprises Development Agency of Nigeria (SMEDAN) at the Local Government level',
          'Mobilize artisans to Government programmes'
        ]
      },
      {
        name: 'Mobilization',
        activities: [
          'Serve as Chief Mobilization Officer of relevant stakeholders to the Local Government programmes',
          'Responsible for mobilization of stakeholders to State organized programmes'
        ]
      }
    ],
    contact: {

      email: 'agric@ikoroduwestlcda.gov.ng',
      office: 'Agricultural Center, Agric'
    },
    hours: 'Mon - Fri: 8:00 AM - 4:00 PM'
  },
  {
    id: 7,
    name: 'Environment & Sanitation',
    slug: 'environment',
    icon: Trash2,
    color: 'bg-teal-500',
    head: {
      name: 'Hungbo Monsurat A.',
      title: 'HOD, Environment & Sanitation',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
      email: 'hungbomonsurat@gmail.com'
    },
    description: 'Maintains environmental cleanliness, manages waste disposal, and enforces environmental regulations for a healthier community. The department oversees sanitation activities across the LCDA and carries out any other assignments given by Superior Authority.',
    responsibilities: [
      'Daily monitoring of environmental activities',
      'Issuance of Abatement Notice where necessary',
      'Enforcement of environmental regulations',
      'Weekly, Monthly and Annual Reports',
      'Monthly Environmental Sanitation Exercise'
    ],
    services: [
      'Environmental permits',
      'Fumigation services',
      'Waste collection scheduling',
      'Pest and vector control',
      'Medical waste management'
    ],
    programs: [
      {
        name: 'Environmental Health Activities',
        activities: [
          'Routine inspection of premises',
          'School Sanitation',
          'Inspection of Regulated Premises',
          'Market and Abattoir Sanitation',
          'Solid waste management',
          'Medical waste management',
          'Pest and vector control',
          'Vegetal nuisance control',
          'Control of reared and stray animals',
          'Cemetery Sanitation (where there is public cemetery)',
          'Motor park Sanitation',
          'Treatment and Verification of complaints',
          'Health Education and promotion',
          'Monitoring and Supervision of the PSP'
        ]
      }
    ],
    contact: {

      email: 'hungbomonsurat@gmail.com',
      office: 'Environmental Office, LCDA Secretariat'
    },
    hours: 'Mon - Sat: 7:00 AM - 5:00 PM'
  },
  {
    id: 8,
    name: 'WAPA (Woman Affairs & Poverty Alleviation)',
    slug: 'social-welfare',
    icon: HandHeart,
    color: 'bg-pink-500',
    head: {
      name: 'Mrs. Folake Adewuyi',
      title: 'HOD, WAPA',
      image: '/assets/mocha/hod-wapa-west.jpeg'
    },
    description: 'Focuses on women empowerment, poverty alleviation, and community development initiatives. Provides social services, supports vulnerable groups, and coordinates development programs across all wards. The department manages 13 program areas to aid citizens during their time of need.',
    responsibilities: [
      'Community Development coordination',
      'Youth & Sports programs',
      'Family Care & Elderly support',
      'Disability services & Rehabilitation',
      'Vocational Training & Artisan coordination'
    ],
    services: [
      'Marriage registration',
      'Birth/Death registration',
      'Indigene certificates',
      'Community grants',
      'Youth programs',
      'Vocational training',
      'Association registration'
    ],
    contact: {

      email: 'wapa@ikoroduwestlcda.gov.ng',
      office: 'Social Services Building'
    },
    hours: 'Mon - Fri: 8:00 AM - 4:00 PM',
    programs: [
      {
        name: 'Community Development',
        activities: [
          'Supervision and coordinating the formation of Community Development Associations (CDAs) and Community Development Committees (CDCs)',
          'Initiating and executing Government Policies and Programmes on Community Development',
          'Mobilization of CDA and CDC members for Government programmes',
          'Liaise with State Government on Community Development matters',
          'Community Day Celebration'
        ]
      },
      {
        name: 'Community Sports',
        activities: [
          'Initiate and execute all indoor and outdoor sporting activities within the community',
          'Facilitate participation of the Local Government at State Government organized sporting events',
          'Liaise with the Ministry of Sports on all sporting activities'
        ]
      },
      {
        name: 'Youths',
        activities: [
          'Responsible for initiating and executing programmes and policies on Youth Development',
          'Coordinate and supervise National Youth Council of Nigeria (NYCN)',
          'Serve as liaison with Ministry of Youth and Social Development'
        ]
      },
      {
        name: 'Family Care',
        activities: [
          'Responsible for the Government intervention programmes and policies in the Family Unit',
          'Mobilize Local Government participation in the annual Family Week Celebration',
          'Liaise with State Government on Family related issues',
          'Anchor family related programmes at the Local Government level'
        ]
      },
      {
        name: 'Elderly Persons',
        activities: [
          'Responsible for initiating and organizing policies and programmes for the elderly persons',
          'Serve as liaison with State Ministry on Elderly Persons related matters',
          'Senior Citizens Day Celebration'
        ]
      },
      {
        name: 'Physically Challenged Persons / People Living with Physical Disability',
        activities: [
          'Responsible for initiating and organizing policies and programmes on the welfare of people living with physical disability',
          'Mobilization of disabled persons to State Government programmes',
          'Liaise with the Lagos State Office for Disability Affairs (LASODA)'
        ]
      },
      {
        name: 'Rehabilitation',
        activities: [
          'Responsible for rehabilitation, counseling and referral of people suffering from the menace of drug abuse and other social vices related matters',
          'Responsible for advocacy, sensitization and stakeholders programmes on drug abuse and other social vices',
          'Liaise with State Government on rehabilitation programmes',
          'Responsible for Diversion Community Rehabilitation Programmes'
        ]
      },
      {
        name: 'Associations & Clubs',
        activities: [
          'Responsible for registration, coordination and supervision of clubs and associations in the Local Government',
          'Mobilizes registered associations and clubs to Government programmes',
          'Liaise with State Government on Non-Governmental Organisations (NGOs) matters'
        ]
      },
      {
        name: 'Religious Activity',
        activities: [
          'Responsible for coordination of religious activities',
          'Supervise the Local Chapter of Nigeria Inter Religious Council (NIREC)',
          'Liaise with State Government on religious related matters'
        ]
      },
      {
        name: 'Paramilitary',
        activities: [
          'Responsible for coordination of paramilitary activities at the Local Government',
          'Initiate welfare programme for Ex-Service men and other paramilitary personnels',
          'Liaise with State Government on paramilitary activities'
        ]
      },
      {
        name: 'Vocational Training',
        activities: [
          'Responsible for impacting non-gender based skills and vocations on the community people',
          'Serve as liaison to the State Government on all State organized vocational trainings'
        ]
      },
      {
        name: 'Artisans & Related Issues',
        activities: [
          'Coordinate the activities of artisans at the Local Government level',
          'Responsible for activities of Small & Medium Enterprises Development Agency of Nigeria (SMEDAN) at the Local Government level',
          'Mobilize artisans to Government programmes'
        ]
      },
      {
        name: 'Mobilization',
        activities: [
          'Serve as Chief Mobilization Officer of relevant stakeholders to the Local Government programmes',
          'Responsible for mobilization of stakeholders to State organized programmes'
        ]
      }
    ]
  },
  {
    id: 9,
    name: 'Information & Communication Technology',
    slug: 'ict',
    icon: Monitor,
    color: 'bg-indigo-500',
    head: {
      name: 'Mrs. Yemisi Olatunji',
      title: 'HOD, ICT',
      image: '/assets/mocha/hod-ict-west.jpeg'
    },
    description: 'Drives digital transformation across the LCDA, manages IT infrastructure, and ensures citizens have access to modern e-governance services.',
    responsibilities: [
      'Provide advice and support to the organization and Procurement Unit on IT equipment, software and services procurement',
      'Ensure availability of LASG Enterprise Applications, official email services, cloud services, and domain/hosting accounts',
      'Oversee implementation and maintenance of technology infrastructure for changing business requirements',
      'Prepare strategic and operational plans to ensure all ICT tools, processes and systems meet organizational requirements',
      'Provide support for ICT capacity building and training',
      'Ensure Council assets are safeguarded and properly maintained in good working conditions',
      'Update and maintain the standard of ICT systems and equipment in use'
    ],
    services: [
      'LASG Enterprise Applications support',
      'Official email services',
      'Cloud services management',
      'Domain names and hosting',
      'ICT training and capacity building',
      'Technical support and maintenance'
    ],
    contact: {

      email: 'ict@ikoroduwestlcda.gov.ng',
      office: 'ICT Unit, LCDA Secretariat'
    },
    hours: 'Mon - Fri: 8:00 AM - 4:00 PM'
  },
  {
    id: 10,
    name: 'Finance & Account',
    slug: 'finance-account',
    icon: Calculator,
    color: 'bg-cyan-600',
    head: {
      name: 'Mr. Sola Dosunmu',
      title: 'HOD, Finance & Account',
      image: '/assets/mocha/hod-acct-west.jpeg'
    },
    description: 'Manages all financial transactions, accounts payable and receivable, payroll processing, and financial record-keeping for the LCDA. The Chief Financial Officer is responsible for managing finances, ensuring fiscal accountability and transparency in all council operations.',
    responsibilities: [
      'Chief Financial Officer of the Council',
      'Managing finances (daily cash inflows and outflows) ensuring fiscal accountability and transparency',
      'Collection of revenue (taxes, fees, licenses and revenue)',
      'Overseeing and supervising expenditure',
      'Managing cash flows to ensure sufficient liquidity',
      'Maintaining financial records',
      'Managing investments of the council',
      'Providing financial reports to ensure transparency in council operations',
      'Asset management',
      'Investment and debt management',
      'Regulatory compliance'
    ],
    services: [
      'Payment processing',
      'Financial statements',
      'Salary inquiries',
      'Vendor payments'
    ],
    contact: {

      email: 'soladosunmu@yahoo.com',
      office: 'Finance Block, LCDA Secretariat'
    },
    hours: 'Mon - Fri: 8:00 AM - 4:00 PM'
  },
  {
    id: 11,
    name: 'Primary Healthcare',
    slug: 'primary-healthcare',
    icon: Stethoscope,
    color: 'bg-rose-500',
    head: {
      name: 'Dr. Opeyemi Osunyomi',
      title: 'HOD, Primary Healthcare',
      image: '/assets/mocha/ikd-medical-hod.jpeg',
      email: 'opeyemi.osunyomi@lagosstate.gov.ng',
      deployed: 'October 2021'
    },
    description: 'Delivers essential healthcare services at the grassroots level, including immunization, maternal care, disease prevention, and health education programs. It is the responsibility of the MOH to endeavor to fully integrate all services at all levels (LGA/Wards and Village/Community).',
    responsibilities: [
      'Performs administrative and management activities of the department in accordance with laid down policy of the LGA',
      'Develops the annual LGA PHC work-plan incorporating other work-plans for specific programmes',
      'Plans budget for the implementation of the PHC work-plan',
      'Monitors LGA disbursement of funds for all PHC programmes on quarterly basis',
      'Budget health and health-related resource requirements for the LGA and collect from appropriate sources on quarterly basis',
      'Develop and implement community mobilization for the LGA',
      'Ensures appropriate and timely continuing education of staff at all levels',
      'Makes quarterly supervisory visit to wards using appropriate checklist and reviewing findings with ward supervisors',
      'Participates in monthly meeting of the LGA PHC Management and Technical Committees',
      'Organizes inter-wards continuing education on PHC activities as appropriate',
      'Monitors Data and DHIS monthly returns for the LGA',
      'Ensures Data and DHIS monthly returns for the LGA and forward to the PHCB (Primary Health Care Board)',
      'Provides feedback at every monthly meeting of LGA PHC Management and Technical Committee',
      'All other duties assigned by the PHCB and LGA Executive'
    ],
    services: [
      'Free medical consultations',
      'Immunization services',
      'Antenatal care',
      'Family planning',
      'Health education'
    ],
    contact: {

      email: 'opeyemi.osunyomi@lagosstate.gov.ng',
      office: 'Primary Healthcare Center'
    },
    hours: 'Mon - Sat: 8:00 AM - 6:00 PM'
  },
  {
    id: 12,
    name: 'Internal Audit',
    slug: 'internal-audit',
    icon: Search,
    color: 'bg-slate-600',
    head: {
      name: 'Mrs. Adesanya Olayinka',
      title: 'HOD, Internal Audit',
      image: '/assets/mocha/HOD-audit-ikd-west.jpeg'
    },
    description: 'Provides independent and objective assurance on financial operations, ensuring compliance with regulations, probity, and accountability. The Audit department guards against frivolous and spurious spending while ensuring Council funds are judiciously spent.',
    responsibilities: [
      'Financial auditing',
      'Compliance verification',
      'Risk assessment',
      'Internal controls review',
      'Audit reporting',
      'Revenue monitoring',
      'Expenditure verification'
    ],
    services: [
      'Financial compliance audits',
      'Operational audits',
      'Special investigations',
      'Advisory services'
    ],
    programs: [
      {
        name: 'Regular Reporting to Auditor General',
        activities: [
          'Monthly staff verification report submission to office of the Auditor General',
          'Monthly Audit report to office of the Auditor General',
          'Monthly Board of Survey Report to AG',
          'Daily, Weekly, Monthly, and Quarterly audit activities'
        ]
      },
      {
        name: 'Expenditure & Revenue Audit',
        activities: [
          'Continuous Audit of Expenditure and Revenue',
          'Act as check for payment of expenditure to ensure Council money is judiciously spent',
          'Guard against frivolous and spurious spending',
          'Check documentation of all Payment vouchers',
          'Ensure proper retirement of payment vouchers',
          'Continuous Audit on Revenue'
        ]
      },
      {
        name: 'Revenue & Billing Verification',
        activities: [
          'Check demand bills and ensure correctness before distribution by Revenue Officers',
          'Check comparison of Budget with performance'
        ]
      },
      {
        name: 'Stores & Procurement Audit',
        activities: [
          'Check stores procurement',
          'Monitor security documents and stationeries'
        ]
      },
      {
        name: 'Reporting & Compliance',
        activities: [
          'Report as prescribed by regulations the findings based on investigation',
          'Declare alarm where necessary on financial irregularities',
          'Ensure compliance with established regulations, standards, and guidelines',
          'Maintain probity and accountability in all functions'
        ]
      }
    ],
    contact: {

      email: 'adesanyayinka@gmail.com',
      office: 'Audit Office, LCDA Secretariat'
    },
    hours: 'Mon - Fri: 8:00 AM - 4:00 PM'
  },
  {
    id: 13,
    name: 'Public Affairs',
    slug: 'public-affairs',
    icon: Megaphone,
    color: 'bg-orange-500',
    head: {
      name: 'To Be Appointed',
      title: 'HOD, Public Affairs',
      image: '/assets/mocha/public-afric-hod-west.JPG'
    },
    description: 'The Public Affairs Unit of Ikorodu West LCDA is the statutory unit bequeathed with the responsibility of projecting positively the image of the LCDA through the activities of the Executive Chairman, Hon. Otunba Sulaiman Kazeem Olanrewaju (FCA, FCTI). The unit is very strategic and important to the overall well-being of the LCDA.',
    responsibilities: [
      'Communication Management',
      'Media Relations',
      'Public Information Dissemination',
      'Reputation and Image Management',
      'Stakeholder Engagement',
      'Crisis Communication',
      'Event Management'
    ],
    services: [
      'Press releases and official statements',
      'Public announcements',
      'Media coverage coordination',
      'Community engagement programs',
      'Event planning and execution',
      'Social media management'
    ],
    programs: [
      {
        name: '1. Communication Management',
        description: 'The Public Affairs Unit is responsible for planning, coordinating, and managing all communication activities of the LCDA by:',
        activities: [
          'Developing and implementing strategic communication plans',
          'Ensuring consistency in messaging across all communication channels',
          'Preparing official documents such as speeches, reports, and correspondence',
          'Managing communication platforms including emails, newsletters, and digital media',
          'Coordinating both internal and external communications'
        ]
      },
      {
        name: '2. Media Relations',
        description: 'Maintaining a strong relationship with the media is essential for effective public communication. We do this by:',
        activities: [
          'Building and sustaining relationships with journalists and media organizations',
          'Preparing and distributing press releases and official statements',
          'Organizing press conferences and media briefings',
          'Responding promptly to media inquiries',
          'Monitoring media coverage and addressing misinformation'
        ]
      },
      {
        name: '3. Public Information Dissemination',
        description: 'The unit ensures that the public is well-informed about the LCDA\'s activities and policies. We do this by:',
        activities: [
          'Providing accurate and timely information to the public',
          'Developing public awareness and sensitization campaigns',
          'Managing official websites and social media platforms',
          'Simplifying complex information for public understanding',
          'Promoting transparency in all communications'
        ]
      },
      {
        name: '4. Reputation and Image Management',
        description: 'The Public Affairs Unit safeguards and enhances the LCDA\'s public image. We do this by:',
        activities: [
          'Managing branding and corporate identity',
          'Addressing negative publicity effectively',
          'Showcasing achievements and success stories',
          'Ensuring alignment of public perception with organizational values'
        ]
      },
      {
        name: '5. Stakeholder Engagement',
        description: 'The unit engages with the different stakeholders of the LCDA through:',
        activities: [
          'Identifying and managing relationships with key stakeholders',
          'Organizing stakeholder meetings, forums, and consultations',
          'Gathering feedback and incorporating stakeholder input',
          'Strengthening partnerships and collaboration',
          'Ensuring stakeholder interests are considered in decision-making'
        ]
      },
      {
        name: '6. Crisis Communication',
        description: 'The unit is responsible for managing communication during emergencies or crises. We do this by:',
        activities: [
          'Developing crisis communication strategies and plans',
          'Providing timely and accurate information during crises',
          'Managing rumors and misinformation',
          'Acting as the official communication channel during emergencies',
          'Protecting the organization\'s reputation during critical situations'
        ]
      },
      {
        name: '7. Event Management',
        description: 'The Public Affairs Unit oversees the planning and execution of official events. We do this by:',
        activities: [
          'Planning and organizing events, ceremonies, and programs',
          'Coordinating logistics such as venue, invitations, and publicity',
          'Liaising with vendors and service providers',
          'Ensuring events align with organizational objectives',
          'Evaluating and documenting event outcomes'
        ]
      }
    ],
    contact: {

      email: 'publicaffairs@ikoroduwestlcda.gov.ng',
      office: 'Public Affairs Unit, LCDA Secretariat'
    },
    hours: 'Mon - Fri: 8:00 AM - 4:00 PM'
  },
  {
    id: 14,
    name: 'Tourism',
    slug: 'tourism',
    icon: Palmtree,
    color: 'bg-sky-500',
    head: {
      name: 'Mrs. Sarry Abiola',
      title: 'HOD, Tourism',
      image: '/assets/mocha/HOD-tourism-ikd-west.jpeg'
    },
    description: 'The Tourism Unit is responsible for developing, promoting, and managing tourism-related activities to boost economic growth, preserve culture, and enhance community engagement. It acts as a driver of culture, economy, and community identity, ensuring that local attractions are developed, promoted, preserved, and monetized effectively.',
    responsibilities: [
      'Tourism development and planning',
      'Promotion and marketing',
      'Event and festival management',
      'Cultural preservation',
      'Tourism site management',
      'Stakeholder engagement',
      'Public sensitization and education'
    ],
    services: [
      'Tourism information',
      'Event planning support',
      'Tour guide services',
      'Cultural programs',
      'Local crafts promotion'
    ],
    programs: [
      {
        name: 'Tourism Development and Planning',
        activities: [
          'Design and implement tourism development strategies for the locality',
          'Identify and develop new tourist attractions (cultural sites, festivals, heritage locations)'
        ]
      },
      {
        name: 'Promotion and Marketing',
        activities: [
          'Promote the local government as a tourist destination',
          'Organize publicity campaigns (media, social media, print materials)',
          'Collaborate with travel agencies, media houses, and tourism boards',
          'Showcase local culture, festivals, and heritage to attract visitors'
        ]
      },
      {
        name: 'Event and Festival Management',
        activities: [
          'Plan and coordinate cultural festivals, carnivals, and tourism events',
          'Manage logistics, scheduling, and stakeholder participation',
          'Ensure events reflect the cultural identity of the community',
          'Use events as tools for revenue generation and tourism promotion'
        ]
      },
      {
        name: 'Cultural Preservation',
        activities: [
          'Identify and document cultural heritage (traditions, artifacts, festivals)',
          'Work with traditional institutions (Baales, chiefs) to preserve customs',
          'Promote indigenous arts, crafts, and local cuisine',
          'Prevent the extinction of local cultural practices'
        ]
      },
      {
        name: 'Tourism Site Management',
        activities: [
          'Supervise and maintain tourist sites within the LCDA',
          'Ensure cleanliness, safety, and accessibility of sites',
          'Monitor visitor experience and satisfaction'
        ]
      },
      {
        name: 'Local Crafts & Products Promotion',
        activities: [
          'Promote local crafts and products for commercial purposes'
        ]
      },
      {
        name: 'Stakeholder Engagement',
        activities: [
          'Collaborate with traditional rulers and community leaders',
          'Work with Ministry of Tourism (State level)',
          'Engage private sector investors',
          'Partner with NGOs and cultural organizations',
          'Build partnerships that enhance tourism growth'
        ]
      },
      {
        name: 'Public Sensitization and Education',
        activities: [
          'Educate residents on the economic benefits of tourism',
          'Promote community participation in tourism activities',
          'Organize awareness campaigns on cultural values'
        ]
      }
    ],
    contact: {

      email: 'sarryabiola@gmail.com',
      office: 'Tourism Office, LCDA Secretariat'
    },
    hours: 'Mon - Fri: 8:00 AM - 4:00 PM'
  },
  {
    id: 15,
    name: 'Legal Services',
    slug: 'legal-services',
    icon: Scale,
    color: 'bg-violet-600',
    head: {
      name: 'Ogundele, A.D',
      title: 'HOD, Legal Services',
      image: '/assets/mocha/ikd-west-legal-hod.jpeg',
      email: 'bayodele115@yahoo.com',
      deployed: 'June 2024'
    },
    description: 'Provides legal counsel, handles litigation, drafts legal documents, and ensures LCDA operations comply with applicable laws and regulations. The Legal Unit advises the Executive Committee on all legal matters.',
    responsibilities: [
      'Advising the Executive Committee of the Local Government on legal matters',
      'Engagement in Legislative drafting of Bye laws',
      'Handling litigation matters for the LGA and representing the LGA in Arbitration, Mediation and Conciliation matters',
      'Preparation and execution of Contracts and other agreements'
    ],
    services: [
      'Legal consultation',
      'Contract preparation and review',
      'Dispute resolution',
      'Legal documentation',
      'Arbitration and mediation services'
    ],
    contact: {

      email: 'bayodele115@yahoo.com',
      office: 'Legal Unit, LCDA Secretariat'
    },
    hours: 'Mon - Fri: 8:00 AM - 4:00 PM'
  },
  {
    id: 16,
    name: 'Area Office A',
    slug: 'area-office-a',
    icon: MapPinned,
    color: 'bg-lime-600',
    head: {
      name: 'Mrs. Kelani-Bankole Afusat Olayinka',
      title: 'HOD, Area Office A',
      image: '/assets/mocha/area-a-hod-west.jpeg',
      deploymentDate: '26th January, 2026'
    },
    description: 'Serves as the local administrative hub for Area A, providing direct government services and community liaison for residents.',
    responsibilities: [
      'Coordinate revenue collection through regular briefing of Council Manager on activities of Area office',
      'Liaise with the Council Treasurer on the billing system to know appropriate rates to charge members of the public',
      'Ensures bills collected are promptly served',
      'Organise follow up and enforcement on bills served if and when necessary',
      'Review performance of all revenue collectors'
    ],
    services: [
      'Certificate issuance',
      'Community meetings',
      'Local dispute resolution',
      'Government services access'
    ],
    contact: {

      email: 'olayinkakelani@gmail.com',
      office: 'Area Office A'
    },
    hours: 'Mon - Fri: 8:00 AM - 4:00 PM'
  },
  {
    id: 17,
    name: 'Area Office B',
    slug: 'area-office-b',
    icon: MapPinned,
    color: 'bg-emerald-600',
    head: {
      name: 'Mrs. Oluwatoyin Abiodun Oke',
      title: 'HOD, Area Office B',
      image: '/assets/mocha/area-b-hod-west.jpeg',
      deploymentDate: '29th December 2023'
    },
    description: 'Serves as the local administrative hub for Area B, providing direct government services and community liaison for residents.',
    responsibilities: [
      'Local administration',
      'Community liaison',
      'Service delivery',
      'Dispute resolution',
      'Government representation'
    ],
    services: [
      'Certificate issuance',
      'Community meetings',
      'Local dispute resolution',
      'Government services access'
    ],
    programs: [
      {
        name: 'Area Officer Duties & Responsibilities',
        activities: [
          'Brief CM regularly on activities of the Area office',
          'Liaise with CT on billing system to know the appropriate rates to charge public',
          'Ensure bills collected are served to rate payers promptly',
          'Ensure ledgers are updated',
          'Organise follow up and enforcement on bills served if and when necessary',
          'Review performance of all revenue collectors'
        ]
      }
    ],
    contact: {

      email: 'toyeendosunmu719@gmail.com',
      office: 'Area Office B'
    },
    hours: 'Mon - Fri: 8:00 AM - 4:00 PM'
  },
  {
    id: 18,
    name: 'Clerk of the House',
    slug: 'clerk-of-house',
    icon: ScrollText,
    color: 'bg-amber-600',
    head: {
      name: 'Mr. Morakinyo Mayowa',
      title: 'HOD, Clerk of the House',
      image: '/assets/mocha/hod-clerk-west.jpeg',
      deployment: 'April 2025'
    },
    description: 'Manages legislative proceedings, maintains council records, and provides administrative support to the Legislative Council.',
    responsibilities: [
      'Administering the proceedings of procedural rules and official records of the Legislative Council',
      'Certifying passed legislation',
      'Acting as Chief Administrative Officer of the Legislative Council',
      'Council meeting coordination',
      'Record keeping and documentation management',
      'Protocol services'
    ],
    services: [
      'Council resolutions access',
      'Meeting minutes',
      'Legislative information',
      'Public gallery coordination'
    ],
    contact: {

      email: 'morakinyomayowa@gmail.com',
      office: 'Council Chambers, LCDA Secretariat'
    },
    hours: 'Mon - Fri: 8:00 AM - 4:00 PM'
  },
  {
    id: 19,
    name: 'Procurement',
    slug: 'procurement',
    icon: ShoppingCart,
    color: 'bg-fuchsia-600',
    head: {
      name: 'To Be Appointed',
      title: 'HOD, Procurement',
      image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=200&h=200&fit=crop'
    },
    description: 'Manages the acquisition of goods and services for the LCDA, ensuring transparency, value for money, and compliance with procurement regulations.',
    responsibilities: [
      'Procurement planning',
      'Vendor management',
      'Contract administration',
      'Bid evaluation',
      'Procurement compliance'
    ],
    services: [
      'Vendor registration',
      'Bid submissions',
      'Contract inquiries',
      'Procurement documentation'
    ],
    contact: {

      email: 'procurement@ikoroduwestlcda.gov.ng',
      office: 'Procurement Office, LCDA Secretariat'
    },
    hours: 'Mon - Fri: 8:00 AM - 4:00 PM'
  }
];

export default function DepartmentsPage() {
  const [expandedDept, setExpandedDept] = useState<number | null>(null);

  const toggleDepartment = (id: number) => {
    setExpandedDept(expandedDept === id ? null : id);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <nav className="flex items-center gap-2 text-white/70 text-sm mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Departments</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Our Departments
          </h1>
          <p className="text-xl text-white/80 leading-relaxed max-w-3xl">
            Eighteen departments and offices working together to deliver quality services 
            and drive sustainable development across Ikorodu West LCDA.
          </p>
        </div>
      </section>

      {/* Department Overview Grid */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {departments.map((dept) => (
              <a
                key={dept.id}
                href={`#${dept.slug}`}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all group"
              >
                <div className={`w-12 h-12 ${dept.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <dept.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                  {dept.name}
                </h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Department Profiles */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Meet Our Teams</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Department Profiles
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Learn about each department's leadership, responsibilities, and services available to citizens.
            </p>
          </div>

          <div className="space-y-6">
            {departments.map((dept) => (
              <Card 
                key={dept.id} 
                id={dept.slug}
                className="overflow-hidden border-0 shadow-lg scroll-mt-24"
              >
                {/* Department Header */}
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => toggleDepartment(dept.id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Icon & Name */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-16 h-16 ${dept.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                        <dept.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{dept.name}</h3>
                        <p className="text-muted-foreground text-sm mt-1 line-clamp-2 md:line-clamp-1">
                          {dept.description}
                        </p>
                      </div>
                    </div>

                    {/* HOD Preview */}
                    <div className="flex items-center gap-3 md:border-l md:pl-6">
                      <img 
                        src={dept.head.image}
                        alt={dept.head.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="hidden sm:block">
                        <p className="font-medium text-sm">{dept.head.name}</p>
                        <p className="text-xs text-muted-foreground">{dept.head.title}</p>
                      </div>
                    </div>

                    {/* Expand Button */}
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="flex-shrink-0"
                    >
                      {expandedDept === dept.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedDept === dept.id && (
                  <CardContent className="px-6 pb-6 pt-0 border-t">
                    <div className="grid md:grid-cols-3 gap-8 mt-6">
                      {/* HOD Profile */}
                      <div>
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-primary" />
                          Department Head
                        </h4>
                        <div className="bg-muted/50 rounded-xl p-4">
                          <img 
                            src={dept.head.image}
                            alt={dept.head.name}
                            className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                          />
                          <div className="text-center">
                            <p className="font-semibold">{dept.head.name}</p>
                            <p className="text-sm text-muted-foreground">{dept.head.title}</p>
                          </div>
                        </div>

                        <div className="mt-4 space-y-3">
                          <div className="flex items-center gap-3 text-sm">
                            <Mail className="w-4 h-4 text-primary" />
                            <span className="truncate">{dept.contact.email}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{dept.contact.office}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>{dept.hours}</span>
                          </div>
                        </div>
                      </div>

                      {/* Responsibilities */}
                      <div>
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          Key Responsibilities
                        </h4>
                        <ul className="space-y-2">
                          {dept.responsibilities.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Services */}
                      <div>
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                          <HandHeart className="w-4 h-4 text-primary" />
                          Services Offered
                        </h4>
                        <div className="space-y-2">
                          {dept.services.map((service, idx) => (
                            <Badge 
                              key={idx} 
                              variant="outline" 
                              className="mr-2 mb-2"
                            >
                              {service}
                            </Badge>
                          ))}
                        </div>

                        <div className="mt-6">
                          <Button asChild className="w-full">
                            <Link to={`/services?department=${dept.slug}`}>
                              Request a Service
                              <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Program Areas - For departments with expanded programs */}
                    {'programs' in dept && dept.programs && (
                      <div className="mt-8 pt-6 border-t">
                        <h4 className="font-semibold mb-6 flex items-center gap-2 text-lg">
                          {dept.slug === 'agriculture' ? <Leaf className="w-5 h-5 text-green-600" /> : 
                           dept.slug === 'finance' ? <Wallet className="w-5 h-5 text-emerald-600" /> :
                           <Users className="w-5 h-5 text-primary" />}
                          {dept.slug === 'agriculture' ? 'Agricultural Services' : 
                           dept.slug === 'finance' ? 'PBRS Functions, Duties & Responsibilities' :
                           'Program Areas & Activities'}
                        </h4>
                        {dept.slug === 'agriculture' && (
                          <p className="text-sm text-muted-foreground mb-6 -mt-2">
                            This includes all services that promote food security, job creation and value addition in the production chain.
                          </p>
                        )}
                        {dept.slug === 'finance' && (
                          <p className="text-sm text-muted-foreground mb-6 -mt-2">
                            Economic Planning, Research and Statistics (EPRS) Department — the "brain" of the Local Government handling data, analysis, and forward planning framework.
                          </p>
                        )}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {(dept.programs as { name: string; activities: string[] }[]).map((program, idx) => (
                            <div 
                              key={idx} 
                              className={`rounded-xl p-4 border ${
                                dept.slug === 'agriculture' 
                                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-100 dark:border-green-900/30'
                                  : dept.slug === 'finance'
                                  ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-100 dark:border-emerald-900/30'
                                  : 'bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 border-pink-100 dark:border-pink-900/30'
                              }`}
                            >
                              <h5 className={`font-semibold text-sm mb-3 flex items-center gap-2 ${
                                dept.slug === 'agriculture' ? 'text-green-700 dark:text-green-300' : 
                                dept.slug === 'finance' ? 'text-emerald-700 dark:text-emerald-300' :
                                'text-pink-700 dark:text-pink-300'
                              }`}>
                                <span className={`w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-bold ${
                                  dept.slug === 'agriculture' ? 'bg-green-600' : 
                                  dept.slug === 'finance' ? 'bg-emerald-600' :
                                  'bg-pink-500'
                                }`}>
                                  {idx + 1}
                                </span>
                                {program.name}
                              </h5>
                              <ul className="space-y-1.5">
                                {program.activities.map((activity, actIdx) => (
                                  <li key={actIdx} className="flex items-start gap-2 text-xs text-muted-foreground">
                                    <div className={`w-1 h-1 rounded-full mt-1.5 flex-shrink-0 ${
                                      dept.slug === 'agriculture' ? 'bg-green-500' : 
                                      dept.slug === 'finance' ? 'bg-emerald-500' :
                                      'bg-pink-400'
                                    }`} />
                                    <span>{activity}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Social Services Programs - For Agric & Social Services department */}
                    {'socialServicesPrograms' in dept && dept.socialServicesPrograms && (
                      <div className="mt-8 pt-6 border-t">
                        <h4 className="font-semibold mb-6 flex items-center gap-2 text-lg">
                          <HandHeart className="w-5 h-5 text-orange-600" />
                          Social Services
                        </h4>
                        <p className="text-sm text-muted-foreground mb-6 -mt-2">
                          These are the activities/jobs given to people to aid them during their time of needs.
                        </p>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {(dept.socialServicesPrograms as { name: string; activities: string[] }[]).map((program, idx) => (
                            <div 
                              key={idx} 
                              className="rounded-xl p-4 border bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-100 dark:border-orange-900/30"
                            >
                              <h5 className="font-semibold text-sm mb-3 flex items-center gap-2 text-orange-700 dark:text-orange-300">
                                <span className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold">
                                  {idx + 1}
                                </span>
                                {program.name}
                              </h5>
                              <ul className="space-y-1.5">
                                {program.activities.map((activity, actIdx) => (
                                  <li key={actIdx} className="flex items-start gap-2 text-xs text-muted-foreground">
                                    <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0 bg-orange-500" />
                                    <span>{activity}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Organizational Chart */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Structure</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              How We're Organized
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our departments work collaboratively under the leadership of the Executive Chairman 
              to deliver integrated services to citizens.
            </p>
          </div>

          <div className="relative">
            {/* Chairman at top */}
            <div className="flex justify-center mb-8">
              <Card className="border-0 shadow-lg p-6 text-center bg-primary text-white max-w-xs">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="font-bold">Executive Chairman</h3>
                <p className="text-white/70 text-sm">Hon. Otunba Suliamon Kazeem Olarewaju FCA, FCTI</p>
              </Card>
            </div>

            {/* Connecting line */}
            <div className="hidden md:block absolute left-1/2 top-[140px] w-px h-8 bg-border" />

            {/* Second level */}
            <div className="flex justify-center gap-8 mb-8 flex-wrap">
              <Card className="border-0 shadow-md p-4 text-center max-w-xs">
                <h4 className="font-semibold text-sm">Vice Chairman</h4>
                <p className="text-muted-foreground text-xs">Hon. Funke Williams</p>
              </Card>
              <Card className="border-0 shadow-md p-4 text-center max-w-xs">
                <h4 className="font-semibold text-sm">LCDA Secretary</h4>
                <p className="text-muted-foreground text-xs">Mr. Emmanuel Nwosu</p>
              </Card>
            </div>

            {/* Departments grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {departments.map((dept) => (
                <Card key={dept.id} className="border-0 shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div className={`w-10 h-10 ${dept.color} rounded-lg flex items-center justify-center mb-2`}>
                    <dept.icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-medium text-xs line-clamp-2">{dept.name}</h4>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/90 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Need Help from a Department?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Our departments are here to serve you. Submit a service request or contact us directly 
            for assistance with any government service.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 px-8">
              <Link to="/services/request">
                Submit Service Request
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">
              <Link to="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
