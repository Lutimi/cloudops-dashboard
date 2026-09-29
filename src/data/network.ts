import {
  Wifi,
  Waypoints,
  Cloud,
  Network,
  Router,
  Scale,
  Server,
  Database,
} from 'lucide-react';
import type { NetworkNodeInfo } from '../types/cloud';

export const networkNodes: NetworkNodeInfo[] = [
  {
    id: 'internet',
    name: 'Internet',
    sub: 'Usuarios y clientes finales',
    scope: 'Externo',
    description:
      'Punto de partida del tráfico: los usuarios acceden desde cualquier dispositivo mediante un navegador o app móvil.',
    details: [
      'Entrada cifrada exclusivamente vía HTTPS',
      'Certificado TLS emitido con AWS ACM',
      'Mitigación de ataques con AWS Shield Estándar',
    ],
    protocol: 'HTTPS 443',
    icon: Wifi,
  },
  {
    id: 'route53',
    name: 'Route 53',
    sub: 'DNS público administrado',
    scope: 'Global',
    description:
      'Traduce el dominio público de la aplicación a la distribución de CloudFront, con verificaciones de estado activas.',
    details: [
      'Registros A/AAAA hacia CloudFront',
      'Política de enrutamiento por latencia',
      'Zona pública: cloudops.example.com',
    ],
    protocol: 'UDP/TCP 53',
    icon: Waypoints,
  },
  {
    id: 'cloudfront',
    name: 'CloudFront',
    sub: 'Red de distribución de contenido',
    scope: 'Global',
    description:
      'Entrega los archivos estáticos desde el punto de presencia más cercano al usuario y reenvía el resto al origen.',
    details: [
      'Más de 400 ubicaciones de borde',
      'Terminación TLS en el borde con ACM',
      'Origen: balanceador dentro de la VPC',
    ],
    protocol: 'HTTPS 443',
    icon: Cloud,
  },
  {
    id: 'vpc',
    name: 'VPC 10.0.0.0/16',
    sub: 'Red virtual privada us-east-1',
    scope: 'VPC',
    description:
      'Perímetro de red aislado donde viven las subredes públicas y privadas de la aplicación.',
    details: [
      '2 subredes públicas y 2 privadas en 2 AZ',
      'Tablas de rutas y NACL por subred',
      'Sin solapamiento con redes on-premise',
    ],
    protocol: 'Interno',
    icon: Network,
  },
  {
    id: 'igw',
    name: 'Internet Gateway',
    sub: 'Puerta de enlace de la VPC',
    scope: 'Subred pública',
    description:
      'Único punto de entrada y salida del tráfico hacia Internet para toda la VPC.',
    details: [
      'Ruta 0.0.0.0/0 desde las subredes públicas',
      'Alta disponibilidad administrada por AWS',
      'Sin restricciones de ancho de banda',
    ],
    protocol: 'IPv4 / IPv6',
    icon: Router,
  },
  {
    id: 'alb',
    name: 'ALB',
    sub: 'Application Load Balancer',
    scope: 'Subred pública',
    description:
      'Distribuye las peticiones HTTP(S) entre las instancias EC2 y descarga la terminación TLS.',
    details: [
      'Escucha 443 y redirección 80→443',
      'Grupos objetivo: instancias del Auto Scaling',
      'Security Group: solo acepta tráfico de CloudFront',
    ],
    protocol: 'HTTPS 443',
    icon: Scale,
  },
  {
    id: 'ec2',
    name: 'EC2 × 2',
    sub: 'Instancias de aplicación',
    scope: 'Subred privada',
    description:
      'Núcleo de la aplicación empresarial desplegado en instancias de dos zonas de disponibilidad.',
    details: [
      'Auto Scaling de 2 a 6 instancias',
      'Amazon Linux 2023 con parches vía SSM',
      'Acceso operativo por Session Manager (sin SSH)',
    ],
    protocol: 'TCP 443',
    icon: Server,
  },
  {
    id: 'rds',
    name: 'RDS MySQL',
    sub: 'Base de datos administrada',
    scope: 'Subred privada',
    description:
      'Capa transaccional con réplica en espera Multi-AZ y acceso exclusivo desde las instancias.',
    details: [
      'Multi-AZ dentro de us-east-1',
      'Cifrado en reposo con KMS',
      'Backups automáticos de 7 días',
    ],
    protocol: 'TCP 3306',
    icon: Database,
  },
];
