import { SetMetadata } from '@nestjs/common';

export const RequiresFeatures = (...features: string[]) => SetMetadata('features', features);
