import {
  Asset,
  AssetDetails,
  BoundingBox,
  Event,
  Client,
  EventOrder,
  OrderReport,
  OrderStats,
  OrderStatus,
  ReportLoadResult,
  UserInformation
} from '../models/models';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AccountInfo, IPublicClientApplication } from '@azure/msal-browser';
import { SilentRequest } from '@azure/msal-browser/dist/request/SilentRequest';
import { loginRequest } from '../msalConfig';
import jwt_decode from 'jwt-decode';

type Grouping = { [key in OrderStatus]: number };

class BackendService {
  private token: null | string;
  private backendsMap = {
    'localhost:3000': 'https://sb-starc-wa-we-sb2-api.azurewebsites.net/api/v1',
    'starc-frontend.azurewebsites.net': 'https://starcweb-api.azurewebsites.net'
  } as any;

  private baseUrl: string | null;
  private axios: AxiosInstance | null;
  private tokenExpiresOn: number | null = null;
  private msal: IPublicClientApplication | null = null;
  private refreshRequest: SilentRequest | null = null;

  constructor() {
    this.token = null;
    const host = window.location.host.toLowerCase();
    let baseUrl = this.backendsMap[host];

    // If it is not possible to determine backend - fall back to local development
    if (baseUrl == null) {
      console.log('Cannot determine backend url, falling back to localhost...');
      baseUrl = this.backendsMap['localhost:3000'];
    }

    this.baseUrl = baseUrl;

    // Axios's instance that will be used to communicate with backend
    const instance = axios.create();

    // Interceptor that adds token from msal to all requests to backend
    instance.interceptors.request.use(
      async config => {
        config.headers = config.headers || {};

        this.checkExpired();

        if (this.token == null) {
          await this.issueToken();
        }

        if (this.token != null) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    this.axios = instance;
  }

  checkExpired = () => {
    if (this.tokenExpiresOn && this.tokenExpiresOn >= new Date().getTime()) {
      this.tokenExpiresOn = null;
      this.token = null;
    }
  };

  acquireToken = async () => {
    return await this.msal!!.acquireTokenSilent(this.refreshRequest!!);
  };

  issueToken = async () => {
    const res = await this.acquireToken();
    this.tokenExpiresOn = res.expiresOn!!.getTime();
    this.token = res.accessToken;
  };

  setMsalInstance = async (msal: IPublicClientApplication, account: AccountInfo) => {
    this.refreshRequest = { account, scopes: loginRequest.scopes };
    this.msal = msal;
    await this.issueToken();
  };

  loadUserInfo = async (): Promise<UserInformation> => {
    if (this.token == null) {
      await this.issueToken();
    }
    const decoded: any = jwt_decode(this.token!!);
    return Promise.resolve({ accountName: decoded.name });
  };

  // ClientsView
  saveClient = async (id: string | null, name: string, contactEmail: string): Promise<void> => {
    const request = {
      name: name,
      contactEmail: contactEmail
    } as any;

    if (id && id !== 'new') {
      request.id = id;
      await this.axios!.put(`${this.baseUrl}/clients/${id}`, request);
    } else {
      await this.axios!.post(`${this.baseUrl}/clients/`, request);
    }
  };

  archiveClient = (id: String): Promise<void> => {
    return this.axios!.get(`${this.baseUrl}/clients/${id}/archive`);
  };

  unArchiveClient = (id: String): Promise<void> => {
    return this.axios!.get(`${this.baseUrl}/clients/${id}/unarchive`);
  };

  loadClients = async (query: any): Promise<Client[]> => {
    try {
      return await this.axios!.get<Client[]>(`${this.baseUrl}/clients`).then((it: AxiosResponse) => {
        return it.data == null || it.data === '' ? [] : it.data;
      });
    } catch (e: any) {
      console.log('error');
      if (e.response.status === 404) {
        return Promise.resolve([]);
      } else {
        throw e;
      }
    }
  };

  async loadClientDetails(id: string): Promise<Client> {
    return this.axios!.get<Client>(`${this.baseUrl}/clients/${id}`).then((it: AxiosResponse) => {
      return it.data;
    });
  }

  // AssetsView
  archiveAsset = (id: String): Promise<void> => {
    return this.axios!.get(`${this.baseUrl}/assets/${id}/archive`);
  };

  unArchiveAsset = (id: string): Promise<void> => {
    return this.axios!.get(`${this.baseUrl}/assets/${id}/unarchive`);
  };

  // augmentAsset includes in trainAsset
  // TODO remove one that is not used
  augmentAsset = (id: string): Promise<void> => {
    return this.axios!.get(`${this.baseUrl}/assets/${id}/start-training`);
  };

  trainAsset = (id: string): Promise<void> => {
    return this.axios!.get(`${this.baseUrl}/assets/${id}/start-training`);
  };

  saveAsset = async (id: string | null, name: string, image: File | null, clientId: string | null): Promise<void> => {
    if (id) {
      await this.axios!.put(`${this.baseUrl}/assets/${id}`, { id, clientId, name });
    } else {
      const fd = new FormData();

      fd.append('name', name);

      if (image != null) {
        fd.append('image', image);
      }

      if (clientId != null) {
        fd.append('clientId', clientId);
      }

      await this.axios!.post(`${this.baseUrl}/assets/`, fd);
    }
  };

  loadAssets = async (clientId: String | Number | null): Promise<Asset[]> => {
    try {
      const url = clientId ? `${this.baseUrl}/clients/${clientId}/assets` : `${this.baseUrl}/assets`;

      return await this.axios!.get<Asset[]>(url).then((it: AxiosResponse) => {
        return it.data;
      });
    } catch (e: any) {
      if (e.response.status === 404) {
        return Promise.resolve([]);
      } else {
        throw e;
      }
    }
  };

  async loadAssetDetails(id: string): Promise<AssetDetails> {
    return this.axios!.get<AssetDetails>(`${this.baseUrl}/assets/${id}`).then((it: AxiosResponse) => {
      return it.data;
    });
  }

  // EventsView
  loadEvents = async (query: any): Promise<Event[]> => {
    try {
      return await this.axios!.get<Event[]>(`${this.baseUrl}/events`).then((it: AxiosResponse) => {
        return it.data == null || it.data === '' ? [] : it.data;
      });
    } catch (e: any) {
      if (e.response.status === 404) {
        return Promise.resolve([]);
      } else {
        throw e;
      }
    }
  };

  // Orders
  loadEventOrders = async (id: string): Promise<EventOrder[]> => {
    try {
      //TODO REPLACE with new endpoint
      return await this.axios!.get<EventOrder[]>(`${this.baseUrl}/events/${id}/orders`).then((it: AxiosResponse) => {
        return it.data;
      });
    } catch (e: any) {
      if (e.response.status === 404) {
        return Promise.resolve([]);
      } else {
        throw e;
      }
    }
  };

  loadOrders = async (status: OrderStatus | null): Promise<EventOrder[]> => {
    try {
      return await this.axios!.get<EventOrder[]>(`${this.baseUrl}/orders`).then((it: AxiosResponse) => {
        if (status == null) {
          return it.data;
        } else {
          return it.data.filter((order: EventOrder) => order.status === status);
        }
      });
    } catch (e: any) {
      if (e.response.status === 404) {
        return Promise.resolve([]);
      } else {
        throw e;
      }
    }
  };

  loadEventDetails = (id: string): Promise<Event> => {
    return this.axios!.get<Event>(`${this.baseUrl}/events/${id}`).then((it: AxiosResponse) => {
      return it.data;
    });
  };

  loadOrdersStats = async (): Promise<Array<OrderStats>> => {
    const allOrders = await this.loadOrders(null);

    const groupedOrders = allOrders.reduce((pv: Grouping, cv: EventOrder) => {
      if (pv[cv.status] == null) {
        pv[cv.status] = 0;
      }
      pv[cv.status] = pv[cv.status] + 1;
      return pv;
    }, {} as Grouping);

    Object.keys(OrderStatus)
      .filter(it => {
        return groupedOrders[it as OrderStatus] == null;
      })
      .forEach(it => {
        groupedOrders[it as OrderStatus] = 0;
      });

    // @ts-ignore
    return Object.keys(groupedOrders).map((s: OrderStatus) => {
      return { type: s, count: groupedOrders[s] as number } as OrderStats;
    });
  };

  loadOrdersDetails = (id: string): Promise<EventOrder> => {
    return this.axios!.get<EventOrder>(`${this.baseUrl}/orders/${id}`).then((it: AxiosResponse) => {
      return it.data;
    });
  };

  async createOrder(o: EventOrder): Promise<void> {
    await this.axios!.post(`${this.baseUrl}/orders`, o);
  }

  async loadReport(id: string): Promise<ReportLoadResult> {
    const [{ data: report }, { data: boxes }] = await Promise.all([
      this.axios!.get<OrderReport>(`${this.baseUrl}/${id}/prediction-result`),
      this.axios!.get<any>(`${this.baseUrl}/${id}/prediction-result/bounding-boxes`)
    ]);

    return {
      report,
      boxes: boxes.map((it: any) => {
        return it.boundingBoxesDTOs.filter((it: BoundingBox) => it.probability * 100 >= report.minimumProbabilityPercentage);
      })
    } as ReportLoadResult;
  }

  async generateReport(id: string) {
    return this.axios!.get(`${this.baseUrl}/orders/${id}/start-predict`);
  }
}

export default new BackendService();
