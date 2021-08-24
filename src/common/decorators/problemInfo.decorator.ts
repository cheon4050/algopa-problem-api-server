import { Get } from '@nestjs/common';

export const problemInfoGet = ({ path, version, id }) =>
  Get(`${version}/${path}/${id}`);
