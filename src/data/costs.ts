import type { CostableService, CostItem } from '../types/cloud';

export const costableServices: CostableService[] = [
  { id: 'ec2', service: 'Amazon EC2', unitRate: 0.0416, unitLabel: 'instancia' },
  { id: 'rds', service: 'Amazon RDS', unitRate: 0.067, unitLabel: 'instancia DB' },
  { id: 's3', service: 'Amazon S3', unitRate: 0.023, unitLabel: 'GB' },
  { id: 'cloudfront', service: 'Amazon CloudFront', unitRate: 0.085, unitLabel: 'GB transferido' },
  { id: 'route53', service: 'Amazon Route 53', unitRate: 14.5, unitLabel: 'zona + consultas' },
  { id: 'elb', service: 'Elastic Load Balancing', unitRate: 0.025, unitLabel: 'balanceador' },
  { id: 'lambda', service: 'AWS Lambda', unitRate: 0.2, unitLabel: '1M solicitudes' },
  { id: 'cloudwatch', service: 'Amazon CloudWatch', unitRate: 0.3, unitLabel: 'métrica custom' },
];

export const defaultCostItems: CostItem[] = [
  { id: 'item-ec2', serviceId: 'ec2', service: 'Amazon EC2', quantity: 3, hours: 730, unitRate: 0.0416, unitLabel: 'instancia' },
  { id: 'item-rds', serviceId: 'rds', service: 'Amazon RDS', quantity: 1, hours: 730, unitRate: 0.067, unitLabel: 'instancia DB' },
  { id: 'item-s3', serviceId: 's3', service: 'Amazon S3', quantity: 500, hours: 1, unitRate: 0.023, unitLabel: 'GB' },
  { id: 'item-cloudfront', serviceId: 'cloudfront', service: 'Amazon CloudFront', quantity: 2000, hours: 1, unitRate: 0.085, unitLabel: 'GB transferido' },
  { id: 'item-route53', serviceId: 'route53', service: 'Amazon Route 53', quantity: 1, hours: 1, unitRate: 14.5, unitLabel: 'zona + consultas' },
  { id: 'item-elb', serviceId: 'elb', service: 'Elastic Load Balancing', quantity: 1, hours: 730, unitRate: 0.025, unitLabel: 'balanceador' },
];
