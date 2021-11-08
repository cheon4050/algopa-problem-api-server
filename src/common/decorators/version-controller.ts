import { Controller } from '@nestjs/common';

export const VController = ({ path, version }) =>
  Controller(`${version}/${path}`);
