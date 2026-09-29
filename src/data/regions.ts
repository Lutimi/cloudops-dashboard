import type { CloudRegion } from '../types/cloud';

export const regions: CloudRegion[] = [
  {
    id: 'us-east-1',
    code: 'us-east-1',
    name: 'EE. UU. Este (Norte de Virginia)',
    location: 'Norte de Virginia, Estados Unidos',
    continent: 'América del Norte',
    azCount: 3,
    latencyMs: 120,
    services: ['EC2', 'S3', 'RDS', 'CloudFront', 'Route 53', 'ELB'],
    status: 'ok',
    note: 'Región principal de despliegue con catálogo completo de servicios.',
  },
  {
    id: 'us-west-2',
    code: 'us-west-2',
    name: 'EE. UU. Oeste (Oregón)',
    location: 'Boardman, Oregón, Estados Unidos',
    continent: 'América del Norte',
    azCount: 3,
    latencyMs: 150,
    services: ['EC2', 'S3', 'RDS', 'CloudWatch'],
    status: 'info',
    note: 'Región de respaldo (DR) para continuidad del negocio ante una interrupción.',
  },
  {
    id: 'sa-east-1',
    code: 'sa-east-1',
    name: 'América del Sur (São Paulo)',
    location: 'São Paulo, Brasil',
    continent: 'América del Sur',
    azCount: 3,
    latencyMs: 90,
    services: ['EC2', 'S3', 'CloudFront'],
    status: 'warning',
    note: 'Catálogo de servicios reducido frente a las regiones de Norteamérica.',
  },
  {
    id: 'eu-west-1',
    code: 'eu-west-1',
    name: 'Europa (Irlanda)',
    location: 'Dublín, Irlanda',
    continent: 'Europa',
    azCount: 3,
    latencyMs: 230,
    services: ['EC2', 'S3', 'CloudFront', 'CloudWatch'],
    status: 'ok',
    note: 'Punto de presencia recomendado para usuarios en Europa.',
  },
  {
    id: 'eu-central-1',
    code: 'eu-central-1',
    name: 'Europa (Fráncfort)',
    location: 'Fráncfort, Alemania',
    continent: 'Europa',
    azCount: 3,
    latencyMs: 235,
    services: ['EC2', 'RDS', 'S3'],
    status: 'warning',
    note: 'Capacidad limitada en algunas familias de instancias.',
  },
  {
    id: 'ap-southeast-2',
    code: 'ap-southeast-2',
    name: 'Asia-Pacífico (Sídney)',
    location: 'Sídney, Australia',
    continent: 'Asia-Pacífico',
    azCount: 3,
    latencyMs: 265,
    services: ['EC2', 'S3', 'CloudFront'],
    status: 'ok',
    note: 'Baja demanda proyectada en esta fase del proyecto.',
  },
];

export const continents: string[] = [...new Set(regions.map((region) => region.continent))];

export const totalAzCount = regions.reduce((sum, region) => sum + region.azCount, 0);

export const getRegion = (id: string): CloudRegion =>
  regions.find((region) => region.id === id) ?? regions[0];
