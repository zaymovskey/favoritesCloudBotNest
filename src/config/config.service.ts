import { type IConfigService } from './config.interface';
import { type DotenvParseOutput, config } from 'dotenv';

export class ConfigService implements IConfigService {
  private readonly config: DotenvParseOutput;
  constructor() {
    const { error, parsed } = config();

    if (error != null) throw new Error('.env file not found');
    if (parsed == null) throw new Error('.env file is empty');

    this.config = parsed;
  }

  get(key: string): string {
    const res = this.config[key];
    if (res === '') throw new Error('There is no such key');

    return res;
  }
}
