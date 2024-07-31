import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClienteService } from './cliente.service';
import { ConfigService } from './config.service';
import { ClientePage } from '../../models/cliente-page';
import { Cliente } from '../../models/cliente';
import { MockClientePut, MockClientePages, MockClientePost } from '../mock/mockParaTestes';

describe('ClienteService', () => {
  let service: ClienteService;
  let httpMock: HttpTestingController;
  let configServiceSpy: jasmine.SpyObj<ConfigService>;

  const apiUrl = 'http://test-api.com';

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ConfigService', ['get']);
    spy.get.and.returnValue({ WebApi: apiUrl });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ClienteService,
        { provide: ConfigService, useValue: spy }
      ]
    });

    service = TestBed.inject(ClienteService);
    httpMock = TestBed.inject(HttpTestingController);
    configServiceSpy = TestBed.inject(ConfigService) as jasmine.SpyObj<ConfigService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getCliente', () => {
    it('should return expected ClientePage', () => {
      const expectedClientePage = MockClientePages;

      service.getCliente(1, 10).subscribe(clientePage => {
        expect(clientePage).toEqual(expectedClientePage);
      });

      const req = httpMock.expectOne(`${apiUrl}/Cliente?PageNumber=1&PageSize=10`);
      expect(req.request.method).toBe('GET');
      req.flush(expectedClientePage);
    });
  });

  describe('#postCliente', () => {
    it('should post the cliente and return response', () => {
      const cliente = MockClientePost;
      const response = { /* dados fictícios de resposta */ };

      service.postCliente(cliente).subscribe(res => {
        expect(res).toEqual(response);
      });

      const req = httpMock.expectOne(`${apiUrl}/Cliente`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(cliente);
      req.flush(response);
    });
  });

  describe('#putCliente', () => {
    it('should update the cliente and return response', () => {
      const cliente = MockClientePut;
      const response = MockClientePut;

      service.putCliente(cliente).subscribe(res => {
        expect(res).toEqual(response);
      });

      const req = httpMock.expectOne(`${apiUrl}/Cliente/${cliente.id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(cliente);
      req.flush(response);
    });
  });

  describe('#getByName', () => {
    it('should return expected ClientePage for the given name', () => {
      const name = 'John';
      const expectedClientePage = MockClientePages;

      service.getByName(name, 1, 10).subscribe(clientePage => {
        expect(clientePage).toEqual(expectedClientePage);
      });

      const req = httpMock.expectOne(`${apiUrl}/Cliente/ByName?name=John&pageNumber=1&pageSize=10`);
      expect(req.request.method).toBe('GET');
      req.flush(expectedClientePage);
    });
  });
});