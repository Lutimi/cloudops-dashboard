import {
  Server,
  Zap,
  HardDrive,
  Database,
  Layers,
  KeyRound,
  Lock,
  Network,
  Waypoints,
  Cloud,
  Scale,
  Activity,
} from 'lucide-react';
import type { AWSService, ServiceCategory } from '../types/cloud';

export const serviceCategories: ServiceCategory[] = [
  'Cómputo',
  'Almacenamiento',
  'Base de datos',
  'Seguridad',
  'Redes',
  'Monitoreo',
];

export const awsServices: AWSService[] = [
  {
    id: 'ec2',
    name: 'Amazon EC2',
    category: 'Cómputo',
    description:
      'Servidores virtuales escalables (instancias) con pago por uso y decenas de familias según la carga de trabajo.',
    mainFunction:
      'Proporcionar capacidad de cómputo bajo demanda para ejecutar la aplicación empresarial.',
    pricing: '$0.0416 por hora (t3.medium)',
    used: true,
    icon: Server,
  },
  {
    id: 'lambda',
    name: 'AWS Lambda',
    category: 'Cómputo',
    description:
      'Funciones serverless que se ejecutan ante eventos sin administrar servidores; se paga solo por tiempo de ejecución.',
    mainFunction:
      'Ejecutar lógica según demanda (procesamiento de archivos, webhooks) sin aprovisionamiento.',
    pricing: '$0.20 por 1M de solicitudes',
    used: true,
    icon: Zap,
  },
  {
    id: 's3',
    name: 'Amazon S3',
    category: 'Almacenamiento',
    description:
      'Almacenamiento de objetos con durabilidad de 11 nueves, versionado y clases de acceso según frecuencia.',
    mainFunction:
      'Almacenar documentos, archivos estáticos y copias de seguridad de la aplicación.',
    pricing: '$0.023 por GB al mes (Estándar)',
    used: true,
    icon: HardDrive,
  },
  {
    id: 'rds',
    name: 'Amazon RDS',
    category: 'Base de datos',
    description:
      'Bases de datos relacionales administradas (MySQL, PostgreSQL) con backups y parches automáticos.',
    mainFunction:
      'Operar la capa de datos transaccional con alta disponibilidad Multi-AZ.',
    pricing: 'Desde $0.067 por hora (db.t3.medium)',
    used: true,
    icon: Database,
  },
  {
    id: 'dynamodb',
    name: 'Amazon DynamoDB',
    category: 'Base de datos',
    description:
      'Base de datos NoSQL serverless con latencia de milisegundos a cualquier escala.',
    mainFunction:
      'Almacenar datos de acceso clave-valor para sesiones y catálogos de alta concurrencia.',
    pricing: '$0.25 por 25 WCU aprovisionadas',
    used: false,
    icon: Layers,
  },
  {
    id: 'iam',
    name: 'AWS IAM',
    category: 'Seguridad',
    description:
      'Gestión centralizada de usuarios, grupos, roles y políticas de acceso a los recursos de la cuenta.',
    mainFunction:
      'Controlar quién puede hacer qué sobre cada recurso de AWS (autenticación y autorización).',
    pricing: 'Sin costo adicional',
    used: true,
    icon: KeyRound,
  },
  {
    id: 'kms',
    name: 'AWS KMS',
    category: 'Seguridad',
    description:
      'Creación y control de claves criptográficas administradas para cifrar datos en reposo.',
    mainFunction:
      'Cifrar volúmenes, buckets de S3 y bases de datos RDS con claves gestionadas.',
    pricing: '$1.00 por clave activa al mes',
    used: false,
    icon: Lock,
  },
  {
    id: 'vpc',
    name: 'Amazon VPC',
    category: 'Redes',
    description:
      'Red virtual aislada lógicamente donde se despliegan subredes, tablas de rutas y gateways.',
    mainFunction:
      'Definir el perímetro de red privado con subredes públicas y privadas por zonas.',
    pricing: 'Sin costo base (NAT: $0.045 por hora)',
    used: true,
    icon: Network,
  },
  {
    id: 'route53',
    name: 'Amazon Route 53',
    category: 'Redes',
    description:
      'Servicio DNS administrado y escalable con verificaciones de estado y enrutamiento por latencia.',
    mainFunction:
      'Resolver el dominio público y dirigir a los usuarios hacia CloudFront.',
    pricing: '$0.50 por zona hospedada al mes',
    used: true,
    icon: Waypoints,
  },
  {
    id: 'cloudfront',
    name: 'Amazon CloudFront',
    category: 'Redes',
    description:
      'Red de distribución de contenido (CDN) con más de 400 puntos de presencia en el mundo.',
    mainFunction:
      'Distribuir contenido estático y dinámico desde el borde más cercano al usuario final.',
    pricing: '$0.085 por GB transferido',
    used: true,
    icon: Cloud,
  },
  {
    id: 'elb',
    name: 'Elastic Load Balancing',
    category: 'Redes',
    description:
      'Balanceadores administrados que distribuyen el tráfico entre instancias y zonas de disponibilidad.',
    mainFunction:
      'Repartir las peticiones HTTP entre las instancias EC2 del grupo de auto scaling.',
    pricing: '$0.025 por hora por balanceador',
    used: true,
    icon: Scale,
  },
  {
    id: 'cloudwatch',
    name: 'Amazon CloudWatch',
    category: 'Monitoreo',
    description:
      'Métricas, logs y alarmas integradas para todos los recursos de AWS y aplicaciones.',
    mainFunction:
      'Monitorear el estado, la latencia y las alarmas de la infraestructura en tiempo real.',
    pricing: '$0.30 por métrica personalizada al mes',
    used: true,
    icon: Activity,
  },
];

export const usedServiceNames = awsServices
  .filter((service) => service.used)
  .map((service) => service.name);

export const shortServiceName = (name: string): string =>
  name
    .replace('Amazon ', '')
    .replace('AWS ', '')
    .replace('Elastic Load Balancing', 'ELB');

export const countUsedServices = (): number => awsServices.filter((service) => service.used).length;
