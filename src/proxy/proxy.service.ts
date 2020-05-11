import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ProxyService {
  private readonly ytEndpoint: string =
    'https://www.googleapis.com/youtube/v3/videos?id=';
  private readonly requestParams: string = 'snippet';

  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  private prepareRequest(ytID: string): string {
    const apiKey: string = this.config.getApiKey();
    return this.ytEndpoint
      .concat(ytID)
      .concat('&key=' + apiKey)
      .concat('&part=' + this.requestParams);
  }

  callYtApi(ytID: string): Observable<JSON> {
    return this.httpService
      .get(this.prepareRequest(ytID))
      .pipe(map(response => response.data));
  }
}
