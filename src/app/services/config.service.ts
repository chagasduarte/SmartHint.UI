import { Injectable } from '@angular/core';
import { Config } from '../models/config';
import  appConfig from "../../assets/settings/appConfig.json";

@Injectable({
  providedIn: 'root'
})
export class ConfigService{
  get(): Config {
    return appConfig.appConfig as Config;
  }
}
