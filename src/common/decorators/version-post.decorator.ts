import { Post } from '@nestjs/common';

export const VersionPost = ({ path, version }) => Post(`${version}/${path}`);
