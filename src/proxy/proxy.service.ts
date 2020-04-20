import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class ProxyService {
  private readonly ytEndpoint: string =
    'https://www.googleapis.com/youtube/v3/videos?id=';
  private readonly requestParams: string = 'snippet,contentDetails,player';

  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  private prepareRequest(ytID: string): string {
    const apiKey: string = this.config.getApiKey();
    return this.ytEndpoint.concat(ytID).concat('&part=' + this.requestParams);
  }

  async callYtApi(ytID: string): Promise<Observable<AxiosResponse<JSON>>> {
    return this.httpService.get(this.prepareRequest(ytID));
  }
}
