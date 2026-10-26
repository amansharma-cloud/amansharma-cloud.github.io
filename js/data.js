// Single source of content for the DevOS-style extras (terminal, timer, skill bars).
window.DEVOS_DATA = {
  name: 'Aman Sharma',
  title: 'Senior DevOps Engineer',
  location: 'Pune, Maharashtra, India',
  email: 'amansharma.cloud@gmail.com',
  github: 'https://github.com/amansharma-cloud',
  linkedin: 'https://linkedin.com/in/aman-sharma-b0997a88',
  resume: 'Aman_Resume_DevOps_Engineer.pdf',
  careerStart: '2018-06-01T00:00:00', // TODO: confirm exact career start date
  about: 'Senior DevOps Engineer with 8+ years building secure, cost-optimized platforms on Azure & AWS. Kubernetes wrangler, Terraform whisperer, zero-downtime enthusiast.',
  skills: [ // TODO: confirm percentages
    { name: 'Azure / AKS', pct: 92 },
    { name: 'Terraform', pct: 90 },
    { name: 'Kubernetes', pct: 88 },
    { name: 'CI/CD (GitHub Actions, Jenkins)', pct: 90 },
    { name: 'AWS', pct: 82 },
    { name: 'DevSecOps', pct: 80 },
    { name: 'Observability', pct: 78 },
    { name: 'Python / Bash', pct: 75 }
  ],
  jobs: [
    { period: '2022 — Present', role: 'Senior Infrastructure Consultant', company: 'Thoughtworks' },
    { period: '2021 — 2022', role: 'DevOps Analyst', company: 'Deloitte' },
    { period: '2021', role: 'Infra DevOps Engineer', company: 'MavenWave (Atos)' },
    { period: '2018 — 2020', role: 'DevOps Engineer', company: 'Wipro' }
  ],
  certs: [
    'Microsoft Azure Fundamentals (AZ-900) — valid',
    'Certified Kubernetes Administrator (CKA) — in progress',
    'AWS Cloud Practitioner / SA Associate / DevOps Pro — expired'
  ],
  projects: [
    'AKS migration from VMSS with zero downtime',
    'KEDA event-driven autoscaling for Spark on AKS',
    'CI/CD modernization: GoCD -> GitHub Actions',
    'AI-built engineering dashboards (70% cost cut)'
  ]
};
