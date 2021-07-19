import { Get } from '@nestjs/common';

export const VersionGet = ({ path, version }) => Get(`${version}/${path}`);
